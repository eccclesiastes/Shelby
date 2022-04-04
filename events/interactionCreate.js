const DiscordJS = require('discord.js');
const client = require('../index');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client, rateLimitData) {
		if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
    
        const logEmbed = new DiscordJS.MessageEmbed()
                    .setDescription(`**Command:** \`${interaction.commandName}\` • **Ran by:** \`${interaction.user.tag}(${interaction.member.id})\` • **Guild:** \`${interaction.guild.name}(${interaction.guildId})\` • **Members:** \`${interaction.guild.memberCount
                    }\``)
                    .setTimestamp()

        client.channels.cache.get('902981513887490059').send({ embeds: [logEmbed] });

        const ow = await interaction.guild.fetchOwner();
        const ownerPerm = ow.id

        try {
            const commands = await client.application.commands.fetch();
            let commandsByName = new Map();
            const iterator = commands.values();
            for (const entry of iterator) {
                commandsByName.set(entry.name, entry.id);
        }

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

    client.guilds.cache.get(interaction.guild.id).commands.permissions.set({ fullPermissions });
        } catch (e) {
            console.error(e);
    };

    
	} catch (error) {
		console.error(error);

        const errorEmbed = new DiscordJS.MessageEmbed()
                .setColor('#b8e4fd')
                .setDescription(`<:shelbyFailure:911377751548755990> **| Unknown Error |** `)

		await interaction.followUp({ 
            embeds: [errorEmbed], 
            ephemeral: true 
            });
	    };
	},
};