import DiscordJS, { Guild, Intents, MessageEmbed } from 'discord.js';
import dotenv from 'dotenv';
import ms from 'ms';
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
        name: 'ban',
        description: 'Bans a member.',
        options: [
            {
                name: 'user',
                description: 'The user to ban.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            },
            {
                name: 'reason',
                description: 'Reason for the ban.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
        ],
    })

    commands?.create({
        name: 'kick',
        description: 'Kicks a user.',
        options: [
            {
                name: 'user',
                description: 'The user to kick.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            },
            {
                name: 'reason',
                description: 'Reason for the kick.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
        ],
    })

    commands?.create({
        name: 'mute',
        description: 'Mutes a user.',
        options: [
            {
                name: 'user',
                description: 'The user to mute.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            },
            {
                name: 'reason',
                description: 'Reason for the mute.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'time',
                description: 'Time for the mute to last.',
                require: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
        ],
    })

    commands?.create({
        name: 'about',
        description: 'About this bot.',
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
    } else if (commandName === 'ban') {
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';

           const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member banned')
                .setDescription(`⛔ **| ${memberTarger} has been banned: ${reasonTarger} |** ⛔`);

        await interaction.guild.members.ban(memberTarger.id, {reason: reasonTarger});

        await interaction.reply({ 
            embeds: [embed], 
            ephemeral: true,
        });
    } else if (commandName === 'kick') {
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member kicked')
                .setDescription(`⛔ **| ${memberTarger} has been kicked: ${reasonTarger} |** ⛔`);

        await interaction.guild.members.kick(memberTarger.id, reasonTarger);

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
    } else if (commandName === 'mute') {
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';
        const timeTarger = options.getString('time'); 
        const muteRole = interaction.guild.roles.cache.find(role => role.name == 'Muted');

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member muted')
                .setDescription(`⛔ **| ${memberTarger} has been muted: ${reasonTarger} |** ⛔`)

        if (!timeTarger) {
            memberTarger.roles.add(muteRole.id);
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
            return;
        } 
        memberTarger.roles.add(muteRole.id);

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });

        setTimeout(() => {
            memberTarger.roles.remove(muteRole.id);
        }, ms(timeTarger));
    } else if (commandName === 'about') {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('About ')
                .setDescription('-- is a **moderation dedicated** bot which uses purely **ephemeral slash commands** to provide a completely **"invisible"** experience to normal users, while still being of great use to moderators. Start your **better moderation experience** by interacting with the buttons below to **invite** me.')
                .setFooter('Made with <3 by dceu#0001')

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
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