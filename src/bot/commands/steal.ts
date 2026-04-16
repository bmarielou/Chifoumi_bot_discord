import { SlashCommandBuilder } from 'discord.js';
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName('capitaine')
    .setDescription('Voler 2 pièces à un autre joueur')
    .addUserOption(option =>
        option.setName('target')
            .setDescription('Le joueur à voler')
            .setRequired(true)
    );

export async function execute(interaction: any) {

    const target = interaction.options.getUser('target');

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = await game.steal(interaction.user.id, target.id);

    if (handleGameResult(interaction, result)) return;

    await interaction.reply(
        `🪙 <@${interaction.user.id}> utilise Capitaine et vole 2 pièces à <@${target.id}> !`
    );
}