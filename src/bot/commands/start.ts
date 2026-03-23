import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("start")
    .setDescription("Créer une nouvelle partie de Coup");

export async function execute(interaction: any) {

    const channelId = interaction.channelId;
    const userId = interaction.user.id;

    const gameManager = interaction.client.gameManager;
    //créé un nouveau salon qui sera supprimé à la fin de la partie.
    try {
        gameManager.createGame(channelId, userId);

        await interaction.reply("Partie créée ! Les joueurs peuvent rejoindre avec /join");
    } catch (error: any) {
        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });
    }
}