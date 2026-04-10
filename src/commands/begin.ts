import { Command } from '@sapphire/framework';

export class BeginCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'begin',
      description: 'Lancer une partie',
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
          content: "Aucune partie en cours dans ce salon.",
          ephemeral: true
        })
    }

    try {
        game.startGame();

        for (const player of game.players) {
            const user = await interaction.client.users.fetch(player.id);

            await user.send(
                `Tes cartes sont :\n- ${player.cards[0]}\n- ${player.cards[1]}`
            );
        }

        await interaction.reply("La partie commence.");
    } catch (error: any) {
        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });
    }
    
  }
}