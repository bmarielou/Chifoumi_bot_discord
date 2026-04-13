import { Command } from '@sapphire/framework';

export class StealCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'steal',
      description: 'Voler 2 pièces à un autre joueur',
      preconditions: ['checkGameActive']
    });
  } 

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption(option =>
            option.setName('target')
                  .setDescription('Le joueur à voler')
                  .setRequired(true)
        )
    ); 
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const channelId = interaction.channelId;
    const userId = interaction.user.id;
    const gameManager = this.container.GameManager;
    const game = gameManager.getGame(channelId)!;
    const target = interaction.options.getUser('target')!;

    try {
        // use a variable game already check
        const stolen = game.steal(userId, target.id);
        await interaction.reply(`<@${userId}> a volé ${stolen} pièces à <@${target.id}> !`);
    } catch (err: any) {
        await interaction.reply({ content: err.message, ephemeral: true });
    }
    
  }
}