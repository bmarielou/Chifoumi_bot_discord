import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("block")
    .setDescription("Bloquer une action");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = game.blockAssassination(interaction.user.id);

    if (result?.error) {
        return interaction.reply({
            content: result.error,
            ephemeral: true
        });
    }

    await interaction.reply(
        `🛡️ <@${result.id}> bloque l'assassinat avec Contessa !`
    );
}