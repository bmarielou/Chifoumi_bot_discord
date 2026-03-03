export class Game {

    channelId: string;
    players: string[] = [];

    constructor(channelId: string) {
        this.channelId = channelId;
    }

    addPlayer(playerId: string) {
        if (this.players.includes(playerId)) {
            throw new Error("Vous etes déjà dans cette partie.");
        }

        if (this.players.length >= 6) {
            throw new Error("La partie est pleine.");
        }

        this.players.push(playerId);
    }
}