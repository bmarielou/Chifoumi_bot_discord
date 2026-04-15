import { SlashCommandBuilder } from "discord.js";

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

    const result = game.challenge(interaction.user.id);

    if (result?.error) {
        return interaction.reply({
            content: result.error,
            ephemeral: true
        });
    }

    if (result.result === "challenge_failed") {
        await interaction.reply(`❌ Challenge échoué ! <@${result.target.id}> avait bien la carte.`);
    } else {
        await interaction.reply(`🔥 Challenge réussi ! <@${result.target.id}> bluffait !`);
    }
}