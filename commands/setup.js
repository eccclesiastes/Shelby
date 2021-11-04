const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const { MessageActionRow } = require('discord.js');
const { MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Instructions on how to setup the bot.'),
    async execute(client, interaction) {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('How to setup Shelby')
                .addField('1. Creating roles and channels', 'Please create a moderator role that can use all the moderation commands, a \'Muted\' role which the bot applies to muted members, and a logging channel where all activity of this bot is logged.')
                .addField('2. Use /config', 'Please use /config to set the moderator role and log channel.')
                .addField('3. All set', 'You can now begin using Shelby! For a list of all commands, use /help.')
                .setFooter('Made with <3 by dceu#0001')

        const linkRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setURL('https://discord.com/api/oauth2/authorize?client_id=898229527761788990&permissions=277495671895&scope=applications.commands%20bot')
                        .setLabel('Invite me!')
                        .setStyle('LINK')
                )
                .addComponents(
                    new MessageButton()
                        .setURL('https://discord.com') //link
                        .setLabel('Vote for me!')
                        .setStyle('LINK')
                )
        
        interaction.reply({
            embeds: [embed],
            ephemeral: true,
            components: [linkRow],
        });
    },
};