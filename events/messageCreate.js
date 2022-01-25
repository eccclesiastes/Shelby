const DiscordJS = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const join = '898587285111603221';

module.exports = {
	name: 'messageCreate',
	async execute(message, client, rateLimitData) {
        if (message.mentions.users.has('898229527761788990')) {

    const embed = new DiscordJS.MessageEmbed()
        .setAuthor({ name: "Hey, I'm Shelby", iconURL: 'https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp' })
        .setColor('#2f3136')
        .setDescription(`I'm a moderation dedicated bot. My prefix will always be \`/\` \n \n For a full list of my commands, please use \`/help\``)
        .setFooter({ text: 'Made with <3 by dceu#0001' })

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

        const msg = await message.reply({ 
            embeds: [embed],
            components: [linkRow],
            allowedMentions: { users: [] },
            });

            setTimeout(() => { 
                msg.delete(); 
            }, 1000 * 15);
        };
	},
};