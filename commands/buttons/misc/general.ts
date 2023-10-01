import { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Stats } from "../../../types/stats";

const name = 'general';

async function execute(interaction: ButtonInteraction) {
    const stats: Stats = await fetch('http://localhost:3010/stats').then(res => res.json());

    const embed = new EmbedBuilder()
        .setTitle('SaberQuest Stats')
        .setThumbnail('attachment://trophy.png')
        .addFields([
            { name: 'Users', value: stats.users.total.toString(), inline: true },
            { name: 'Challenges', value: stats.challenges.total.toString(), inline: true },
            { name: 'Items', value: stats.items.total.toString(), inline: true },
        ])
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: 'SaberQuest latest stats', iconURL: 'attachment://trophy.png'})

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('General')
                .setCustomId('general')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setLabel('Users Detailed')
                .setCustomId('users')
                .setStyle(ButtonStyle.Primary),
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