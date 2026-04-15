import { SlashCommandBuilder } from 'discord.js';
import { gameManager } from '../../core/gameManagerInstance';

export const data = new SlashCommandBuilder()
    .setName('exchange')
    .setDescription('Échanger vos cartes avec le deck');

export async function execute(interaction: any) {
    // check if game already start
    const game = gameManager.currentGame;
    if (!game) {
        await interaction.reply({ content: "Aucune partie en cours.", ephemeral: true });
        return;
    }

    try {
        // use a variable game already check
        const newCards = game.exchange(interaction.user.id);
        await interaction.reply(`<@${interaction.user.id}> a échangé ses cartes.`);
    } catch (err: any) {
        await interaction.reply({ content: err.message, ephemeral: true });
    }
}