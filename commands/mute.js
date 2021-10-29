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
            try {

        await interaction.deferReply({ ephemeral: true });

        const memberTarger = interaction.options.getMember('user');
        const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
        const timeTarger = interaction.options.getString('time'); 
        const pfp = memberTarger.displayAvatarURL();
        const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        if (muteRole === undefined) {
            const embed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle(`Unable to find 'Muted' role`)
                    .setDescription(`❌ **| Please make sure there is a 'Muted' role before executing this command again! |** ❌`)

            interaction.editReply({
                embeds: [embed],
                ephemeral: true,
            });
        } else {

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

        const logEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(`⛔ ${memberTarger.user.tag} has been muted ⛔`, `${pfp}`)
                .addField(`Moderator:`, `${interaction.member} \`(${interaction.user.tag})\``, true)
                .addField(`Reason:`, `${reasonTarger}`, true)
                .addField(`Time:`, `${timeTarger}`, true)

        if (!memberTarger.roles.cache.has(muteRole.id)) {

        if (!timeTarger) {
            await memberTarger.roles.add(muteRole.id);
            memberTarger.send({ embeds: [actionTaken] });
            interaction.editReply({
                embeds: [embed],
                ephemeral: true,
            });
            return;
        } 
        await memberTarger.roles.add(muteRole.id);

        memberTarger.send({ embeds: [actionTaken] });

        interaction.editReply({
            embeds: [embed],
            ephemeral: true,
        });

        setTimeout(async () => {
            await memberTarger.roles.remove(muteRole.id);
        }, ms(timeTarger));
    } else {
            interaction.editReply({
                embeds: [alreadyMuted],
                ephemeral: true,
                        });
                    };
                };
            } catch (error) {
                const rolesErrorEmbed = new DiscordJS.MessageEmbed()
                    .setTitle(`Error`)
                    .setDescription(`❌ **| Please make sure my highest role is above the \`Muted\` role before executing this command! |** ❌`)
                    .setColor('#2f3136')
    
                interaction.editReply({
                    embeds: [rolesErrorEmbed],
                    ephemeral: true,
                });
            };
        };
    },
};