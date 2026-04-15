import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("income")
    .setDescription("Prendre 1 pièce");

export async function execute(interaction: any) {

    const channelId = interaction.channelId;
    const userId = interaction.user.id;

    const gameManager = interaction.client.gameManager;
    const game = gameManager.getGame(channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie n'a commencé.",
            ephemeral: true
        });
    }

    const result = game.income(userId);

    if (result?.error === "NOT_YOUR_TURN") {
        return interaction.reply({
            content: "Ce n'est pas votre tour.",
            ephemeral: true
        });
    }

    if (result?.error === "GAME_NOT_STARTED") {
        return interaction.reply({
            content: "La partie n'a pas commencé.",
            ephemeral: true
        });
    }

    await interaction.reply(
        `💰 <@${result.id}> prend 1 pièce.\nIl a maintenant ${result.coins} pièces.`
    );
}