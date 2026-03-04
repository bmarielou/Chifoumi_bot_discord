import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("begin")
    .setDescription("Lancer la partie");

export async function execute(interaction: any) {

    const channelId = interaction.channelId;
    const gameManager = interaction.client.gameManager;

    const game = gameManager.getGame(channelId);

    if (!game) {
        return interaction.reply({
            content: "Pas de partie en cours.",
            ephemeral: true
        });
    }

    try {
        game.startGame();

        await interaction.reply("La partie se lance");
    } catch (error: any) {
        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });
    }
}