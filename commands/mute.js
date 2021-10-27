const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const ms = require('ms');

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a user.')
        .addUserOption(option => 
            option.setName('user')
                    .setDescription('The user to mute.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('Reason for the mute.')
                    .setRequired(false))
        .addStringOption(option => 
            option.setName('time')
                    .setDescription('Time for the mute to last.')
                    .setRequired(false)),
    async execute(interaction) {
        const memberTarger = interaction.options.getMember('user');
        const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
        const timeTarger = interaction.options.getString('time'); 
        const muteRole = interaction.guild.roles.cache.find(role => role.name == 'Muted').catch(() => {
            interaction.reply({
                content: `No mute role found!`,
            });
        });

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member muted')
                .setDescription(`⛔ **| ${memberTarger} has been muted: ${reasonTarger} |** ⛔`)

        const actionTaken = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`⛔ **| You have been muted in ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)

        const alreadyMuted = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`❌ **| This member is already muted. |** ❌`)

        if (!memberTarger.roles.cache.has(muteRole.id)) {

        memberTarger.send({ embeds: [actionTaken] });

        if (!timeTarger) {
            memberTarger.roles.add(muteRole.id);
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
            return;
        } 
        memberTarger.roles.add(muteRole.id);

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });

        setTimeout(() => {
            memberTarger.roles.remove(muteRole.id);
        }, ms(timeTarger));
    } else {
            interaction.reply({
                embeds: [alreadyMuted],
                ephemeral: true,
            });
        };
    },
};