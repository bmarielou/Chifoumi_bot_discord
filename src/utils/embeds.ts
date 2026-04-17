import { EmbedBuilder } from "discord.js";

export function createEmbed(title: string, description: string, image?: string, color: number = 0x5865f2) {
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color);

    if (image) {
        embed.setImage(image);
    }

    return embed;
}