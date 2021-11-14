const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9'); 
const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands }) 
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
} 

(async () => {
	try {
		console.log('Started refreshing application (/) commands.'); 

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		); 
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();