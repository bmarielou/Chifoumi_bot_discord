import { Command } from '@sapphire/framework';

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'ping',
      description: 'Vérifie que le bot est en ligne',
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
    const latency = Math.round(this.container.client.ws.ping);
    return interaction.reply('Pong ! 🏓');
  }
}