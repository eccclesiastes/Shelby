const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const mysql = require('mysql2'); 
const config = require('../databaseConfig');
const connection = config.connection;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warns a user by DMing them.')
        .setDefaultPermission(false)
        .addUserOption(option => 
            option.setName('user')
                    .setDescription('The user to be warned.')
                    .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                    .setDescription('Reason for the warn.')
                    .setRequired(false)),
    async execute(client, interaction) {
        try {
            const memberTarger = interaction.options.getMember('user');
            const reasonTarger = interaction.options.getString('reason') || 'No reason provided.';
            const guildID = interaction.guildId;
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
                    .setAuthor(`❌ ${memberTarger.user.tag} was warned`, `${pfp}`)
                    .addField(`Invoker`, `${interaction.member} / \`${interaction.member.tag}\``, true)
                    .addField(`Target`, `${memberTarger} / \`${memberTarger.id}\``, true)
                    .addField(`Reason`, `${reasonTarger}`, true)
                    .setTimestamp()


                const channel = client.channels.cache.get(result[0].log_channel_id.toString());
                channel.send({embeds:[logEmbed]});
            };
        });
            
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