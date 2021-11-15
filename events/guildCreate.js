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
        .setColor('#b8e4fd')
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

    try {
        const commands = await client.application.commands.fetch();
        let commandsByName = new Map();
        const iterator = commands.values();
        for (const entry of iterator) {
            commandsByName.set(entry.name, entry.id);
        };
    
        const fullPermissions = [
            {
                id: commandsByName.get('config'),
                permissions: [{
                    id: ownerPerm,
                    type: 'USER',
                    permission: true,
                }],
            },
        ];

    client.guilds.cache.get(guild.id).commands.permissions.set({ fullPermissions });

    } catch (e) {
        console.error(e);
    } 

    ow.send({ embeds: [ownerEmbed] });
	},
};