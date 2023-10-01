import { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Stats } from "../../../types/stats";

const name = 'items';

async function execute(interaction: ButtonInteraction) {
    const stats: Stats = await fetch('http://localhost:3010/stats').then(res => res.json());

    const embed = new EmbedBuilder()
        .setTitle('SaberQuest Stats')
        .setThumbnail('attachment://trophy.png')
        .addFields([
            { name: 'Total items', value: stats.items.total.toString(), inline: true },
            { name: 'Total items owned', value: stats.items.totalOwned.toString(), inline: true},
            { name: '\u200B', value: '\u200B' },
            { name: 'Common', value: stats.items.byRarity.common.toString(), inline: true },
            { name: 'Uncommon', value: stats.items.byRarity.uncommon.toString(), inline: true },
            { name: 'Rare', value: stats.items.byRarity.rare.toString(), inline: true },
            { name: 'Epic', value: stats.items.byRarity.epic.toString(), inline: true },
            { name: 'Legendary', value: stats.items.byRarity.legendary.toString(), inline: true },
        ])
        .setColor('Random')
        .setTimestamp()
        .setFooter({ text: 'SaberQuest latest stats', iconURL: 'attachment://trophy.png'})

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setLabel('General')
                .setCustomId('general')
                .setStyle(ButtonStyle.Primary),
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
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
        )

    // @ts-ignore
    await interaction.update({ embeds: [embed], components: [row] });
}

export { name, execute };