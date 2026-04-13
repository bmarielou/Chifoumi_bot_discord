import { Precondition, container } from "@sapphire/framework";
import { ChatInputCommandInteraction } from "discord.js";

export class CheckGameActivePrecondition extends Precondition {
    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        const gameManager = container.GameManager;
        const game = gameManager.getGame(interaction.channelId);

        if (!game) {
            return this.error({
                message: "Aucune partie en cours dans ce salon."
            });
        }

        return this.ok();
    }
}