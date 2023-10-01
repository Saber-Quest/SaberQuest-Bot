import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from "discord.js";
import db from "../../../db";
import { ChallengeHistory } from "../../../models/challengeHistory";
import { ChallengeSet } from "../../../models/challengeSet";
import { Difficulty } from "../../../models/difficulty";
import * as fs from 'fs';

function formatDifficulty(difficulty: Difficulty, type: string): string {
    if (type === "map" || type === "fcnotes" || type === "passnotes") {
        return `**${difficulty.challenge[0]}**`
    } else if (type === "xaccuracystars") {
        return `**BeatLeader:** ${difficulty.challenge[1]}\n**ScoreSaber:** ${difficulty.challenge[0]}\n**Accuracy**: ${difficulty.challenge[2]}%`
    } else if (type === "xaccuracypp") {
        return `**BeatLeader:** ${difficulty.challenge[1]}\n**ScoreSaber:** ${difficulty.challenge[0]}\n**pp**: ${difficulty.challenge[2]} pp`
    } else if (type === "xaccuracynotes") {
        return `**Notes:** ${difficulty.challenge[0]}\n**Accuracy**: ${difficulty.challenge[1]}%`
    } else if (type === "pp") {
        return `**BeatLeader:** ${difficulty.challenge[1]} pp\n**ScoreSaber:** ${difficulty.challenge[0]} pp`
    } else if (type === "fcstars") {
        return `**BeatLeader:** ${difficulty.challenge[1]} stars\n**ScoreSaber:** ${difficulty.challenge[0]} stars`
    }
}

const data = new SlashCommandBuilder()
    .setName('challenges')
    .setDescription('Get the daily challenges from SaberQuest!');

async function execute(interaction: CommandInteraction) {
    const dailyChallenge = await db<ChallengeHistory>('challenge_histories')
        .select("challenge_id")
        .orderBy("date", "desc")
        .first();

    const challenge = await db<ChallengeSet>('challenge_sets')
        .select("name", "description", "type")
        .where("id", dailyChallenge.challenge_id)
        .first();

    const difficulties = await db<Difficulty>('difficulties')
        .select("diff", "challenge")
        .where("challenge_id", dailyChallenge.challenge_id);

    const sort = difficulties.sort((a, b) => a.diff - b.diff) as unknown as Difficulty[];

    const trophy = fs.readFileSync('./assets/trophy.png');

    const attachement = new AttachmentBuilder(trophy, { name: 'trophy.png' });

    const embed = new EmbedBuilder()
        .setTitle(challenge.name)
        .setDescription(challenge.description)
        .addFields([
            { name: 'Easy', value: formatDifficulty(sort[0], challenge.type), inline: true },
            { name: 'Normal', value: formatDifficulty(sort[1], challenge.type), inline: true },
            { name: 'Hard', value: formatDifficulty(sort[2], challenge.type), inline: true }
        ])
        .setColor('Random')
        .setFooter({ text: 'SaberQuest Challenges', iconURL: 'attachment://trophy.png' })
        .setTimestamp()

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('none')
                .setLabel('Pick a challenge ➡️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('easy')
                .setLabel('Easy')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('normal')
                .setLabel('Normal')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('expert')
                .setLabel('Expert')
                .setStyle(ButtonStyle.Primary),
        )

    // @ts-ignore
    await interaction.reply({ embeds: [embed], components: [row], files: [attachement] });
}

export { data, execute };