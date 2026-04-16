import { SlashCommandBuilder } from "discord.js";
import { handleGameResult } from "../../utils/handleGameResult";

export const data = new SlashCommandBuilder()
    .setName("assassin")
    .setDescription("Assassiner un joueur (coût : 3 pièces)")
    .addUserOption(option =>
        option.setName("target")
            .setDescription("Joueur cible")
            .setRequired(true)
    );

export async function execute(interaction: any) {

    const userId = interaction.user.id;
    const target = interaction.options.getUser("target");

    const game = interaction.client.gameManager.getGame(interaction.channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    if (!target) {
        return interaction.reply({
            content: "Cible invalide.",
            ephemeral: true
        });
    }

    if (target.id === userId) {
        return interaction.reply({
            content: "Tu ne peux pas t'assassiner toi-même.",
            ephemeral: true
        });
    }

    const result = await game.assassinate(userId, target.id);

    if (handleGameResult(interaction, result)) return;

    await interaction.reply(
        `⚔️ <@${userId}> tente d'assassiner <@${target.id}> !\n` +
        `⏳ <@${target.id}> peut bloquer avec Contesse et les autres joueurs peuvent challenger.`
    );
}