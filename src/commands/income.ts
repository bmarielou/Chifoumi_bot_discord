import { Command } from '@sapphire/framework';

export class IncomeCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'income',
      description: 'Prendre 1 pièce',
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
        const player = game.income(userId);
        await interaction.reply(
            `💰 <@${player.id}> prend 1 pièce.\nIl a maintenant ${player.coins} pièces.`
        );

    } catch (error: any) {
        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });
    }
    
  }
}