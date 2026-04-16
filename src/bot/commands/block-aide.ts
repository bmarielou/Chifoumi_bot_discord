import { SlashCommandBuilder } from "discord.js";
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName("block-aide")
    .setDescription("Bloquer une aide étrangère avec Duc");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = game.blockForeignAid(interaction.user.id);

    if (handleGameResult(interaction, result)) return;

    const player = result.data;

    await interaction.reply(
        `🛑 <@${player.id}> bloque l'aide étrangère avec Duc \n` +
        `❗ Les autres joueurs peuvent contester avec /challenge`
    );
}