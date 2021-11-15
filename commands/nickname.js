const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const mysql = require('mysql2');
const config = require('../databaseConfig');
const connection = config.connection;

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`<:shelbyFailure:908851692408283136> **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** `)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Sets the nickname for a user.')
        .setDefaultPermission(false)
        .addUserOption(option =>
            option.setName('user')
                    .setDescription('The user to apply a nickname to.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('nickname')
                    .setDescription("The user's new display name.")
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('The reason for applying the nickname.')
                    .setRequired(false)),
    async execute(client, interaction) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`<:shelbyFailure:908851692408283136> **| Please make sure I have the \`Manage Nicknames\` permission before executing this command! |** `)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`MANAGE_NICKNAMES`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
            const memberTarger = interaction.options.getMember('user')
            const nicknameTarger = interaction.options.getString('nickname');
            const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
            const guildID = interaction.guildId;
            const pfp = memberTarger.displayAvatarURL();
            const owner = interaction.guild.fetchOwner();
            const getOwner = (await owner).id;
            console.log(interaction.commandId);

            const embed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor('Nickname set', `https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp`)
                    .setDescription(`<:shelbySuccess:908788558305820713> **| Nickname for ${memberTarger}\`(${memberTarger.user.tag})\` has been set to \`${nicknameTarger}\`: ${reasonTarger} |** `)

            await interaction.deferReply({ ephemeral: true });

            if (memberTarger.roles.highest.position >= interaction.guild.me.roles.highest.position || memberTarger.id === getOwner) {
                interaction.editReply({
                    embeds: [rejected],
                    ephemeral: true
                });
            } else {

            await memberTarger.setNickname(nicknameTarger);

            connection.execute(`SELECT log_channel_id FROM configuration WHERE guild_id= ? `, [guildID], function (err, result) {
                if (err) { throw err; };
                console.log(result);
        
                if(result == null) { 
                const logReject = new DiscordJS.MessageEmbed()
                        .setColor('#2f3136')
                        .setTitle('Unable to log action')
                        .setDescription(`<:shelbyFailure:908851692408283136> **| Action cannot be logged as there has been no logging channel found. |** ❌`)
    
                    interaction.followUp({
                        embeds: [logReject],
                        ephemeral: true
                    });
                } else {  
                    const logEmbed = new DiscordJS.MessageEmbed()
                        .setColor('#b8e4fd')
                        .setAuthor(`${memberTarger.user.tag} set new display name`, `${pfp}`)
                        .addField(`Invoker`, `${interaction.member} / \`${interaction.user.tag}\``, true)
                        .addField(`Target`, `${memberTarger} / \`${memberTarger.id}\``, true)
                        .addField(`Nickname`, `${nicknameTarger}`, true)
                        .addField(`Reason`, `${reasonTarger}`, true)
                        .setTimestamp()
    
                    const channel = client.channels.cache.get(result[0].log_channel_id.toString());
                    channel.send({embeds:[logEmbed]});
                };
            });
    
            interaction.editReply({
                embeds: [embed],
                ephemeral: true
                });
            };
        };
    },
};