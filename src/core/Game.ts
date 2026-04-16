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

        if (currentPlayer.coins >= 10) {
            return { error: "MUST_COUP" };
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

        if (currentPlayer.coins >= 10) {
            return { error: "MUST_COUP" };
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

        if (currentPlayer.coins >= 10) {
            return { error: "MUST_COUP" };
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

        if (currentPlayer.coins >= 10) {
            return { error: "MUST_COUP" };
        }

        this.lastAction = ActionType.ASSASSINATE;
        this.lastPlayerId = playerId;
        this.lastTargetId = targetId;

        return {
            ok: true,
            data: { targetId }
        };
    }

    async foreignAid(playerId: string): Promise<GameResult<Player>> {

        if (this.state !== GameState.STARTED) {
            return { error: "GAME_NOT_STARTED" };
        }

        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.id !== playerId) {
            return { error: "NOT_YOUR_TURN" };
        }

        if (currentPlayer.coins >= 10) {
            return { error: "MUST_COUP" };
        }

        currentPlayer.coins += 2;

        await addCoin(playerId, this.gameId, 2);

        this.lastAction = ActionType.FOREIGN_AID;
        this.lastPlayerId = playerId;

        this.nextTurn();

        return { ok: true, data: currentPlayer };
    }

    blockForeignAid(playerId: string): GameResult<Player> {

        if (this.lastAction !== ActionType.FOREIGN_AID) {
            return { error: "NO_FOREIGN_AID" };
        }

        const player = this.players.find(p => p.id === playerId);

        if (!player) {
            return { error: "PLAYER_NOT_FOUND" };
        }

        this.lastAction = ActionType.BLOCK_FOREIGN_AID;
        this.lastPlayerId = playerId;

        return { ok: true, data: player };
    }

    blockAssassination(playerId: string): GameResult<Player> {

        if (this.lastAction !== ActionType.ASSASSINATE) {
            return { error: "NO_ASSASSINATION" };
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

        if (this.lastAction !== ActionType.STEAL) {
            return { error: "NO_STEAL" };
        }

        const player = this.players.find(p => p.id === playerId);

        if (!player) {
            return { error: "PLAYER_NOT_FOUND" };
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

    resolveAssassination() {
        const target = this.players.find(p => p.id === this.lastTargetId);

        if (!target) return;

        const lostCard = target.loseInfluence();

        this.nextTurn();

        return lostCard;
    }

    async coup(playerId: string, targetId: string): Promise<GameResult<any>> {

        if (this.state !== GameState.STARTED) {
            return { error: "GAME_NOT_STARTED" };
        }

        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.id !== playerId) {
            return { error: "NOT_YOUR_TURN" };
        }

        if (currentPlayer.coins < 7) {
            return { error: "NOT_ENOUGH_COINS" };
        }

        const target = this.players.find(p => p.id === targetId);

        if (!target) {
            return { error: "TARGET_NOT_FOUND" };
        }

        currentPlayer.coins -= 7;

        const lostCard = target.loseInfluence();

        if (!target.isAlive()) {
            await eliminatePlayer(target.id, this.gameId);
        }

        this.lastAction = ActionType.COUP;
        this.lastPlayerId = playerId;
        this.lastTargetId = targetId;

        this.nextTurn();

        return {
            ok: true,
            data: {
                attacker: currentPlayer,
                target,
                lostCard
            }
        };
    }

    async challenge(challengerId: string): Promise<GameResult<any>> {

        if (this.lastAction === ActionType.COUP) {
            return { error: "ACTION_NOT_CHALLENGEABLE" };
        }

        if (!this.lastAction || !this.lastPlayerId) {
            return { error: "NO_ACTION_TO_CHALLENGE" };
        }

        const challengedPlayer = this.players.find(p => p.id === this.lastPlayerId);
        const challenger = this.players.find(p => p.id === challengerId);

        if (!challengedPlayer || !challenger) {
            return { error: "PLAYER_NOT_FOUND" };
        }

        let success = false;
        let lostCard;

        if (this.lastAction === ActionType.TAX) {
            const hasCard = challengedPlayer.cards.includes(CardType.DUKE);

            if (hasCard) {
                lostCard = challenger.loseInfluence();
            } else {
                lostCard = challengedPlayer.loseInfluence();
                success = true;
            }
        }

        if (this.lastAction === ActionType.ASSASSINATE) {
            const hasCard = challengedPlayer.cards.includes(CardType.ASSASSIN);

            if (hasCard) {
                lostCard = challenger.loseInfluence();
            } else {
                lostCard = challengedPlayer.loseInfluence();
                success = true;
            }
        }

        if (this.lastAction === ActionType.BLOCK_ASSASSINATION) {
            const hasCard = challengedPlayer.cards.includes(CardType.CONTESSA);

            if (hasCard) {
                lostCard = challenger.loseInfluence();
            } else {
                lostCard = challengedPlayer.loseInfluence();
                success = true;
            }
        }

        if (this.lastAction === ActionType.STEAL) {
            const hasCard = challengedPlayer.cards.includes(CardType.CAPTAIN);

            if (hasCard) {
                lostCard = challenger.loseInfluence();
            } else {
                lostCard = challengedPlayer.loseInfluence();
                success = true;
            }
        }

        if (this.lastAction === ActionType.BLOCK_FOREIGN_AID) {
            const hasDuke = challengedPlayer.cards.includes(CardType.DUKE);

            if (hasDuke) {
                lostCard = challenger.loseInfluence();
            } else {
                lostCard = challengedPlayer.loseInfluence();
                success = true;
            }
        }

        if (this.lastAction === ActionType.BLOCK_STEAL) {

            const hasCaptain = challengedPlayer.cards.includes(CardType.CAPTAIN);
            const hasAmbassador = challengedPlayer.cards.includes(CardType.AMBASSADOR);

            if (hasCaptain || hasAmbassador) {
                lostCard = challenger.loseInfluence();
            } else {
                lostCard = challengedPlayer.loseInfluence();
                success = true;
            }
        }

        return {
            ok: true,
            data: {
                success,
                challengedPlayerId: challengedPlayer.id,
                challengerId: challenger.id,
                lostCard
            }
        };
    }
}