import { Command } from '@sapphire/framework';

export class ChallengeCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'challenge',
      description: 'Contester la dernière action jouée',
      preconditions: ['checkGameActive']
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const channelId = interaction.channelId;
    const userId = interaction.user.id;
    const gameManager = this.container.GameManager;
    const game = gameManager.getGame(channelId)!;

    try {
      const result = game.challenge(userId);

      if (result.result === 'challenge_success') {
        await interaction.reply(`🔥 Challenge réussi ! ${result.message}`);
      } else {
        await interaction.reply(`❌ Challenge échoué ! ${result.message}`);
      }
    } catch (error: any) {
      await interaction.reply({
        content: `⛔ ${error.message}`,
        ephemeral: true
      });
    }
  }
}
