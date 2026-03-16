import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("assassinate")
    .setDescription("Assassiner un joueur (coût : 3 pièces)")
    .addUserOption(option =>
        option.setName("target")
        .setDescription("Joueur cible")
        .setRequired(true)
    );

export async function execute(interaction: any) {

    const channelId = interaction.channelId;
    const userId = interaction.user.id;
    const target = interaction.options.getUser("target");

    const gameManager = interaction.client.gameManager;
    const game = gameManager.getGame(channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }

    try {

        const result = game.assassinate(userId, target.id);

        await interaction.reply(
            `<@${result.attacker.id}> assassine <@${result.target.id}> !\n` +
            `<@${result.target.id}> perd une influence.`
        );

    } catch (error: any) {

        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });

    }
}