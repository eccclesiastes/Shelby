const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const mysql = require('mysql2');
const config = require('../databaseConfig');
const connection = config.connection;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Sets the slowmode for a channel.')
        .setDefaultPermission(false)
        .addIntegerOption(option =>
            option.setName('seconds')
                    .setDescription('How many seconds slowmode to apply.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('Reason for setting slowmode.')
                    .setRequired(false)),
    async execute(client, interaction) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`<:shelbyFailure:908851692408283136> **| Please make sure I have the \`Manage Channels\` permission before executing this command! |** `)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`MANAGE_CHANNELS`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
            const timeTarger = interaction.options.getInteger('seconds');
            const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
            const guildID = interaction.guildId;
            const pfp = interaction.member.displayAvatarURL();

            const embed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor('Slowmode set', `https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp`)
                    .setDescription(`<:shelbySuccess:908788558305820713> **| Slowmode has been set to ${timeTarger} seconds for this channel |** `)

            await interaction.deferReply({ ephemeral: true });

            await interaction.channel.setRateLimitPerUser(timeTarger);

            connection.execute(`SELECT log_channel_id FROM configuration WHERE guild_id= ? `, [guildID], function (err, result) {
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
                        .setAuthor(` ${interaction.user.tag} set slowmode`, `${pfp}`)
                        .addField(`Invoker`, `${interaction.member} / \`${interaction.user.tag}\``, true)
                        .addField(`Seconds`, `${timeTarger} seconds`, true)
                        .addField(`Channel`, `${interaction.channel}`, true)
                        .addField(`Reason`, `${reasonTarger}`, true)
                        .setTimestamp()
    
                    const channel = client.channels.cache.get(result[0].log_channel_id.toString());
                    channel.send({embeds:[logEmbed]});
                };
            });

            console.log(interaction.commandId);
    
            interaction.editReply({
                embeds: [embed],
                ephemeral: true
            });
        };
    },
};