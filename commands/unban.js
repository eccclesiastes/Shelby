const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user.')
        .addStringOption(option => 
            option.setName('userid')
                    .setDescription('The user to unban.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('Reason for the unban.')
                    .setRequired(false)),
    async execute(interaction, client) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`❌ **| Please make sure I have the \`Ban Members\` permission before executing this command! |** ❌`)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`BAN_MEMBERS`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
        try {
            const memberTarger = interaction.options.getString('userid');
            const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
            const pfp = memberTarger.displayAvatarURL();
    
            const embed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Member unbanned')
                    .setDescription(`⛔ **| ${memberTarger} has been unbanned: ${reasonTarger} |** ⛔`)

            const logEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor(`⛔ ${memberTarger.user.tag} unbanned ⛔`, `${pfp}`)
                    .addField(`Moderator:`, `${interaction.member} \`(${interaction.user.tag})\``, true)
                    .addField(`Reason:`, `${reasonTarger}`, true)

            await interaction.deferReply({ ephemeral: true });

            await interaction.guild.members.unban(memberTarger).then(() => {
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true,
                });
            })
    } catch (err) {
        const invalid = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Unable to unban')
                    .setDescription(`❌ **| Please provide a valid member to unban. |** ❌`)
    
            interaction.editReply({
                embeds: [invalid],
                ephemeral: true,
                });
            };
        };
    },
};