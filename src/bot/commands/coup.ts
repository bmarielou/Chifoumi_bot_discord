import { SlashCommandBuilder } from "discord.js";
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName("coup")
    .setDescription("Effectuer un coup (coût : 7 pièces)")
    .addUserOption(option =>
        option.setName("target")
            .setDescription("Joueur cible")
            .setRequired(true)
    );

export async function execute(interaction: any) {

    const target = interaction.options.getUser("target");

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    const result = await game.coup(interaction.user.id, target.id);

    if (handleGameResult(interaction, result)) return;

    const { attacker, target: tgt } = result.data;

    await interaction.reply(
        `💥 <@${attacker.id}> fait un Coup contre <@${tgt.id}> !\n` +
        `<@${tgt.id}> perd une influence.\n` +
        `❌ Action impossible à bloquer ou contester.`
    );
}