const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');

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
            const memberTarger = interaction.options.getMember('user');
            const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
            const pfp = memberTarger.displayAvatarURL();
    
            const modEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('User warned')
                    .setDescription(`⛔ **| ${memberTarger} has been warned for: ${reasonTarger} |** ⛔`)
    
            const userEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`⛔ **| You have been warned in ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)
            
            const rejected = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Unable to take action')
                    .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

            const logEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor(`⛔ ${memberTarger.user.tag} warned ⛔`, `${pfp}`)
                    .addField(`Moderator:`, `${interaction.member} \`(${interaction.user.tag})\``, true)
                    .addField(`Reason:`, `${reasonTarger}`, true)
            
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
        } catch (error) {
            return interaction.followUp({
                content: `Unknown error, please re-try.`,
                ephemeral: true,
            });
        };
    },
};