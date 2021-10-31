const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const { MessageActionRow } = require('discord.js');
const { MessageButton } = require('discord.js');

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('About this bot.'),
    async execute(interaction) {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor('About Shelby', ``) //link
                .setDescription('Shelby is an advanced **moderation dedicated**. Start your **better moderation experience** by interacting with the buttons below to **invite** me.')
                .addField('Creator', '**[dceu#0001](https://github.com/qtdceu)**')
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