import { Events, Interaction } from "discord.js";

const name = Events.InteractionCreate;

async function execute(interaction: Interaction) {
    if (!interaction.isButton()) return;

    const { client } = interaction;

    const button = client.buttons.find((button: any) => button.name === interaction.customId)

    if (!button) return;

    try {
        await button.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
    }
}

export { name, execute };