import { SlashCommandBuilder } from 'discord.js';
import { gameManager } from '../../index';

export const data = new SlashCommandBuilder()
    .setName('steal')
    .setDescription('Voler 2 pièces à un autre joueur')
    .addUserOption(option =>
        option.setName('target')
              .setDescription('Le joueur à voler')
              .setRequired(true)
    );

export async function execute(interaction: any) {
    const target = interaction.options.getUser('target');

    // ⚡ Vérifie qu'une partie est en cours
    const game = gameManager.currentGame;
    if (!game) {
        await interaction.reply({ content: "Aucune partie en cours.", ephemeral: true });
        return;
    }

    try {
        // utilise la variable game déjà vérifiée
        const stolen = game.steal(interaction.user.id, target.id);
        await interaction.reply(`<@${interaction.user.id}> a volé ${stolen} pièces à <@${target.id}> !`);
    } catch (err: any) {
        await interaction.reply({ content: err.message, ephemeral: true });
    }
}