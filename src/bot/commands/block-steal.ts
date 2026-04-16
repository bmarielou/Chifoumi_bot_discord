import { SlashCommandBuilder } from "discord.js";
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName("block-capitaine")
    .setDescription("Bloquer un vol avec Capitaine ou Ambassadeur");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = game.blockSteal(interaction.user.id);

    if (handleGameResult(interaction, result)) return;

    const player = result.data;

    await interaction.reply(
        `🛑 <@${player.id}> bloque le vol avec Capitaine ou Ambassadeur !\n` +
        `❗ Vous pouvez contester avec /challenge`
    );
}