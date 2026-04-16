import { SlashCommandBuilder } from 'discord.js';
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName('ambassadeur')
    .setDescription('Échanger vos cartes avec 2 nouvelles cartes');

export async function execute(interaction: any) {

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = game.exchange(interaction.user.id);

    if (handleGameResult(interaction, result)) return;

    await interaction.reply(
        `🔄 <@${interaction.user.id}> utilise Ambassadeur et échange ses cartes.`
    );
}