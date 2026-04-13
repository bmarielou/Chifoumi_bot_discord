import { Command } from '@sapphire/framework';

export class StartCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'start',
      description: 'Créer une nouvelle partie de Coup',
      preconditions: ['checkGameActive']
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
    const userId= interaction.user.id;
    const gameManager = this.container.GameManager;

    try {
        gameManager.createGame(channelId, userId);

        await interaction.reply("Partie créée ! Les joueurs peuvent rejoindre avec /join");
    } catch (error: any) {
        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });
    }

  }
}