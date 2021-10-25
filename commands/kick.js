const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user.')
        .addUserOption(option => 
            option.setName('user')
                    .setDescription('The user to kick.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('Reason for the kick.')
                    .setRequired(false)),
    async execute(interaction) {
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';
        const owner = interaction.guild.fetchOwner();
        const getOwner = (await owner).id;

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member kicked')
                .setDescription(`⛔ **| ${memberTarger} has been kicked: ${reasonTarger} |** ⛔`);

        const actionTaken = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`⛔ **| You have been kicked from ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)

        if (memberTarger.roles.highest.position >= interaction.guild.me.roles.highest.position || memberTarger.id === getOwner) {
            interaction.reply({
                embeds: [rejected],
                ephemeral: true,
            }).catch(() => {
                interaction.followUp({
                    content: `Unknow error.`,
                    ephemeral: true,
                });
            });
        } else {
        await memberTarger.send({ embeds: [actionTaken] }).catch(() => {
            interaction.followUp({
                content: `Error to DM user, kick still executed.`,
                ephemeral: true,
            });
        });

        await interaction.guild.members.kick(memberTarger.id, {reason: reasonTarger}).catch(() => {
            return;
        });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
            });
        };   
    },
};