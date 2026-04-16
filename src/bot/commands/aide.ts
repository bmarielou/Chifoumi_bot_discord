import { SlashCommandBuilder } from "discord.js";
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName("aide")
    .setDescription("Prendre 2 pièces (aide étrangère)");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = await game.foreignAid(interaction.user.id);

    if (handleGameResult(interaction, result)) return;

    const player = result.data;

    await interaction.reply(
        `💰 <@${player.id}> utilise "aide étrangère" et prend 2 pièces.\n` +
        `❗ Peut être bloqué avec /block-aide`
    );
}