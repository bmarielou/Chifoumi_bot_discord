import { Command } from '@sapphire/framework';

export class ExchangeCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'exchange',
      description: 'Échanger vos cartes avec le deck',
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
    const game = gameManager.getGame(channelId);

    if (!game) {
        return interaction.reply({
          content: "Aucune partie en cours dans ce salon.",
          ephemeral: true
        })
    }

    try {
        // use a variable game already check
        const newCards = game.exchange(interaction.user.id);
        await interaction.reply(`<@${interaction.user.id}> a échangé ses cartes.`);
    } catch (err: any) {
        await interaction.reply({ content: err.message, ephemeral: true });
    }
    
  }
}