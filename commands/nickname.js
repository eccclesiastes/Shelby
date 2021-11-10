const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const mysql = require('mysql2');
const config = require('../databaseConfig');
const connection = config.connection;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Sets the nickname for a user.')
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
                .setDescription(`❌ **| Please make sure I have the \`Manage Nicknames\` permission before executing this command! |** `)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`MANAGE_NICKNAMES`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
            const memberTarger = interaction.options.getUserOption('user');
            const nicknameTarger = interaction.options.getStringOption('nickname');
            const reasonTarger = interaction.options.getStringOption('reason') || 'No reason provided.';
            const guildID = interaction.guildId;
            const pfp = interaction.member.displayAvatarURL();

            const embed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Nickname set')
                    .setDescription(`❌ **| Nickname for ${memberTarger} has been set to ${nicknameTarger}: ${reasonTarger} |** `)

            await interaction.deferReply({ ephemeral: true });

            await memberTarger.setNickname(nicknameTarger);

            connection.execute(`SELECT log_channel_id FROM configuration WHERE guild_id= ? `, [guildID], function (err, result) {
                if (err) { throw err; };
                console.log(result);
        
                if(result == null) { 
                const logReject = new DiscordJS.MessageEmbed()
                        .setColor('#2f3136')
                        .setTitle('Unable to log action')
                        .setDescription(`❌ **| Action cannot be logged as there has been no logging channel found. |** ❌`)
    
                    interaction.followUp({
                        embeds: [logReject],
                        ephemeral: true
                    });
                } else {  
                    const logEmbed = new DiscordJS.MessageEmbed()
                        .setColor('#2f3136')
                        .setAuthor(`❌ ${memberTarger.user.tag} set nickname`, `${pfp}`)
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
    },
};