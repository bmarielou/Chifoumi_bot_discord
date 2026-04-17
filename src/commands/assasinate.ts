import { Command } from '@sapphire/framework';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
const path = require('path');

export class AssassinateCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'assassinate',
      description: 'Assassiner un joueur (coût : 3 pièces)',
      preconditions: ['checkGameActive']
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addUserOption(option =>
            option.setName("target")
            .setDescription("Joueur cible")
            .setRequired(true)
        )
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const channelId = interaction.channelId;
    const userId = interaction.user.id;
    const target = interaction.options.getUser("target")!;
    const gameManager = this.container.GameManager;
    const game = gameManager.getGame(channelId)!;
    const imagePath = path.join(process.cwd(), 'assets/Assassiner_assasin.png');
    const file = new AttachmentBuilder(imagePath);

    try {
        const result = game.assassinate(userId, target.id);
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`<@${result.attacker.id}> assassine <@${result.target.id}> !\n` + `<@${result.target.id}> perd une influence.`)
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