import { SlashCommandBuilder } from "discord.js";
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName("pass")
    .setDescription("Passer votre tour de réaction");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = game.pass(interaction.user.id);

    if (handleGameResult(interaction, result)) return;

    if (result.data === "PASSED") {
        await interaction.reply(`👍 <@${interaction.user.id}> passe.`);
    }

    if (result.data === "RESOLVED") {
        await interaction.reply(`✅ Tous les joueurs ont passé. Action résolue.`);
    }
}