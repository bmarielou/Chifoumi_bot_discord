import { Command } from '@sapphire/framework';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
const path = require('path');

export class ExchangeCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'exchange',
      description: 'Échanger vos cartes avec le deck',
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
    const imagePath = path.join(process.cwd(), 'assets/echange_ambasadeur.png');
    const file = new AttachmentBuilder(imagePath);

    try {
        // use a variable game already check
        const newCards = game.exchange(interaction.user.id);
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`<@${interaction.user.id}> a échangé ses cartes.`)
          ],
          files: [file]
        });
    } catch (err: any) {
        await interaction.reply({ content: err.message, ephemeral: true });
    }
    
  }
}