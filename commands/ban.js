const { SlashCommandBuilder } = require('@discordjs/builders');

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user.')
        .addUserOption(option => 
            option.setName('user')
                    .setDescription('The user to ban.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('Reason for the ban.')
                    .setRequired(false)),
    async execute(interaction) {
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';
        const owner = interaction.guild.fetchOwner();
        const getOwner = (await owner).id;

           const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member banned')
                .setDescription(`⛔ **| ${memberTarger} has been banned: ${reasonTarger} |** ⛔`);

            const actionTaken = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`⛔ **| You have been banned from ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)

        if (memberTarger.roles.highest.position >= interaction.guild.me.roles.highest.position || memberTarger.id === getOwner) {
                interaction.reply({
                    embeds: [rejected],
                    ephemeral: true,
                }).catch(() => {
                    interaction.followUp({
                        content: `Unknown error.`,
                        ephemeral: true,
                    });
                });
            } else {
        await memberTarger.send({ embeds: [actionTaken] }).catch(() => {
            interaction.followUp({
                content: `Error to DM user, ban still executed.`,
                ephemeral: true,
            });
        });

        await interaction.guild.members.ban(memberTarger.id, {reason: reasonTarger}).catch(() => {
            return;
        });

        await interaction.reply({ 
            embeds: [embed], 
            ephemeral: true,
            });
        };
    },
};