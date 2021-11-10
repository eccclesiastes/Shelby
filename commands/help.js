const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');
const { MessageActionRow } = require('discord.js');
const { MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription(`Gives guidance on the bot's commands.`),
    async execute(client, interaction) {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor(`Shelby's Commands`, ``) //link
                .setDescription(`To get a better understanding of the commands, please refer to the description provided under the command in auto-complete mode. Additionally, you can find additional information on the parameters of the command there. For a complete setup guide, please use /setup.`)
                .addField('Moderation Commands', '`ban` • `kick` • `mute` • `purge` • `role` • `unban` • `unmute` • `warn` • `slowmode` • `nickname`')
                .addField('Information Commands', '`about` • `help` • `invite` • `vote` • `setup`')
                .addField('Miscellaneous Commands', '`userinfo` • `ping` • `config`')
                .setFooter('Made with <3 by dceu#0001')
            
        const linkRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setURL('https://discord.com/api/oauth2/authorize?client_id=898229527761788990&permissions=277495671895&scope=applications.commands%20bot')
                        .setLabel('Invite me!')
                        .setStyle('LINK')
                )
                .addComponents(
                    new MessageButton()
                        .setURL('https://discord.com') //link
                        .setLabel('Vote for me!')
                        .setStyle('LINK')
                )

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
            components: [linkRow],
        });
    },
};