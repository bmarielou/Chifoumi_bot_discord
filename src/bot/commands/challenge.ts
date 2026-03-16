import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("challenge")
    .setDescription("Contester l'action précédente");

export async function execute(interaction: any) {

    const channelId = interaction.channelId;
    const userId = interaction.user.id;

    const gameManager = interaction.client.gameManager;
    const game = gameManager.getGame(channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    try {

        const result = game.challenge(userId);

        if (result.result === "challenge_failed") {

            await interaction.reply(
                `Challenge échoué ! <@${result.player.id}> avait bien **Duke**.`
            );

        } else {

            await interaction.reply(
                `Challenge réussi ! <@${result.player.id}> bluffait !`
            );

        }

    } catch (error: any) {

        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });

    }

}