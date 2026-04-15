export function handleGameResult(interaction: any, result: any): boolean {

    if (!result) return false;

    if (result.error === "NOT_YOUR_TURN") {
        interaction.reply({
            content: "Ce n'est pas votre tour.",
            ephemeral: true
        });
        return true;
    }

    if (result.error === "GAME_NOT_STARTED") {
        interaction.reply({
            content: "La partie n'a pas commencé.",
            ephemeral: true
        });
        return true;
    }

    if (result.error === "NO_GAME") {
        interaction.reply({
            content: "Aucune partie en cours.",
            ephemeral: true
        });
        return true;
    }

    return false;
}