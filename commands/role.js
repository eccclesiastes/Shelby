const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Adds or removes a role to a user.')
        .addUserOption(option =>
            option.setName('user')
                    .setDescription('Add or remove a user to a role.')
                    .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
                    .setDescription('The role which is being given/removed.')
                    .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                    .setDescription('The reason the role is being added/removed.')
                    .setRequired(false)),
    async execute(interaction) {
        try {
            const memberTarger = options.getMember('user');
            const roleTarger = options.getRole('role');
            const reasonTarger = options.getString('reason') || 'No reason provided.';
    
            const addedEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Role added')
                    .setDescription(`⛔ **| ${memberTarger} has been added to the role ${roleTarger}: ${reasonTarger} |** ⛔`)
    
            const removedEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Role removed')
                    .setDescription(`⛔ **| ${memberTarger} has been removed from the role ${roleTarger}: ${reasonTarger} |** ⛔`)
    
            if (!memberTarger.roles.cache.has(roleTarger.id)) {
                await memberTarger.roles.add(roleTarger.id);
    
                interaction.reply({
                    embeds: [addedEmbed],
                    ephemeral: true,
                });
            } else if (memberTarger.roles.cache.has(roleTarger.id)) {
                await memberTarger.roles.remove(roleTarger.id);
    
                interaction.reply({
                    embeds: [removedEmbed],
                    ephemeral: true,
                });
            };
        } catch (err) {
            const errorEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Unable to add/remove role')
                    .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the role being added/removed. |** ❌`)
    
            interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true,
            });
        };
    },
};