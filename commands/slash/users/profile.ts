import { createCanvas, loadImage, registerFont } from 'canvas';
import { CommandInteraction, SlashCommandBuilder, SlashCommandStringOption, AttachmentBuilder } from 'discord.js';
import getUser from '../../../functions/getUser';
import db from '../../../db';
import { UserItem } from '../../../models/userItem';
import { ChallengeHistory } from '../../../models/challengeHistory';
import { ChallengeSet } from '../../../models/challengeSet';

const data = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your profile!')
    .addStringOption((option: SlashCommandStringOption) => option.setName('user').setDescription('The user to view the profile of!'));

async function execute(interaction: CommandInteraction) {
    let user = interaction.options.get('user')?.value as string;

    if (!user) user = interaction.user.id;

    const userObject = await getUser(user);

    if (!userObject) return await interaction.reply({ content: 'This user does not exist!', ephemeral: true });

    const banner = createCanvas(1000, 200);
    const bannerContext = banner.getContext('2d');

    if (userObject.banner) {
        const bannerImage = await loadImage(`http://localhost:3010/profile/${userObject.platform_id}/banner?style=hor`)
        bannerContext.globalAlpha = 0.8;
        bannerContext.drawImage(bannerImage, 0, 0, 1000, 200);
        bannerContext.globalAlpha = 1;
        const mask = await loadImage('./assets/mask.png');
        bannerContext.drawImage(mask, 0, 0, 1000, 200);
    } else {
        bannerContext.fillStyle = '#000000';
        bannerContext.fillRect(0, 0, 1000, 200);
    }

    const avatar = await loadImage(userObject.avatar);
    bannerContext.drawImage(avatar, 0, 0, 200, 200);

    const usernameRank = userObject.username + ' (#' + userObject.rank + ')';
    const usernameFontSize = 60;

    bannerContext.font = `bold ${usernameFontSize}px sans-serif`;
    bannerContext.fillStyle = '#ffffff';
    bannerContext.fillText(usernameRank, 220, 70);

    if (userObject.preference === 'bl') {
        const blImage = await loadImage('./assets/bl.png');
        bannerContext.drawImage(blImage, 220 + bannerContext.measureText(usernameRank).width + 10, 70 - usernameFontSize + 10, usernameFontSize, usernameFontSize);
    } else if (userObject.preference === 'ss') {
        const ssImage = await loadImage('./assets/ss.png');
        bannerContext.drawImage(ssImage, 220 + bannerContext.measureText(usernameRank).width + 10, 70 - usernameFontSize + 10, usernameFontSize, usernameFontSize);
    }

    const itemsOwned = await db<UserItem>('user_items')
        .count('user_id as total')
        .where('user_id', userObject.id)

    const object = itemsOwned as unknown as { total: string }[];

    const itemsOwnedFontSize = 40;

    bannerContext.font = `bold ${itemsOwnedFontSize}px sans-serif`;
    bannerContext.fillStyle = '#FFD073';
    bannerContext.fillText(object[0].total, 220, 85 + itemsOwnedFontSize);

    bannerContext.font = `bold ${itemsOwnedFontSize}px sans-serif`;
    bannerContext.fillStyle = '#ffffff';
    bannerContext.fillText('items owned', 220 + bannerContext.measureText(object[0].total).width + 10, 85 + itemsOwnedFontSize);

    const challengesCompleted = await db<ChallengeHistory>('challenge_histories')
        .count('user_id as total')
        .where('user_id', userObject.id)

    const object2 = challengesCompleted as unknown as { total: string }[];

    const challengesCompletedFontSize = 40;

    bannerContext.font = `bold ${challengesCompletedFontSize}px sans-serif`;
    bannerContext.fillStyle = '#FFD073';
    bannerContext.fillText(object2[0].total, 220, 85 + itemsOwnedFontSize + challengesCompletedFontSize);

    bannerContext.font = `bold ${challengesCompletedFontSize}px sans-serif`;
    bannerContext.fillStyle = '#ffffff';
    bannerContext.fillText('challenges completed', 220 + bannerContext.measureText(object2[0].total).width + 10, 85 + itemsOwnedFontSize + challengesCompletedFontSize);

    await loadImage('./assets/qp.png').then(image => {
        bannerContext.drawImage(image, 900, 112, 80, 80);
    });

    const qpFontSize = 40;

    bannerContext.font = `bold ${qpFontSize}px sans-serif`;
    bannerContext.fillStyle = '#FFD073';
    bannerContext.textAlign = 'right';
    bannerContext.fillText(userObject.qp.toString(), 1000 - 100, 85 + itemsOwnedFontSize + challengesCompletedFontSize);

    const bannerAttachment = new AttachmentBuilder(banner.toBuffer(), { name: 'banner.png' });

    await interaction.reply({ files: [bannerAttachment] });
}

export { data, execute };