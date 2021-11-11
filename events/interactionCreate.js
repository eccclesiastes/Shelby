const DiscordJS = require('discord.js');
const client = require('../index');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
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

    
	} catch (error) {
		console.error(error);

        const errorEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`❌ **| Unknown Error |** `)

		await interaction.followUp({ 
            embeds: [errorEmbed], 
            ephemeral: true 
            });
	    };
	},
};