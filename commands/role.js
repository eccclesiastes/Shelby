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
        .setName('role')
        .setDescription('Adds or removes a role to a user.')
        .setDefaultPermission(false)
        .addUserOption(option =>
            option.setName('user')
                    .setDescription('Add or remove a user to a role.')
                    .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
                    .setDescription('The role which is being given/removed.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('The reason the role is being added/removed.')
                    .setRequired(false)),
    async execute(client, interaction) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`<:shelbyFailure:908851692408283136> **| Please make sure I have the \`Manage Roles\` permission before executing this command! |** `)
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
            const roleTarger = interaction.options.getRole('role');
            const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
            const guildID = interaction.guildId;
            const pfp = memberTarger.displayAvatarURL();
            console.log(interaction.commandId);
    
            const addedEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor('Role added', `https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp`)
                    .setDescription(`<:shelbySuccess:908788558305820713> **| ${memberTarger} has been added to the role ${roleTarger}: ${reasonTarger} |** `)
    
            const removedEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor('Role removed', `https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp`)
                    .setDescription(`<:shelbySuccess:908788558305820713> **| ${memberTarger} has been removed from the role ${roleTarger}: ${reasonTarger} |** `)
    
            if (!memberTarger.roles.cache.has(roleTarger.id)) {
                await memberTarger.roles.add(roleTarger.id);

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
                    .setAuthor(`${memberTarger.user.tag} granted role`, `${pfp}`)
                    .addField(`Invoker`, `${interaction.member} / \`${interaction.user.tag}\``, true)
                    .addField(`Target`, `${memberTarger} / \`${memberTarger.id}\``, true)
                    .addField(`Role`, `${roleTarger}`, true)
                    .addField(`Reason`, `${reasonTarger}`, true)
                    .setTimestamp()


                const channel = client.channels.cache.get(result[0].log_channel_id.toString());
                channel.send({embeds:[logEmbed]});
            };
        });
    
                interaction.editReply({
                    embeds: [addedEmbed],
                    ephemeral: true,
                });
            } else if (memberTarger.roles.cache.has(roleTarger.id)) {
                await memberTarger.roles.remove(roleTarger.id);

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
                    .setAuthor(`${memberTarger.user.tag} role removed`, `${pfp}`)
                    .addField(`Invoker`, `${interaction.member} / \`${interaction.user.tag}\``, true)
                    .addField(`Target`, `${memberTarger} / \`${memberTarger.id}\``, true)
                    .addField(`Role`, `${roleTarger}`, true)
                    .addField(`Reason`, `${reasonTarger}`, true)
                    .setTimestamp()


                const channel = client.channels.cache.get(result[0].log_channel_id.toString());
                channel.send({embeds:[logEmbed]});
            };
        });
    
                interaction.editReply({
                    embeds: [removedEmbed],
                    ephemeral: true,
                });
            };
        } catch (err) {
            const errorEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Unable to add/remove role')
                    .setDescription(`<:shelbyFailure:908851692408283136> **| Action cannot be taken as my highest role isn't higher than the role being added/removed. |** `)
    
            interaction.editReply({
                embeds: [errorEmbed],
                ephemeral: true,
                });
            };
        };
    },
};