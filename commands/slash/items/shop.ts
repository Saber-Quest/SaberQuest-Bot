import { SlashCommandBuilder, CommandInteraction, AttachmentBuilder, EmbedBuilder } from "discord.js";
import { createCanvas, loadImage } from "canvas";
import * as fs from 'fs';

function getColor(rarity: string) {
    switch (rarity) {
        case "Common":
            return "#ffffff";
        case "Uncommon":
            return "#5CD722";
        case "Rare":
            return "#2594FA";
        case "Epic":
            return "#AD00FF";
        case "Legendary":
            return "#FFD600";
        default:
            return "#ffffff";
    }
}

interface IShopItem {
    id: string;
    name: string;
    image: string;
    rarity: string;
    price: number;
}

class Shop {
    items: IShopItem[];
    reset_time: number;
}

const data = new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View the shop!');

async function execute(interaction: CommandInteraction) {
    const shop: Shop = await fetch('http://localhost:3010/items/shop').then(res => res.json());

    const canvas = createCanvas(220 * 5, 250);
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < shop.items.length; i++) {
        const item = shop.items[i];
        const image = await loadImage(item.image);
        ctx.strokeStyle = getColor(item.rarity);
        ctx.lineWidth = 10;
        ctx.strokeRect(220 * i, 25, 200, 200);
        ctx.drawImage(image, 220 * i, 25, 200, 200);
    }

    const attachement = new AttachmentBuilder(canvas.toBuffer(), { name: "shop.png" });

    const resetsIn = new Date(shop.reset_time).getTime() - Date.now();
    const hours = Math.floor(resetsIn / 1000 / 60 / 60);
    const minutes = Math.floor(resetsIn / 1000 / 60 - hours * 60);
    const seconds = Math.floor(resetsIn / 1000 - hours * 60 * 60 - minutes * 60);

    const time = `${hours}h ${minutes}m ${seconds}s`;

    const trophy = fs.readFileSync('./assets/trophy.png');

    const attachement2 = new AttachmentBuilder(trophy, { name: 'trophy.png' });

    const embed = new EmbedBuilder()
        .setTitle("SaberQuest Shop")
        .setImage("attachment://shop.png")
        .setColor("Random")
        .setFooter({ text: `SaberQuest Shop | Resets in ${time}`, iconURL: "attachment://trophy.png" });

    interaction.reply({ embeds: [embed], files: [attachement, attachement2] });
}

export { data, execute };