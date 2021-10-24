import DiscordJS, { Guild, Intents, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import WOKCommands from 'wokcommands';
import path from 'path';
import dotenv from 'dotenv';
import ms from 'ms';
import { link } from 'fs';
dotenv.config();

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

const rejected = new DiscordJS.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Unable to take action')
            .setDescription(`❌ **| Action cannot be taken as my highest role isn't higher than the target's highest role. |** ❌`)

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
        description: 'Shows the ping of the bot.',
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

    commands?.create({
        name: 'unmute',
        description: 'Unmute a user.',
        options: [
            {
                name: 'user',
                description: 'The user to unmute.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            },
            {
                name: 'reason',
                description: 'Reason for the unmute.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
        ],
    })

    commands?.create({
        name: 'unban',
        description: 'Unban a user.',
        options: [
            {
                name: 'userid',
                description: 'The ID of the user to unban.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'reason',
                description: 'Reason for the unban.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
        ],
    })

    commands?.create({
        name: 'userinfo',
        description: 'Shows information on a user.',
        options: [
            {
                name: 'user',
                description: 'The user to find information on.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            },
        ],
    })

    commands?.create({
        name: 'role',
        description: 'Adds or removes a role to a user.',
        options: [
            {
                name: 'user',
                description: 'Add or remove a user to a role.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            },
            {
                name: 'role',
                description: 'The role which is being given/removed.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.ROLE
            }, 
            {
                name: 'reason',
                description: 'The reason the role is being added/removed.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
        ],
    })

    commands?.create({
        name: 'warn',
        description: 'Warns a user by DMing them.',
        options: [
            {
                name: 'user',
                description: 'The user to be warned.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.USER
            },
            {
                name: 'reason',
                description: 'Reason for the warn.',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
            },
        ],
    })

    commands?.create({
        name: 'purge',
        description: 'Purges a given number of messages.',
        options: [
            {
                name: 'messages',
                description: 'Amount of messages.',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
        ],
    })
});

    
client.on('messageCreate', (message) => {
    if (message.content === 'command.com') {
        message.reply({
            content: 'Go to https://command.com',
        });
    };
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    } 

    const { commandName, options } = interaction;

    if (commandName === 'ping') {
        const msg = await interaction.reply({
            content: '🏓 Pong!',
            ephemeral: true,
            fetchReply: true, 
        });

        interaction.editReply({
            content: `🏓 Pong! \`${Date.now() - msg.createdTimestamp}ms\``,
            ephemeral: true,
        });
    } else if (commandName === 'ban') {
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';
        const owner = interaction.guild.fetchOwner();
        const getOwner = (await owner).id;

           const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member banned')
                .setDescription(`⛔ **| ${memberTarger} has been banned: ${reasonTarger} |** ⛔`);

            const actionTaken = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`⛔ **| You have been banned from ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)

        if (memberTarger.roles.highest.position >= interaction.guild.me.roles.highest.position || memberTarger.id === getOwner) {
                interaction.reply({
                    embeds: [rejected],
                    ephemeral: true,
                }).catch(() => {
                    interaction.followUp({
                        content: `Unknown error.`,
                        ephemeral: true,
                    });
                });
            } else {
        await memberTarger.send({ embeds: [actionTaken] }).catch(() => {
            interaction.followUp({
                content: `Error to DM user, ban still executed.`,
                ephemeral: true,
            });
        });

        await interaction.guild.members.ban(memberTarger.id, {reason: reasonTarger}).catch(() => {
            return;
        });

        await interaction.reply({ 
            embeds: [embed], 
            ephemeral: true,
            });
        }
    } else if (commandName === 'kick') {
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';
        const owner = interaction.guild.fetchOwner();
        const getOwner = (await owner).id;

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member kicked')
                .setDescription(`⛔ **| ${memberTarger} has been kicked: ${reasonTarger} |** ⛔`);

        const actionTaken = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`⛔ **| You have been kicked from ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)

        if (memberTarger.roles.highest.position >= interaction.guild.me.roles.highest.position || memberTarger.id === getOwner) {
            interaction.reply({
                embeds: [rejected],
                ephemeral: true,
            }).catch(() => {
                interaction.followUp({
                    content: `Unknow error.`,
                    ephemeral: true,
                });
            });
        } else {
        await memberTarger.send({ embeds: [actionTaken] }).catch(() => {
            interaction.followUp({
                content: `Error to DM user, kick still executed.`,
                ephemeral: true,
            });
        });

        await interaction.guild.members.kick(memberTarger.id, {reason: reasonTarger}).catch(() => {
            return;
        });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
            });
        };   
    } else if (commandName === 'mute') {
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';
        const timeTarger = options.getString('time'); 
        const muteRole = interaction.guild.roles.cache.find(role => role.name == 'Muted');

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member muted')
                .setDescription(`⛔ **| ${memberTarger} has been muted: ${reasonTarger} |** ⛔`)

        const actionTaken = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`⛔ **| You have been muted in ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)

        const alreadyMuted = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`❌ **| This member is already muted. |** ❌`)

        if (!memberTarger.roles.cache.has(muteRole.id)) {

        await memberTarger.send({ embeds: [actionTaken] });

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
    } else {
        interaction.reply({
            embeds: [alreadyMuted],
            ephemeral: true,
        });
    };
    } else if (commandName === 'about') {
        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('About ')
                .setDescription('-- is a **moderation dedicated** bot which uses purely **ephemeral slash commands** to provide a completely **"invisible"** experience to normal users, while still being of great use to moderators. Start your **better moderation experience** by interacting with the buttons below to **invite** me.')
                .setFooter('Made with <3 by dceu#0001')

        const linkRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=898229527761788990&permissions=8&scope=bot%20applications.commands')
                    .setLabel('Invite me!')
                    .setStyle('LINK')
            )

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
            components: [linkRow],
        });
    } else if (commandName === 'unmute') {
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';
        const muteRole = interaction.guild.roles.cache.find(role => role.name == 'Muted');

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member unmuted')
                .setDescription(`⛔ **| ${memberTarger} has been unmuted: ${reasonTarger} |** ⛔`)

        const alreadyUnmuted = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`❌ **| This member is already unmuted. |** ❌`)

        if (memberTarger.roles.cache.has(muteRole.id)) {

        memberTarger.roles.remove(muteRole.id);

            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } else {
            interaction.reply({
                embeds: [alreadyUnmuted],
                ephemeral: true,
            });
        };
    } else if (commandName === 'unban') {
        try {
        const memberTarger = options.getString('userid');
        const reasonTarger = options.getString('reason') || 'No reason provided.';
        let user = await client.users.fetch(memberTarger);

        const embed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Member unbanned')
                .setDescription(`⛔ **| ${user.tag} has been unbanned: ${reasonTarger} |** ⛔`)

        interaction.guild.members.unban(memberTarger).then(() => {
            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        });
    } catch (error) {
        const invalid = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Unable to unban')
                .setDescription(`❌ **| Please provide a valid member to unban. |** ❌`)

        interaction.reply({
            embeds: [invalid],
            ephemeral: true,
        });
    };
    } else if (commandName === 'userinfo') {
        try {
        const memberTarger = options.getMember('user') || interaction.member;
        const user = client.users.fetch(memberTarger);
        const pfp = memberTarger.displayAvatarURL();

        const embed = new DiscordJS.MessageEmbed()
                .setThumbnail(pfp)
                .setAuthor(`${(await user).tag} / ${(await user).id}`, `${pfp}`)
                .setColor('#2f3136')
                .addField(`Created at`, `\n <t:${Math.round((await user).createdAt / 1000)}:D>`, true)
                .addField(`Joined at`, `\n <t:${Math.round(memberTarger.joinedTimestamp / 1000)}:D>`, true)
                .addField('Roles', `\n ${memberTarger.roles.cache.map(r => r.toString()).join(" ")}`, true)

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
    } else if (commandName === 'role') {
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
    } else if (commandName === 'warn') {
        try {
        const memberTarger = options.getMember('user');
        const reasonTarger = options.getString('reason') || 'No reason provided.';

        const modEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setTitle('User warned')
                .setDescription(`⛔ **| ${memberTarger} has been warned for: ${reasonTarger} |** ⛔`)

        const userEmbed = new DiscordJS.MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`⛔ **| You have been warned in ${interaction.guild.name} for: ${reasonTarger} |** ⛔`)
        
        interaction.reply({
            embeds: [modEmbed],
            ephemeral: true,
        });

        memberTarger.send({ embeds: [userEmbed] }).catch(() => {
            interaction.followUp({
                content: `Unable to DM user.`,
                ephemeral: true
            });
        });
        
    } catch (err) {
        return interaction.followUp({
            content: `Unknown error, please re-try.`,
            ephemeral: true,
        });
    };
    } else if (commandName === 'purge') {
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