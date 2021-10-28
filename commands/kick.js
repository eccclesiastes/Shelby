const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

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
    async execute(interaction, client) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`❌ **| Please make sure I have the \`Kick Members\` permission before executing this command! |** ❌`)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`KICK_MEMBERS`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
        const memberTarger = interaction.options.getMember('user');
        const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
        const owner = interaction.guild.fetchOwner();
        const pfp = memberTarger.displayAvatarURL();
        const getOwner = (await owner).id;

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member kicked')
                .setDescription(`⛔ **| ${memberTarger} has been kicked: ${reasonTarger} |** ⛔`);

        const actionTaken = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`⛔ **| You have been kicked from ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)

        const logEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(`⛔ **| ${memberTarger.user.tag} has been kicked |** ⛔`, `${pfp}`)
                .addField(`Moderator:`, `${interaction.member} \`(${interaction.user.tag})\``, true)
                .addField(`Reason:`, `${reasonTarger}`, true)

        await interaction.deferReply({ ephemeral: true });

        if (memberTarger.roles.highest.position >= interaction.guild.me.roles.highest.position || memberTarger.id === getOwner) {
            interaction.editReply({
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

        await interaction.editReply({
            embeds: [embed],
            ephemeral: true,
                });
            };   
        };
    },
};