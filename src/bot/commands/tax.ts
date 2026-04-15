import { SlashCommandBuilder } from "discord.js";
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName("tax")
    .setDescription("Prendre 3 pièces (Duke)");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = game.tax(interaction.user.id);

    if (handleGameResult(interaction, result)) return;

    await interaction.reply(
        `👑 <@${result.id}> utilise Duke et gagne 3 pièces.\nIl a maintenant ${result.coins} pièces.`
    );
}