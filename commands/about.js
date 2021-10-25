const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('About this bot.'),
    async execute(interaction) {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor('About Shelby', ``) //link
                .setDescription('Shelby is a **moderation dedicated** bot which uses purely **ephemeral slash commands** to provide a completely **"invisible"** experience to normal users, while still being of great use to moderators. Start your **better moderation experience** by interacting with the buttons below to **invite** me.')
                .setFooter('Made with <3 by dceu#0001')

        const linkRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=898229527761788990&permissions=277495671895&scope=applications.commands%20bot')
                    .setLabel('Invite me!')
                    .setStyle('LINK')
            )

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
            components: [linkRow],
        });
    },
};