import { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Stats } from "../../../types/stats";

const name = 'users';

async function execute(interaction: ButtonInteraction) {
    const stats: Stats = await fetch("http://localhost:3010/stats").then(res => res.json());

    const embed = new EmbedBuilder() 
        .setTitle('SaberQuest Stats')
        .setThumbnail('attachment://trophy.png')
        .addFields([
            { name: 'Total users', value: stats.users.total.toString(), inline: true },
            { name: 'Mod users', value: stats.users.modUsers.toString(), inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'ScoreSaber', value: stats.users.preferences.ScoreSaber.toString(), inline: true },
            { name: 'BeatLeader', value: stats.users.preferences.BeatLeader.toString(), inline: true },
            { name: '\u200B', value: '\u200B' },
            { name: 'Total QP', value: stats.users.totalQp.toString(), inline: true },
        ])
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: 'SaberQuest latest stats', iconURL: 'attachment://trophy.png' })

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('General')
                .setCustomId('general')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setLabel('Users Detailed')
                .setCustomId('users')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('Challenges Detailed')
                .setCustomId('challenges')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setLabel('Items Detailed')
                .setCustomId('items')
                .setStyle(ButtonStyle.Primary),
        )

    // @ts-ignore
    await interaction.update({ embeds: [embed], components: [row] });
}

export { name, execute };