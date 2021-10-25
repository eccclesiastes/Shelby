const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows the ping of the bot.'),
    async execute(interaction) {
        const msg = await interaction.reply({
            content: '🏓 Pong!',
            ephemeral: true,
            fetchReply: true, 
        });

        interaction.editReply({
            content: `🏓 Pong! \`${Date.now() - msg.createdTimestamp}ms\``,
            ephemeral: true,
        });
    },
};