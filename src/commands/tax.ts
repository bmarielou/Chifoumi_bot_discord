import { Command } from '@sapphire/framework';

export class TaxCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'tax',
      description: 'Prendre 3 pièces (Duke)',
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
    const userId = interaction.user.id;
    const gameManager = this.container.GameManager;

    const game = gameManager.getGame(channelId);

    if (!game) {
        return interaction.reply({
          content: "Aucune partie en cours dans ce salon.",
          ephemeral: true
        })
    }

    try {
        const player = game.tax(userId);
        await interaction.reply(
            `<@${player.id}> utilise **Duke** et gagne 3 pièces.\nIl a maintenant ${player.coins} pièces.`
        );

    } catch (error: any) {

        await interaction.reply({
            content: ` ${error.message}`,
            ephemeral: true
        });

    }
    
  }
}