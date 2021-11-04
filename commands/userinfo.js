const { SlashCommandBuilder } = require('@discordjs/builders');
const DiscordJS = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Shows information on a user.')
        .addUserOption(option =>
            option.setName('user')
                    .setDescription('The user to find information on.')
                    .setRequired(false)),
    async execute(client, interaction) {
        try {
            const memberTarger = interaction.options.getMember('user') || interaction.member;
            const pfp = memberTarger.displayAvatarURL();
    
            const embed = new DiscordJS.MessageEmbed()
                    .setThumbnail(pfp)
                    .setAuthor(`${memberTarger.user.tag} / ${(await memberTarger).id}`, `${pfp}`)
                    .setColor('#2f3136')
                    .addField(`Created at`, `\n <t:${Math.round(memberTarger.user.createdTimestamp / 1000)}:D>`, true)
                    .addField(`Joined at`, `\n <t:${Math.round(memberTarger.joinedTimestamp / 1000)}:D>`, true)
                    .addField('Roles', `\n ${memberTarger.roles.cache.map(r => r.toString()).join(" ")}`, true)
                          
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } catch (err) {
            interaction.reply({
                content: `Unknown error, please re-try.`,
                ephemeral: true,
            });
        };
    },
};