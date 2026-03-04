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

    try {

        const player = game.income(userId);

        await interaction.reply(
            `💰 <@${player.id}> prend 1 pièce.\nIl a maintenant ${player.coins} pièces.`
        );

    } catch (error: any) {
        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });
    }
}
