const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const mysql = require('mysql2'); 
const config = require('../databaseConfig');
const connection = config.connection;

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`<:shelbyFailure:908851692408283136> **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** `)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purges a given number of messages.')
        .setDefaultPermission(false)
        .addNumberOption(option =>
            option.setName('messages')
                    .setDescription('Amount of messages.')
                    .setRequired(true)),
    async execute(client, interaction) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`<:shelbyFailure:908851692408283136> **| Please make sure I have the \`Manage Messages\` permission before executing this command! |** `)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`MANAGE_MESSAGES`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
        try {
            const amountTarger = interaction.options.getNumber('messages'); 
            const guildID = interaction.guildId;
            const pfp = interaction.member.displayAvatarURL();
            console.log(interaction.commandId);
    
            const embed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor('Successfully purged', `https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp`)
                    .setDescription(`<:shelbySuccess:908788558305820713> **| Succesfully purged ${amountTarger} messages. |** `)
    
            const overEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Too many messages')
                    .setDescription(`<:shelbyFailure:908851692408283136> **| Please select an amount of messages below 100. |** `)                   

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

            connection.execute(`SELECT log_channel_id FROM configuration WHERE guild_id=?`, [guildID], function (err, result) {
            if (err) { throw err; };
            console.log(result);
    
            if(result == null) { 
            const logReject = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Unable to log action')
                    .setDescription(`<:shelbyFailure:908851692408283136> **| Action cannot be logged as there has been no logging channel found. |** ❌`)

                interaction.followUp({
                    embeds: [logReject],
                    ephemeral: true
                });
            } else {  
                const logEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#b8e4fd')
                    .setAuthor(`${interaction.user.tag} purged messages`, `${pfp}`)
                    .addField(`Invoker`, `${interaction.member} / \`${interaction.user.tag}\``, true)
                    .addField(`Messages`, `Amount: ${amountTarger}`, true)
                    .setTimestamp()


                const channel = client.channels.cache.get(result[0].log_channel_id.toString());
                channel.send({embeds:[logEmbed]});
            };
        });
    
            interaction.editReply({
                embeds: [embed],
                ephemeral: true,
            });
        };
        } catch (err) {
            interaction.reply({
                content: `Unknown error, please re-try.`,
                ephemeral: true,
                });
            };
        };
    },
};