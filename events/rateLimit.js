// const DiscordJS = require('discord.js');
// const { MessageActionRow, MessageButton } = require('discord.js');
// const rlChannel = '916713690600980500';

// module.exports = {
//     name: 'rateLimit',
//     async execute(message, client, rateLimitData) {
//         const embed = new DiscordJS.MessageEmbed()
//             .setAuthor('Ratelimit', 'https://cdn.discordapp.com/avatars/898229527761788990/9045f776607eee7e0bfea538434ea8af.webp')
//             .setColor
//             .addField('Timeout', `${rateLimitData.timeout}`, true)
//             .addField('Limit', `${rateLimitData.limit}`, true)
//             .addField('Method', `${rateLimitData.method}`, true)
//             .addField('Global', `${rateLimitData.global}`, true)
//             .addField('Path', `${rateLimitData.path}`, true)
//             .addField('Route', `${rateLimitData.route}`, true)
        
//         rlChannel.send({ embeds: [embed] });
//     },
// };