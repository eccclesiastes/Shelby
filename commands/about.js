const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const { MessageActionRow } = require('discord.js');
const { MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('About this bot.'),
    async execute(client, interaction) {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor({ name: 'About Shelby', iconURL: `https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp` }) 
                .setDescription('Shelby is an advanced **moderation dedicated** bot. Start your **better moderation experience** by interacting with the buttons below to **invite** me.')
                .addField('Creator', '**[dceu#0001](https://github.com/qtdceu)**')
                .setFooter({ text: 'Made with <3 by dceu#0001'})

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