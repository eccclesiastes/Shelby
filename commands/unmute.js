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
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';
        const muteRole = interaction.guild.roles.cache.find(role => role.name == 'Muted');

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member unmuted')
                .setDescription(`⛔ **| ${memberTarger} has been unmuted: ${reasonTarger} |** ⛔`)

        const alreadyUnmuted = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`❌ **| This member is already unmuted. |** ❌`)

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
    },
};