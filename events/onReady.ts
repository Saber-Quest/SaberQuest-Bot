import { Events } from 'discord.js';

const name = Events.ClientReady;

async function execute() {
    console.log('Ready!');
}

export { name, execute };