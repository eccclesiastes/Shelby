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
                    .setDescription('The ID of the user to unban.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('Reason for the unban.')
                    .setRequired(false)),
    async execute(interaction) {
        try {
            const memberTarger = options.getString('userid');
            const reasonTarger = options.getString('reason') || 'No reason provided.';
            let user = await client.users.fetch(memberTarger);
    
            const embed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Member unbanned')
                    .setDescription(`⛔ **| ${user.tag} has been unbanned: ${reasonTarger} |** ⛔`)
    
            interaction.guild.members.unban(memberTarger).then(() => {
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            });
        } catch (error) {
            const invalid = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Unable to unban')
                    .setDescription(`❌ **| Please provide a valid member to unban. |** ❌`)
    
            interaction.reply({
                embeds: [invalid],
                ephemeral: true,
            });
        };
    },
};