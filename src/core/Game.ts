import { GameState } from "./GameState";
import { Player } from "./Player";
import { Deck } from "./Deck";
import { ActionType } from "./ActionType";
import { CardType } from "./Cards";
import { eliminatePlayer, addCoin } from "../database/participationService";
import { gameManager } from "./gameManagerInstance";

type GameResult<T = any> =
    | { ok: true; data: T }
    | { error: string };

export class Game {
    channelId: string;
    creatorId: string;
    players: Player[] = [];
    state: GameState;
    deck!: Deck;

    currentPlayerIndex: number = 0;

    lastAction: ActionType | null = null;
    lastPlayerId: string | null = null;
    lastTargetId: string | null = null;

    gameId!: number;

    constructor(channelId: string, creatorId: string) {
        this.channelId = channelId;
        this.creatorId = creatorId;
        this.state = GameState.WAITING;
    }

    addPlayer(playerId: string): GameResult {
        if (this.state !== GameState.WAITING) {
            return { error: "GAME_ALREADY_STARTED" };
        }

        if (this.players.find(p => p.id === playerId)) {
            return { error: "ALREADY_IN_GAME" };
        }

        if (this.players.length >= 6) {
            return { error: "GAME_FULL" };
        }

        this.players.push(new Player(playerId));

        return { ok: true, data: true };
    }

    startGame(): GameResult {
        if (this.players.length < 2) {
            return { error: "NOT_ENOUGH_PLAYERS" };
        }

        this.state = GameState.STARTED;
        this.deck = new Deck();

        for (const player of this.players) {
            player.cards = [];
            player.coins = 2;

            player.addCard(this.deck.draw()!);
            player.addCard(this.deck.draw()!);
        }


        return { ok: true, data: true };
    }

    getCurrentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    nextTurn() {
        const alivePlayers = this.players.filter(p => p.isAlive());

        if (alivePlayers.length <= 1) return;

        let nextIndex = this.currentPlayerIndex;

        do {
            nextIndex = (nextIndex + 1) % this.players.length;
        } while (!this.players[nextIndex].isAlive());

        this.currentPlayerIndex = nextIndex;
    }

    async checkGameEnd(): Promise<Player | null> {
        const alivePlayers = this.players.filter(p => p.isAlive());

        if (alivePlayers.length === 1) {
            const winner = alivePlayers[0];

            this.state = GameState.FINISHED;

            console.log(`Game finished in ${this.channelId}, winner: ${winner.id}`);

            gameManager.deleteGame(this.channelId);

            return winner;
        }

        return null;
    }

    async income(playerId: string): Promise<GameResult<Player>> {
        if (this.state !== GameState.STARTED) {
            return { error: "GAME_NOT_STARTED" };
        }

        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.id !== playerId) {
            return { error: "NOT_YOUR_TURN" };
        }

        currentPlayer.coins += 1;

        await addCoin(playerId, this.gameId, 1);

        this.nextTurn();

        return { ok: true, data: currentPlayer };
    }

    async tax(playerId: string): Promise<GameResult<Player>> {
        if (this.state !== GameState.STARTED) {
            return { error: "GAME_NOT_STARTED" };
        }

        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.id !== playerId) {
            return { error: "NOT_YOUR_TURN" };
        }

        currentPlayer.coins += 3;

        await addCoin(playerId, this.gameId, 3);

        this.lastAction = ActionType.TAX;
        this.lastPlayerId = playerId;

        this.nextTurn();

        return { ok: true, data: currentPlayer };
    }

    async steal(playerId: string, targetId: string): Promise<GameResult<number>> {

        if (this.state !== GameState.STARTED) {
            return { error: "GAME_NOT_STARTED" };
        }

        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.id !== playerId) {
            return { error: "NOT_YOUR_TURN" };
        }

        const player = this.players.find(p => p.id === playerId);
        const target = this.players.find(p => p.id === targetId);

        if (!player || !target) {
            return { error: "PLAYER_NOT_FOUND" };
        }

        if (target.coins <= 0) {
            return { error: "NO_COINS_TO_STEAL" };
        }

        const stolen = target.coins < 2 ? target.coins : 2;

        target.coins -= stolen;
        player.coins += stolen;

        if (stolen > 0) {
            await addCoin(playerId, this.gameId, stolen);
            await addCoin(targetId, this.gameId, -stolen);
        }

        this.lastAction = ActionType.STEAL;
        this.lastPlayerId = playerId;
        this.lastTargetId = targetId;

        this.nextTurn();

        return { ok: true, data: stolen };
    }

    async assassinate(playerId: string, targetId: string): Promise<GameResult> {
        if (this.state !== GameState.STARTED) {
            return { error: "GAME_NOT_STARTED" };
        }

        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.id !== playerId) {
            return { error: "NOT_YOUR_TURN" };
        }

        if (currentPlayer.coins < 3) {
            return { error: "NOT_ENOUGH_COINS" };
        }

        const target = this.players.find(p => p.id === targetId);

        if (!target) {
            return { error: "TARGET_NOT_FOUND" };
        }

        currentPlayer.coins -= 3;

        const lostCard = target.loseInfluence();

        if (!target.isAlive()) {
            await eliminatePlayer(target.id, this.gameId);
        }

        this.lastAction = ActionType.ASSASSINATE;
        this.lastPlayerId = playerId;
        this.lastTargetId = targetId;

        this.nextTurn();

        return {
            ok: true,
            data: { target, lostCard }
        };
    }

    blockAssassination(playerId: string): GameResult<Player> {
        if (this.lastAction !== ActionType.ASSASSINATE) {
            return { error: "NO_ASSASSINATION_TO_BLOCK" };
        }

        const player = this.players.find(p => p.id === playerId);

        if (!player) {
            return { error: "PLAYER_NOT_FOUND" };
        }

        this.lastAction = ActionType.BLOCK_ASSASSINATION;
        this.lastPlayerId = playerId;

        return { ok: true, data: player };
    }

    blockSteal(playerId: string): GameResult<Player> {
        const player = this.players.find(p => p.id === playerId);

        if (!player) {
            return { error: "PLAYER_NOT_FOUND" };
        }

        if (this.lastAction !== ActionType.STEAL) {
            return { error: "NO_STEAL_TO_BLOCK" };
        }

        this.lastAction = ActionType.BLOCK_STEAL;
        this.lastPlayerId = playerId;

        return { ok: true, data: player };
    }

    exchange(playerId: string): GameResult<CardType[]> {
        const player = this.players.find(p => p.id === playerId);

        if (!player) {
            return { error: "PLAYER_NOT_FOUND" };
        }

        const oldCards = [...player.cards];
        const newCards: CardType[] = [];

        oldCards.forEach(card => this.deck.returnCard(card));

        for (let i = 0; i < oldCards.length; i++) {
            const drawn = this.deck.draw();
            if (drawn) newCards.push(drawn);
        }

        player.cards = newCards;

        this.lastAction = ActionType.EXCHANGE;
        this.lastPlayerId = playerId;

        this.nextTurn();

        return { ok: true, data: newCards };
    }
}