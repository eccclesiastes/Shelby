const DiscordJS = require('discord.js');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log('Bot is online.');
        const guildNumbers = client.guilds.cache.size;
        client.user.setActivity(`${guildNumbers} Servers | /help`, {type: "WATCHING" });

		const embed = new DiscordJS.MessageEmbed()
				.setAuthor('Rebooted', 'https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp')
				.setDescription(`Rebooted at: <t:${Math.round(Date.now() / 1000)}:D>`)

		client.channels.cache.get('916717505580503151').send({ embeds: [embed] });
	},
};