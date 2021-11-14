const DiscordJS = require('discord.js');
const { Guild, Intents, MessageActionRow, MessageButton, MessageEmbed, Client, Collection } = require('discord.js');
const dotenv = require('dotenv');
const ms = require('ms');
const { link } = require('fs');
const fs = require('fs');
// module.exports = require('./deploy-commands.js');
dotenv.config();

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

setInterval(() => {
    const guildNumbers = client.guilds.cache.size;
    client.user.setActivity(`${guildNumbers} Servers | /setup`, {type: "WATCHING" });
}, 1000 * 360);

module.exports = client;

client.login(process.env.TOKEN);