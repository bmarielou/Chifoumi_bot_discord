import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';

export class JoinCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'join',
      description: `Rejoindre une partie en cours`,
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
    const userId = interaction.user.id;
    const gameManager = this.container.GameManager;
    const game = gameManager.getGame(channelId)!;

    try {
        game.addPlayer(userId);
        await interaction.reply("Vous avez rejoint la partie !");
    } catch (error: any) {
        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });
    }
  }
}