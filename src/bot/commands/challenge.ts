import { SlashCommandBuilder } from "discord.js";
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName("challenge")
    .setDescription("Contester l'action précédente");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = await game.challenge(interaction.user.id);

    if (handleGameResult(interaction, result)) return;

    const data = result.data;

    if (data.success) {
        await interaction.reply(
            `🔥 Challenge réussi ! <@${data.challengedPlayerId}> bluffait !`
        );
    } else {
        await interaction.reply(
            `❌ Challenge échoué ! <@${data.challengerId}> perd une influence.`
        );
    }
}