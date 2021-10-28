const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');

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
        const memberTarger = interaction.options.getMember('user');
        const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
        const owner = interaction.guild.fetchOwner();
        const pfp = memberTarger.displayAvatarURL();
        const getOwner = (await owner).id;

           const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member banned')
                .setDescription(`⛔ **| ${memberTarger} has been banned: ${reasonTarger} |** ⛔`);

            const actionTaken = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`⛔ **| You have been banned from ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)
            
            const logEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(`⛔ ${memberTarger.user.tag} has been banned ⛔`, `${pfp}`)
                .addField(`Moderator:`, `${interaction.member} \`(${interaction.user.tag})\``, true)
                .addField(`Reason:`, `${reasonTarger}`, true)

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
        };
    },
};