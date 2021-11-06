const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const mysql = require('mysql2'); 
const config = require('../databaseConfig');
const connection = config.connection;

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a user.')
        .setDefaultPermission(false)
        .addUserOption(option => 
            option.setName('user')
                    .setDescription('The user to unmute.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('Reason for the unmute.')
                    .setRequired(false)),
    async execute(client, interaction) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`❌ **| Please make sure I have the \`Manage Roles\` permission before executing this command! |** ❌`)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`MANAGE_ROLES`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
            try {

        await interaction.deferReply({ ephemeral: true });

        const memberTarger = interaction.options.getMember('user');
        const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
        const muteRole = interaction.guild.roles.cache.find(role => role.name == 'Muted');
        const guildID = interaction.guildId;
        const pfp = memberTarger.displayAvatarURL();

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member unmuted')
                .setDescription(`⛔ **| ${memberTarger} has been unmuted: ${reasonTarger} |** ⛔`)

        const alreadyUnmuted = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`❌ **| This member is already unmuted. |** ❌`)

        const logEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(`⛔ ${memberTarger.user.tag} unmuted ⛔`, `${pfp}`)
                .addField(`Moderator:`, `${interaction.member} \`(${interaction.user.tag})\``, true)
                .addField(`Reason:`, `${reasonTarger}`, true)

        if (memberTarger.roles.cache.has(muteRole.id)) {

        connection.execute(`SELECT log_channel_id FROM configuration WHERE guild_id=?`, [guildID], function (err, result) {
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
                    .setAuthor(`❌ ${memberTarger.user.tag} was unmuted`, `${pfp}`)
                    .addField(`Invoker`, `${interaction.member} / \`${interaction.member.tag}\``, true)
                    .addField(`Target`, `${memberTarger} / \`${memberTarger.id}\``, true)
                    .addField(`Reason`, `${reasonTarger}`, true)
                    .setTimestamp()


                const channel = client.channels.cache.get(result[0].log_channel_id.toString());
                channel.send({embeds:[logEmbed]});
            };
        });

        await memberTarger.roles.remove(muteRole.id);

            interaction.editReply({
                embeds: [embed],
                ephemeral: true,
            });
        } else {
            interaction.editReply({
                embeds: [alreadyUnmuted],
                ephemeral: true,
                    });
                };
            } catch (err) {
                const rolesErrorEmbed = new DiscordJS.MessageEmbed()
                    .setTitle(`Error`)
                    .setDescription(`❌ **| Please make sure my highest role is above the \`Muted\` role before executing this command! |** ❌`)
                    .setColor('#2f3136')
    
                interaction.editReply({
                    embeds: [rolesErrorEmbed],
                    ephemeral: true,
                });
            };
        };
    },
};