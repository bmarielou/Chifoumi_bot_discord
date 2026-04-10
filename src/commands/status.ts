import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

export class StatusCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'status',
      description: `Afficher l'état de la partie`,
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description),
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const channelId = interaction.channelId;
    const gameManager = this.container.GameManager;
    const game = gameManager.getGame(channelId);

    if (!game) {
        return interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
    }
    const players = game.players
        .map((p: any) => `<@${p.id}> — ${p.coins} pièces`)
        .join("\n");

    const currentPlayer = game.getCurrentPlayer();

    const embed = new EmbedBuilder()
        .setTitle("État de la partie")
        .addFields(
            { name: "Joueurs", value: players || "Aucun joueur" },
            { name: "Tour actuel", value: `<@${currentPlayer.id}>` }
        )
        .setColor(0x5865F2);

    await interaction.reply({ embeds: [embed] });
  }
}