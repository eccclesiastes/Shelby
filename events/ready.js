module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log('Bot is online.');
        const guildNumbers = client.guilds.cache.size;
        client.user.setActivity(`${guildNumbers} Servers | /help`, {type: "WATCHING" });
	},
};