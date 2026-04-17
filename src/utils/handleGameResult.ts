export function handleGameResult(interaction: any, result: any): boolean {

    if (!result) return true;

    if (typeof result === "object" && "error" in result) {

        let message = "⛔ Erreur inconnue.";

        switch (result.error) {
            case "NOT_YOUR_TURN":
                message = "⛔ Ce n'est pas votre tour.";
                break;

            case "GAME_NOT_STARTED":
                message = "⛔ La partie n'a pas commencé.";
                break;

            case "NO_GAME":
                message = "⛔ Aucune partie en cours.";
                break;
        }

        interaction.reply({
            content: message,
            ephemeral: true
        });

        return true;
    }

    return false;
}