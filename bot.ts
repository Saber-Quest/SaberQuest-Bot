import { Client, Collection, REST, Routes, Partials, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ],
    partials: [Partials.Channel]
});

declare module 'discord.js' {
    interface Client {
        slashCommands: Collection<string, any>;
        selectMenus: Collection<string, any>;
        autoComplete: Collection<string, any>;
        buttons: Collection<string, any>;
    }
}

const eventFiles = fs.readdirSync('./events').filter(file => /(\.ts|\.js)$/i.test(file));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args: any[]) => event.execute(...args));
    } else {
        client.on(event.name, (...args: any[]) => event.execute(...args));
    }
}

client.slashCommands = new Collection<string, any>();
client.selectMenus = new Collection<string, any>();
client.autoComplete = new Collection<string, any>();
client.buttons = new Collection<string, any>();

const slashCommandsFolder = fs.readdirSync('./commands/slash');

for (const folder of slashCommandsFolder) {
    const commandFiles = fs.readdirSync(`./commands/slash/${folder}`).filter(file => /(\.ts|\.js)$/i.test(file));
    for (const file of commandFiles) {
        const command = require(`./commands/slash/${folder}/${file}`);
        client.slashCommands.set(command.data.name, command);
    }
}

const selectMenusFolder = fs.readdirSync('./commands/select');

for (const folder of selectMenusFolder) {
    const commandFiles = fs.readdirSync(`./commands/select/${folder}`).filter(file => /(\.ts|\.js)$/i.test(file));
    for (const file of commandFiles) {
        const command = require(`./commands/select/${folder}/${file}`);
        client.selectMenus.set(command.name, command);
    }
}

const autoCompleteFolder = fs.readdirSync('./commands/autoComplete');

for (const folder of autoCompleteFolder) {
    const commandFiles = fs.readdirSync(`./commands/autoComplete/${folder}`).filter(file => /(\.ts|\.js)$/i.test(file));
    for (const file of commandFiles) {
        const command = require(`./commands/autoComplete/${folder}/${file}`);
        client.autoComplete.set(command.name, command);
    }
}

const buttonsFolder = fs.readdirSync('./commands/buttons');

for (const folder of buttonsFolder) {
    const commandFiles = fs.readdirSync(`./commands/buttons/${folder}`).filter(file => /(\.ts|\.js)$/i.test(file));
    for (const file of commandFiles) {
        const command = require(`./commands/buttons/${folder}/${file}`);
        client.buttons.set(command.name, command);
    }
}

const rest = new REST({ version: '9'}).setToken(process.env.TOKEN);

const commands: any = [];

for (const command of client.slashCommands.values()) {
    commands.push(command.data.toJSON());
}

(async () => {
    try {
        console.log('Started refreshing application commands.');

        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD), { body: commands });

        console.log('Successfully reloaded application commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.login(process.env.TOKEN);