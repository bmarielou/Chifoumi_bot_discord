import { SlashCommandBuilder } from 'discord.js';
import { gameManager } from '../../index';

export const data = new SlashCommandBuilder()
    .setName('exchange')
    .setDescription('Échanger vos cartes avec le deck');

export async function execute(interaction: any) {
    // ⚡ Vérifie qu'une partie est en cours
    const game = gameManager.currentGame;
    if (!game) {
        await interaction.reply({ content: "Aucune partie en cours.", ephemeral: true });
        return;
    }

    try {
        // utilise la variable game déjà vérifiée
        const newCards = game.exchange(interaction.user.id);
        await interaction.reply(`<@${interaction.user.id}> a échangé ses cartes.`);
    } catch (err: any) {
        await interaction.reply({ content: err.message, ephemeral: true });
    }
}