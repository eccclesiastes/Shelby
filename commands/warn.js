const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user by DMing them.')
        .addUserOption(option => 
            option.setName('user')
                    .setDescription('The user to be warned.')
                    .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                    .setDescription('Reason for the warn.')
                    .setRequired(false)),
    async execute(interaction) {
        try {
            const memberTarger = options.getMember('user');
            const reasonTarger = options.getString('reason') || 'No reason provided.';
    
            const modEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('User warned')
                    .setDescription(`⛔ **| ${memberTarger} has been warned for: ${reasonTarger} |** ⛔`)
    
            const userEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`⛔ **| You have been warned in ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)
            
            interaction.reply({
                embeds: [modEmbed],
                ephemeral: true,
            });
    
            memberTarger.send({ embeds: [userEmbed] }).catch(() => {
                interaction.followUp({
                    content: `Unable to DM user.`,
                    ephemeral: true
                });
            });

        } catch (err) {
            return interaction.followUp({
                content: `Unknown error, please re-try.`,
                ephemeral: true,
            });
        };
    },
};