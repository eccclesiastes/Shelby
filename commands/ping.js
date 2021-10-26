const { SlashCommandBuilder } = require('@discordjs/builders');

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

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