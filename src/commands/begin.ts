import { Command } from '@sapphire/framework';
import { AttachmentBuilder } from 'discord.js';
import path from 'path';

const CARD_IMAGES: Record<string, string> = {
  Duke: 'Duc.png',
  Assassin: 'Assassin.png',
  Captain: 'Capitaine.png',
  Ambassador: 'Ambassadeur.png',
  Contessa: 'Comtesse.png',
};

export class BeginCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'begin',
      description: 'Lancer une partie',
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
    const gameManager = this.container.GameManager;
    const game = gameManager.getGame(channelId)!;

    await interaction.deferReply();

    try {
        game.startGame();

        for (const player of game.players) {
            const user = await interaction.client.users.fetch(player.id);

            const attachments = player.cards.map((card) => {
                const file = path.join(process.cwd(), 'assets', CARD_IMAGES[card]);
                return new AttachmentBuilder(file, { name: CARD_IMAGES[card] });
            });

            await user.send({
                content: `Tes cartes sont :\n- ${player.cards[0]}\n- ${player.cards[1]}`,
                files: attachments,
            });
        }

        await interaction.editReply("La partie commence.");
    } catch (error: any) {
        await interaction.editReply(`${error.message}`);
    }
    
  }
}