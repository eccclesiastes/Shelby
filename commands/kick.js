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
        .setName('kick')
        .setDescription('Kicks a user.')
        .setDefaultPermission(false)
        .addUserOption(option => 
            option.setName('user')
                    .setDescription('The user to kick.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('Reason for the kick.')
                    .setRequired(false)),
    async execute(client, interaction) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`<:shelbyFailure:908851692408283136> **| Please make sure I have the \`Kick Members\` permission before executing this command! |** `)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`KICK_MEMBERS`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
        const memberTarger = interaction.options.getMember('user');
        const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
        const guildID = interaction.guildId;
        const owner = interaction.guild.fetchOwner();
        const pfp = memberTarger.displayAvatarURL();
        const getOwner = (await owner).id;
        console.log(interaction.commandId);

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor({ name: 'Member kicked', iconURL: `https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp` })
                .setDescription(`<:shelbySuccess:908788558305820713> **| ${memberTarger} has been kicked: ${reasonTarger} |** `);

        const actionTaken = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<:shelbySuccess:908788558305820713> **| You have been kicked from ${interaction.guild.name} for: ${reasonTarger} |** `)

        await interaction.deferReply({ ephemeral: true });

        if (memberTarger.roles.highest.position >= interaction.guild.me.roles.highest.position || memberTarger.id === getOwner) {
            interaction.editReply({
                embeds: [rejected],
                ephemeral: true,
            }).catch(() => {
                interaction.followUp({
                    content: `Unknow error.`,
                    ephemeral: true,
                });
            });
        } else {
        await memberTarger.send({ embeds: [actionTaken] }).catch(() => {
            interaction.followUp({
                content: `Error to DM user, kick still executed.`,
                ephemeral: true,
            });
        });

        await interaction.guild.members.kick(memberTarger.id, {reason: reasonTarger}).catch(() => {
            return;
        });

        connection.execute(`SELECT log_channel_id FROM configuration WHERE guild_id=?`, [guildID], function (err, result) {
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
                    .setAuthor({ name: `${memberTarger.user.tag} was kicked`, iconURL: `${pfp}` })
                    .addField(`Invoker`, `${interaction.member} / \`${interaction.user.tag}\``, true)
                    .addField(`Target`, `${memberTarger} / \`${memberTarger.id}\``, true)
                    .addField(`Reason`, `${reasonTarger}`, true)
                    .setTimestamp()


                const channel = client.channels.cache.get(result[0].log_channel_id.toString());
                channel.send({embeds:[logEmbed]});
            };
        });

        await interaction.editReply({
            embeds: [embed],
            ephemeral: true,
                });
            };   
        };
    },
};