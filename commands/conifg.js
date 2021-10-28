const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const mysql = require('mysql');

// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "Shelby",
//     password: "Joseph2014",
//   });

// connection.connect(function(err) {
//     if (err) {
//       console.error('error connecting: ' + err.stack);
//       return;
//     }
//     console.log('connected as id ' + connection.threadId);
// });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configuration command for logging and the staff role. Please use /help for more information.')
        .addRoleOption(option =>
            option.setName('moderator_role')
                    .setDescription('The role that can use the moderation commands.')
                    .setRequired(true)),
    async execute(interaction) {
        const guilID = interaction.guildId;
        const channelID = interaction.channelId;
        const roleId = interaction.options.getRole('moderator_role').id;

        const respondEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Successfully set staff role and log channel')
                .addField('Log channel:', `${interaction.channel}`, true)
                .addField('Moderator role:', `${interaction.options.getRole('moderator_role')}`, true)

        await interaction.deferReply({ ephemeral: true });


    },
};