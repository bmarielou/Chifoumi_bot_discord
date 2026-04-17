import { Command } from '@sapphire/framework';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
const path = require('path');

export class BlockCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'block',
      description: 'Bloquer une action (ex: Contessa bloque assassinat)',
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
    const game = gameManager.getGame(channelId);
    const imagePath = path.join(process.cwd(), 'assets/bloquer_assassinat_comtesse.png');
    const file = new AttachmentBuilder(imagePath);

    try {
        const player = game!.blockAssassination(userId);
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`<@${player.id}> bloque l'assassinat avec **Contessa** !`)
          ],
          files: [file]
        });

    } catch (error: any) {
        await interaction.reply({
            content: `${error.message}`,
            ephemeral: true
        });
    }
    
  }
}