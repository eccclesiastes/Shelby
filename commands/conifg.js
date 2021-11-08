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
        // const banCommand = await client.application?.commands.fetch('904840051039551519').applicationId;
        // const kickCommand = await client.application?.commands.fetch('904840051039551523').applicationId;
        // const muteCommand = await client.application?.commands.fetch('904840051039551524').applicationId;
        // const purgeCommand = await client.application?.commands.fetch('904840051039551526').applicationId;
        // const roleCommand = await client.application?.commands.fetch('904840051039551527').applicationId;
        // const unbanCommand = await client.application?.commands.fetch('904840051085705227').applicationId;
        // const unmuteCommand = await client.application?.commands.fetch('904840051085705228').applicationId;
        // const warnCommand = await client.application?.commands.fetch('904840051085705231').applicationId;

        const respondEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Successfully set staff role and log channel')
                .setDescription('**Please use /config again should you change the logging channel and/or moderator role**.')
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

        const fullPermissions = [
            {
                id: `904840051039551519`,
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: `904840051039551523`,
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: `904840051039551524`,
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: `904840051039551526`,
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: `904840051039551527`,
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: `904840051085705227`,
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: `904840051085705228`,
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
            {
                id: `904840051085705231`,
                permissions: [{
                    id: roleId,
                    type: 'ROLE',
                    permission: true,
                }],
            },
        ];

    try {
            client.guilds.cache.get(guildID).commands.permissions.set({ fullPermissions });
        } catch(e) {
          console.log(e);
    };

        interaction.editReply({
            embeds: [respondEmbed],
            ephemeral: true
        });
    },
};