import { SlashCommandBuilder } from "discord.js";
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName("income")
    .setDescription("Prendre 1 pièce");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie n'a commencé.",
            ephemeral: true
        });
    }

    const result = game.income(interaction.user.id);

    if (handleGameResult(interaction, result)) return;

    await interaction.reply(
        `💰 <@${result.id}> prend 1 pièce.\nIl a maintenant ${result.coins} pièces.`
    );
}