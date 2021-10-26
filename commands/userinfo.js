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
    async execute(interaction) {
        try {
            const memberTarger = options.getMember('user') || interaction.member;
            const user = client.users.fetch(memberTarger);
            const pfp = memberTarger.displayAvatarURL();
    
            const embed = new DiscordJS.MessageEmbed()
                    .setThumbnail(pfp)
                    .setAuthor(`${(await user).tag} / ${(await user).id}`, `${pfp}`)
                    .setColor('#2f3136')
                    .addField(`Created at`, `\n <t:${Math.round((await user).createdAt / 1000)}:D>`, true)
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