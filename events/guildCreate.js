const DiscordJS = require('discord.js');
const join = '898587285111603221';

module.exports = {
	name: 'guildCreate',
	async execute(guild, client) {
        const ow = await guild.fetchOwner();
		const owner = ow.user.tag;
    const ownerPerm = ow.id;

    const ownerEmbed = new DiscordJS.MessageEmbed()
        .setTitle('Thank you for inviting Shelby')
        .setColor('#2f3136')
        .setDescription('Thank you for inviting Shelby! Please find all the information you need on setting Shelby up by using /setup. You can also get a full list of all the commands by using /help. Thank you for your support! <3')
        .setFooter('Made with <3 by dceu#0001')

    const embed = new DiscordJS.MessageEmbed()
        .setTitle('\:white_check_mark: Invited to server')
        .setColor('#2f3136')
        .addField(`Name`, `\n ${guild.name}\n`, true)
        .addField(`ID`, `\n ${guild.id}\n`, true)
        .addField(`Owner`, `\n ${owner} | \`${ownerPerm}\`\n`, true)
        .addField(`Members`, `\n ${guild.memberCount}\n`)

    client.channels.cache.get(join).send({embeds: [embed] });

    ow.send({ embeds: [ownerEmbed] });
	},
};