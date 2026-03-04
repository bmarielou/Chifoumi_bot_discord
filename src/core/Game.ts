import { GameState } from "./GameState";
import { Player } from "./Player";
import { Deck } from "./Deck";

export class Game {

    channelId: string;
    players: Player[] = [];
    state: GameState;
    deck!: Deck;
    currentPlayerIndex: number = 0;

    constructor(channelId: string) {
        this.channelId = channelId;
        this.state = GameState.WAITING;
    }

    addPlayer(playerId: string) {

        if (this.state !== GameState.WAITING) {
            throw new Error("Partie déjà lancé.")
        }

        if (this.players.find(p => p.id === playerId)) {
            throw new Error("Vous etes déjà dans cette partie.");
        }

        if (this.players.length >= 6) {
            throw new Error("La partie est pleine.");
        }

        this.players.push(new Player(playerId));
    }

    startGame() {
        if (this.players.length < 2) {
            throw new Error("Il faut au moins 2 joueurs pour commencer.");
        }

        this.state = GameState.STARTED;
        this.deck = new Deck();

        //distibute 2 cards for only players
        for (const player of this.players) {
            player.addCard(this.deck.draw()!);
            player.addCard(this.deck.draw()!);
        }
    }

    getCurrentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    nextTurn() {
        this.currentPlayerIndex =
            (this.currentPlayerIndex + 1) % this.players.length;
    }

    income(playerId: string) {

        if (this.state !== GameState.STARTED) {
            throw new Error("La partie n'a pas commencé.");
        }
        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.id !== playerId) {
            throw new Error("Ce n'est pas votre tour.");
        }
        currentPlayer.coins += 1;

        this.nextTurn();

        return currentPlayer;
    }
}