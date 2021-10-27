const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const { MessageActionRow } = require('discord.js');
const { MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(`Gives guidance on the bot's commands.`),
    async execute(interaction) {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(`Shelby's Commands`, ``) //link
                .setDescription(`To get a better understanding of the commands, please refer to the description provided under the command in auto-complete mode. Additionally, you can find additional information on the parameters of the command there.`)
                .addField('Moderation Commands', '`ban` • `kick` • `mute` • `purge` • `role` • `unban` • `unmute` • `warn`')
                .addField('Information Commands', '`about` • `help` • `invite` • `vote` • `help`')
                .addField('General Commands', '`userinfo` • `ping`')

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    },
};