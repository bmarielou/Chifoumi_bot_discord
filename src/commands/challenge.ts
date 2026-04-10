import { Command } from '@sapphire/framework';

export class ChallengeCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: 'challenge',
      description: 'Défier un joueur (coût : 2 pièces)',
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
    const game = gameManager.getGame(channelId);

    if (!game) {
        return interaction.reply({
          content: "Aucune partie en cours dans ce salon.",
          ephemeral: true
        })
    }
    // TODO: A IMPLEMENTER 
    // try {

    //     const result = game.challenge(userId);

    //     if (result.result === "challenge_failed") {

    //         await interaction.reply(
    //             `Challenge échoué ! <@${result.player.id}> avait bien **Duke**.`
    //         );

    //     } else {

    //         await interaction.reply(
    //             `Challenge réussi ! <@${result.player.id}> bluffait !`
    //         );

    //     }

    // } catch (error: any) {

    //     await interaction.reply({
    //         content: `${error.message}`,
    //         ephemeral: true
    //     });

    // }
    
  }
}