import getUser from "../../../functions/getUser";
import db from "../../../db";
import { ButtonInteraction } from "discord.js";
import { User } from "../../../models/user";

const name = 'normal';

async function execute(interaction: ButtonInteraction) {
    const user = await getUser(interaction.user.id);

    if (!user) return interaction.reply({ content: 'You need to link your account first!', ephemeral: true });

    await db<User>('users')
        .where('discord_id', interaction.user.id)
        .update({
            diff: 2
        });

    await interaction.reply({ content: 'Difficulty set to normal!', ephemeral: true });
}

export { name, execute };