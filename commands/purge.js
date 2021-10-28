const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purges a given number of messages.')
        .addNumberOption(option =>
            option.setName('messages')
                    .setDescription('Amount of messages.')
                    .setRequired(true)),
    async execute(interaction) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`❌ **| Please make sure I have the \`Manage Messages\` permission before executing this command! |** ❌`)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`MANAGE_MESSAGES`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
        try {
            const amountTarger = interaction.options.getNumber('messages'); 
    
            const embed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Succesfully purged')
                    .setDescription(`⛔ **| Succesfully purged ${amountTarger} messages. |** ⛔`)
    
            const overEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Too many messages')
                    .setDescription(`⛔ **| Please select an amount of messages below 100. |** ⛔`)
            
            const logEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor(`⛔ Messages purged ⛔`)
                    .addField(`Moderator:`, `${interaction.member} \`(${interaction.user.tag})\``, true)
                    .addField(`Messages:`, `${amountTarger}`, true)
                    

            if (amountTarger > 100) {
                interaction.reply({
                    embeds: [overEmbed],
                    ephemeral: true,
                });
            } else {

            await interaction.deferReply({
                ephemeral: true,
            });
    
            await interaction.channel.bulkDelete(amountTarger, true);
    
            interaction.editReply({
                embeds: [embed],
                ephemeral: true,
            });
        }
        } catch (err) {
            interaction.reply({
                content: `Unknown error, please re-try.`,
                ephemeral: true,
                });
            };
        };
    },
};