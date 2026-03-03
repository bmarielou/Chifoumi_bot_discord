import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Rejoindre une partie en cours");

export async function execute(interaction: any) {

    const channelId = interaction.channelId;
    const userId = interaction.user.id;

    const gameManager = interaction.client.gameManager;

    const game = gameManager.getGame(channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours dans ce salon.",
            ephemeral: true
        });
    }

    try {
        game.addPlayer(userId);

        await interaction.reply("Vous avez rejoint la partie !");
    } catch (error: any) {
        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });
    }
}