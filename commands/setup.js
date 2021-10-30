const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Instructions on how to setup the bot. (Administrator Only)'),
    async execute(interaction) {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('How to setup Shelby')
                .addField('1. Creating roles and channels', 'Please create a moderator role that can use all the moderation commands, a \'Muted\' role which the bot applies to muted members, and a logging channel where all activity of this bot is logged.')
                .addField('2. Use /config', 'Please use /config to set the moderator role and log channel.')
                .addField('3. All set', 'You can now begin using Shelby!')
        
        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    },
};