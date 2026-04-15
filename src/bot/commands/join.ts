import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Rejoindre une partie en cours");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours dans ce salon.",
            ephemeral: true
        });
    }

    const result = game.addPlayer(interaction.user.id);

    if (result?.error) {
        return interaction.reply({
            content: result.error,
            ephemeral: true
        });
    }

    await interaction.reply("✅ Vous avez rejoint la partie !");
}