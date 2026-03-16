import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("block")
    .setDescription("Bloquer une action (ex: Contessa bloque assassinat)");

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

        const player = game.blockAssassination(userId);

        await interaction.reply(
            `<@${player.id}> bloque l'assassinat avec **Contessa** !`
        );

    } catch (error: any) {

        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });

    }

}