const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const mysql = require('mysql2'); 
const config = require('../databaseConfig');
const connection = config.connection;

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user.')
        .setDefaultPermission(false)
        .addStringOption(option => 
            option.setName('userid')
                    .setDescription('The user to unban.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('Reason for the unban.')
                    .setRequired(false)),
    async execute(client, interaction) {
        const perm_bot_error_embed = new DiscordJS.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`❌ **| Please make sure I have the \`Ban Members\` permission before executing this command! |** `)
                .setColor('#2f3136')

        if (!interaction.guild.me.permissions.has(`BAN_MEMBERS`)) {
            interaction.reply({
                embeds: [perm_bot_error_embed],
                ephemeral: true,
            });
        } else {
        try {          
            const memberTarger = interaction.options.getString('userid');
            const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
            const guildID = interaction.guildId;
            const guy = await client.users.fetch(memberTarger);
            const pfp = guy.displayAvatarURL();

            await interaction.deferReply({ ephemeral: true });
    
            const embed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor('Member unbanned', `https://cdn.discordapp.com/attachments/898229423336218648/908836989476950076/preview-01.jpg`)
                    .setDescription(`<:shelbySuccess:908788558305820713> **| ${guy.tag} has been unbanned: ${reasonTarger} |** `)

            await interaction.guild.members.unban(memberTarger);

            connection.execute(`SELECT log_channel_id FROM configuration WHERE guild_id=?`, [guildID], function (err, result) {
            if (err) { throw err; };
            console.log(result);
    
            if(result == null) { 
            const logReject = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Unable to log action')
                    .setDescription(`❌ **| Action cannot be logged as there has been no logging channel found. |** ❌`)

                interaction.followUp({
                    embeds: [logReject],
                    ephemeral: true
                });
            } else {  
                const logEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setAuthor(`❌ ${guy.tag} was unbanned`, pfp)
                    .addField(`Invoker`, `${interaction.member} / \`${interaction.user.tag}\``, true)
                    .addField(`Target`, `<@${memberTarger}> / \`${memberTarger}\``, true)
                    .addField(`Reason`, `${reasonTarger}`, true)
                    .setTimestamp()


                const channel = client.channels.cache.get(result[0].log_channel_id.toString());
                channel.send({embeds:[logEmbed]});
            };
        });

            interaction.editReply({
                embeds: [embed],
                ephemeral: true,
            });
    } catch (err) {
        const invalid = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Unable to unban')
                    .setDescription(`❌ **| Please provide a valid member to unban. |** `)

            interaction.reply({
                embeds: [invalid],
                ephemeral: true,
                });
            };
        };
    },
};