import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("status")
    .setDescription("Afficher l'état de la partie");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const players = game.players
        .map((p: any) => `<@${p.id}> — ${p.coins} pièces`)
        .join("\n");

    const currentPlayer = game.getCurrentPlayer();

    const embed = new EmbedBuilder()
        .setTitle("🎮 État de la partie")
        .addFields(
            { name: "Joueurs", value: players || "Aucun joueur" },
            { name: "Tour actuel", value: `<@${currentPlayer.id}>` }
        )
        .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed] });
}