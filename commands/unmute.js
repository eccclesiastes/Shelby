const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a user.')
        .addUserOption(option => 
            option.setName('user')
                    .setDescription('The user to unmute.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('Reason for the unmute.')
                    .setRequired(false)),
    async execute(interaction) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`❌ **| Please make sure I have the \`Manage Roles\` permission before executing this command! |** ❌`)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`MANAGE_ROLES`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
        const memberTarger = interaction.options.getMember('user');
        const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
        const muteRole = interaction.guild.roles.cache.find(role => role.name == 'Muted');
        const pfp = memberTarger.displayAvatarURL();

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member unmuted')
                .setDescription(`⛔ **| ${memberTarger} has been unmuted: ${reasonTarger} |** ⛔`)

        const alreadyUnmuted = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`❌ **| This member is already unmuted. |** ❌`)

        const logEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(`⛔ ${memberTarger.user.tag} unmuted ⛔`, `${pfp}`)
                .addField(`Moderator:`, `${interaction.member} \`(${interaction.user.tag})\``, true)
                .addField(`Reason:`, `${reasonTarger}`, true)

        if (memberTarger.roles.cache.has(muteRole.id)) {

        memberTarger.roles.remove(muteRole.id);

            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } else {
            interaction.reply({
                embeds: [alreadyUnmuted],
                ephemeral: true,
                });
            };
        };
    },
};