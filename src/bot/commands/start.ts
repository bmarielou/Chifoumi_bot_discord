import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("start")
    .setDescription("Créer une nouvelle partie de Coup");

export async function execute(interaction: any) {

    try {
        interaction.client.gameManager.createGame(
            interaction.channelId,
            interaction.user.id
        );

        await interaction.reply("🎮 Partie créée ! Utilisez /join pour rejoindre.");
    } catch (error: any) {
        await interaction.reply({
            content: error.message,
            ephemeral: true
        });
    }
}