const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const mysql = require('mysql2'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configuration command for setting logging channel and staff role. (Administrator Only)')
        .addRoleOption(option =>
            option.setName('moderator_role')
                    .setDescription('The role that can use the moderation commands.')
                    .setRequired(true))
        .addChannelOption(option =>
            option.setName('logging_channel')
                    .setDescription('The channel where events are logged.')
                    .setRequired(true)),
    async execute(interaction) {
        const guildID = interaction.guildId;
        const channelID = interaction.options.getChannel('logging_channel').id;
        const roleId = interaction.options.getRole('moderator_role').id;

        const respondEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Successfully set staff role and log channel')
                .setDescription('**Please use /config again should you change the logging channel and/or moderator role**.')
                .addField('Log channel:', `${interaction.options.getChannel('logging_channel')}`, true)
                .addField('Moderator role:', `${interaction.options.getRole('moderator_role')}`, true)

        await interaction.deferReply({ ephemeral: true });

        const connection = mysql.createConnection({
            host: "localhost",
            user: "Shelby",
            password: "Shelby1234",
            database : 'shelbydb'
          });        

        connection.connect(function(err) {
            if (err) { throw err; };
            console.log("Connected!");
          });

        connection.execute(`SELECT ? FROM configuration`, [guildID], function (err, result) {
            if (err) { throw err; };
            console.log(result);
    
            if(result == null) { 
                connection.execute(`INSERT INTO configuration (guild_id, staff_role_id, log_channel_id) VALUES (?, ?, ?)`, [guildID, roleId, channelID], function (err, result) {
                    if (err) { throw err; };
                    console.log("Inserted " +  result.affectedRows + " records");
                });
            } else {  
                connection.execute(`UPDATE configuration SET staff_role_id = ?, log_channel_id = ? WHERE guild_id = ?`, [ roleId, channelID, guildID ], function (err, result) {
                    if (err) { throw err; }
                    console.log("Inserted " +  result.affectedRows + " records");
                });
            };
        });

        interaction.editReply({
            embeds: [respondEmbed],
            ephemeral: true
        });
    },
};