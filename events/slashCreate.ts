import { Events, Interaction } from "discord.js";

const name = Events.InteractionCreate;

async function execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const { client } = interaction;

    const command = client.slashCommands.find((command: any) => command.data.name === interaction.commandName)

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}

export { name, execute };