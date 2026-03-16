import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("tax")
    .setDescription("Prendre 3 pièces (Duke)");

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

        const player = game.tax(userId);

        await interaction.reply(
            `<@${player.id}> utilise **Duke** et gagne 3 pièces.\nIl a maintenant ${player.coins} pièces.`
        );

    } catch (error: any) {

        await interaction.reply({
            content: ` ${error.message}`,
            ephemeral: true
        });

    }
}