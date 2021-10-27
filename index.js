const DiscordJS = require('discord.js');
const { Guild, Intents, MessageActionRow, MessageButton, MessageEmbed, Client, Collection } = require('discord.js');
const dotenv = require('dotenv');
const ms = require('ms');
const { link } = require('fs');
const fs = require('fs');
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

client.on('ready', () => {
    console.log('Bot is online.');
    
    const guildId = '898229423336218645';
    const guild = client.guilds.cache.get(guildId);
    let commands 
    
    if (guild) {
        commands = guild.commands;
    } else {
        commands = client.application?.commands;
    };
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
    
        const logEmbed = new DiscordJS.MessageEmbed()
                    .setDescription(`**Command:** \`${interaction.commandName}\` • **Ran by:** \`${interaction.user.tag}(${interaction.member.id})\` • **Guild:** \`${interaction.guild.name}(${interaction.guildId})\` • **Members:** \`${interaction.guild.memberCount
                    }\``)
                    .setTimestamp()

        client.channels.cache.get('902981513887490059').send({ embeds: [logEmbed] });
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

const join = '898587285111603221';

client.on('guildCreate', async (guild) => {
    const owner = await guild.fetchOwner().then(u => u.user.tag); 

    const embed = new DiscordJS.MessageEmbed()
        .setTitle('\:white_check_mark: Invited to server')
        .setColor('#2f3136')
        .addField(`Name`, `\n ${guild.name}\n`, true)
        .addField(`ID`, `\n ${guild.id}\n`, true)
        .addField(`Owner`, `\n ${guild.ownerId} | ${owner}\n`, true)
        .addField(`Members`, `\n ${guild.memberCount}\n`)

    client.channels.cache.get(join).send({embeds: [embed] });
    });


client.login(process.env.TOKEN);