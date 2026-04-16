import { SlashCommandBuilder } from "discord.js";
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName("revenu")
    .setDescription("Prendre 1 pièce");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = await game.income(interaction.user.id);

    if (handleGameResult(interaction, result)) return;

    const player = result.data;

    await interaction.reply(
        `💰 <@${player.id}> prend son revenu et prend 1 pièce.\nIl a maintenant ${player.coins} pièces.`
    );
}