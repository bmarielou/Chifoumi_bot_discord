import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("begin")
    .setDescription("Lancer la partie");

export async function execute(interaction: any) {

    const channelId = interaction.channelId;
    const gameManager = interaction.client.gameManager;

    const game = gameManager.getGame(channelId);

    if (!game) {
        return interaction.reply({
            content: "Pas de partie en cours.",
            ephemeral: true
        });
    }
    // seul le joueur qui à créé la partie peut lancé la partie, s'il à quitté la partie passé au joueur suivant
    try {
        game.startGame();

        for (const player of game.players) {
            const user = await interaction.client.users.fetch(player.id);

            await user.send(
                `Tes cartes sont :\n- ${player.cards[0]}\n- ${player.cards[1]}`
            );
        }
        await interaction.reply("La partie commence.");
        } catch (error: any) {
        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });
    }
}