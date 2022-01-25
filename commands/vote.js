const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const { MessageActionRow } = require('discord.js');
const { MessageButton } = require('discord.js');

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`<:shelbyFailure:908851692408283136> **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Gives the voting link of the bot.'),
    async execute(client, interaction) {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor({ name: `Vote for Shelby!`, iconURL: `https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp` }) 
                .setFooter({ text: 'Made with <3 by dceu#0001' })

        const linkRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setURL('https://discord.com')
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