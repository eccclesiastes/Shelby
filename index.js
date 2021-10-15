import DiscordJS, { Intents, MessageEmbed } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

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

    commands?.create({
        name: 'ping',
        description: 'Replies with pong.',
    })

    commands?.create({
        name: 'add',
        description: 'Adds two numbers.',
        options: [
            {
                name: 'num1',
                description: 'The first number.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                name: 'num2',
                description: 'The second number.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER,
            },
        ],
    })

    commands?.create({
        name: 'ban',
        description: 'Bans a member.',
        options: [
            {
                name: 'user',
                description: 'The user to ban.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            },
        ],
    })
});

    
client.on('messageCreate', (message) => {
    if (message.content === 'ping') {
        message.reply({
            content: 'pong',
        });
    };
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    } 

    const { commandName, options } = interaction;

    if (commandName === 'ping') {
        interaction.reply({
            content: 'Pong!',
            ephemeral: true,
        });
    } else if (commandName === 'add') {
        const num1 = options.getNumber('num1');
        const num2 = options.getNumber('num2');

        await interaction.deferReply({
            ephemeral: true,
        });

        await interaction.editReply({
            content: `The sum is ${num1 + num2}`,
        });
    } else if (commandName === 'ban') {
        const memberTarger = options.getMember('user');

        const embed = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Member banned')
            .setDescription(`⛔ ${memberTarger} has been banned! ⛔`)

        await interaction.guild.members.ban(memberTarger.id);

        await interaction.reply({ 
            embeds: [embed], 
            ephemeral: true,
        });
    };
});



client.login(process.env.TOKEN);