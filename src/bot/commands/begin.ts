import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("commencer")
    .setDescription("Lancer la partie");

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Pas de partie en cours.",
            ephemeral: true
        });
    }

    if (interaction.user.id !== game.creatorId) {
        return interaction.reply({
            content: "Seul le créateur peut lancer la partie.",
            ephemeral: true
        });
    }

    const result = game.startGame();

    if (result?.error) {
        return interaction.reply({
            content: result.error,
            ephemeral: true
        });
    }

    for (const player of game.players) {
        const user = await interaction.client.users.fetch(player.id);

        await user.send(
            `🎴 Tes cartes :\n- ${player.cards[0]}\n- ${player.cards[1]}`
        );
    }

    await interaction.reply("🚀 La partie commence !");
}