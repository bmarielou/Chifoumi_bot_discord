export function handleGameResult(interaction: any, result: any): boolean {

    if (!result) return false;

    if (result.error === "MUST_COUP") {
        interaction.reply({
            content: "💥 Vous avez 10 pièces ou plus, vous devez utiliser /coup.",
            ephemeral: true
        });
        return true;
    }

    if (result.error === "ACTION_NOT_CHALLENGEABLE") {
        interaction.reply({
            content: "❌ Cette action ne peut pas être contestée.",
            ephemeral: true
        });
        return true;
    }

    if (result.error) {

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