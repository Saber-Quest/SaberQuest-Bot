import { CommandInteraction, SlashCommandBuilder, Client } from "discord.js";
import getUser from "../../../functions/getUser";

const data = new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your SaberQuest account to your discord account!');

async function execute(interaction: CommandInteraction) {
    const user = await getUser(interaction.user.id);
    if (user !== null) return await interaction.reply({ content: 'Your account is already linked!', ephemeral: true });
    await interaction.reply({ content: `To link your account, click [here](https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=identify).\n\nYou need to be logged into SaberQuest for this to work!`, ephemeral: true });
}

export { data, execute };