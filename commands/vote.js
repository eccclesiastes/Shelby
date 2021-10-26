const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Gives the voting link of the bot.'),
    async execute(interaction) {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(`Vote for Shelby!`, ``) //link
                .setFooter('Made with <3 by dceu#0001')

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