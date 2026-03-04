import { GameState } from "./GameState";

export class Game {

    channelId: string;
    players: string[] = [];
    state: GameState;

    constructor(channelId: string) {
        this.channelId = channelId;
        this.state = GameState.WAITING;
    }

    addPlayer(playerId: string) {

        if (this.state !== GameState.WAITING) {
            throw new Error("Partie déjà lancé.")
        }

        if (this.players.includes(playerId)) {
            throw new Error("Vous etes déjà dans cette partie.");
        }

        if (this.players.length >= 6) {
            throw new Error("La partie est pleine.");
        }

        this.players.push(playerId);
    }

    startGame() {
        if (this.players.length < 2) {
            throw new Error("Il faut au moins 2 joueurs pour commencer.");
        }

        this.state = GameState.STARTED;
    }
}