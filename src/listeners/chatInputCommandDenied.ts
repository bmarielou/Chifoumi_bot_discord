import { Events, Listener, UserError } from '@sapphire/framework';
import type { ChatInputCommandDeniedPayload } from '@sapphire/framework';

export class ChatInputCommandDeniedListener extends Listener {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.ChatInputCommandDenied
    });
  }

  public async run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    if (interaction.deferred || interaction.replied) {
      return interaction.editReply({ content: error.message });
    }
    return interaction.reply({ content: error.message, ephemeral: true });
  }
}
