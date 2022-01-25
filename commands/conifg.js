const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const mysql = require('mysql2'); 
const config = require('../databaseConfig');
const connection = config.connection;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configuration command for setting logging channel and staff role. (Owner Only)')
        .setDefaultPermission(false)
        .addRoleOption(option =>
            option.setName('moderator_role')
                    .setDescription('The role that can use the moderation commands.')
                    .setRequired(true))
        .addChannelOption(option =>
            option.setName('logging_channel')
                    .setDescription('The channel where events are logged.')
                    .setRequired(true)),
    async execute(client, interaction) {
        const guildID = interaction.guildId;
        const channelID = interaction.options.getChannel('logging_channel').id;
        const roleId = interaction.options.getRole('moderator_role').id;
        const channel1 = interaction.options.getChannel('logging_channel');
        
        if (channel1.type === 'GUILD_TEXT') {

        const respondEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor({ name: 'Successfully set staff role and log channel', iconURL: `https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp`})
                .setDescription('<:shelbySuccess:911377269640028180> **| Please use /config again should you change the logging channel and/or moderator role |**')
                .addField('Log channel:', `${interaction.options.getChannel('logging_channel')}`, true)
                .addField('Moderator role:', `${interaction.options.getRole('moderator_role')}`, true)

        await interaction.deferReply({ ephemeral: true });

        connection.execute(`SELECT * FROM configuration WHERE guild_id=?`, [guildID], function (err, result) {
            if (err) { throw err; };
            console.log(result);
    
            if(result == null) { 
                connection.execute(`INSERT INTO configuration (guild_id, staff_role_id, log_channel_id) VALUES (?, ?, ?)`, [guildID, roleId, channelID], function (err, result) {
                    if (err) { throw err; };
                    console.log("Inserted " +  result.affectedRows + " records");
                });
            } else {  
                connection.execute(`DELETE FROM configuration WHERE guild_id = ?`, [guildID], function (err, result) {
                    if (err) { throw err; }
                    console.log("Deleted " +  result.affectedRows + " records");
                });

                connection.execute(`INSERT INTO configuration (guild_id, staff_role_id, log_channel_id) VALUES (?, ?, ?)`, [guildID, roleId, channelID], function (err, result) {
                    if (err) { throw err; };
                    console.log("Inserted " +  result.affectedRows + " records");
                });
            };
        });

        try {
            const commands = await client.application.commands.fetch();
            let commandsByName = new Map();
            const iterator = commands.values();
            for (const entry of iterator) {
                commandsByName.set(entry.name, entry.id);
            };

        const fullPermissions = [
            {
                id: commandsByName.get('ban'),
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: commandsByName.get('kick'),
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: commandsByName.get('mute'),
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: commandsByName.get('nickname'),
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: commandsByName.get('purge'),
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: commandsByName.get('role'),
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: commandsByName.get('slowmode'),
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: commandsByName.get('unban'),
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: commandsByName.get('unmute'),
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: commandsByName.get('warn'),
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
        ];

        client.guilds.cache.get(guildID).commands.permissions.set({ fullPermissions });
    } catch (e) {
        console.error(e);
    };

            interaction.editReply({
                embeds: [respondEmbed],
                ephemeral: true
            });
        } else {
            const respondEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<:shelbyFailure:911377751548755990> **| Please make sure the logging channel is a text channel before using this command again |** `)

            interaction.reply({
                embeds: [respondEmbed],
                ephemeral: true
            });
        };
    },
};