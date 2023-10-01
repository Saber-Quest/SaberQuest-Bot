import getUser from "../../../functions/getUser";
import db from "../../../db";
import { ButtonInteraction } from "discord.js";
import { User } from "../../../models/user";

const name = 'easy';

async function execute(interaction: ButtonInteraction) {
    const user = await getUser(interaction.user.id);

    if (!user) return interaction.reply({ content: 'You need to link your account first!', ephemeral: true });

    await db<User>('users')
        .where('discord_id', interaction.user.id)
        .update({
            diff: 1
        });

    await interaction.reply({ content: 'Difficulty set to easy!', ephemeral: true });
}

export { name, execute };