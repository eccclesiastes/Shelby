const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purges a given number of messages.')
        .addNumberOption(option =>
            option.setName('messages')
                    .setDescription('Amount of messages.')
                    .setRequired(true)),
    async execute(interaction) {
        try {
            const amountTarger = options.getNumber('messages'); 
    
            const embed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Succesfully purged')
                    .setDescription(`⛔ **| Succesfully purged ${amountTarger} messages. |** ⛔`)
    
            const overEmbed = new DiscordJS.MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle('Too many messages')
                    .setDescription(`⛔ **| Please select an amount of messages below 100. |** ⛔`)
            
            if (amountTarger > 100) {
                interaction.reply({
                    embeds: [overEmbed],
                    ephemeral: true,
                });
            } 
    
            interaction.channel.bulkDelete(amountTarger, true);
    
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } catch (err) {
            interaction.reply({
                content: `Unknown error, please re-try.`,
                ephemeral: true,
            });
        };
    },
};