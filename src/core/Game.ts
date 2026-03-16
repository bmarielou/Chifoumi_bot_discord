import { GameState } from "./GameState";
import { Player } from "./Player";
import { Deck } from "./Deck";
import { ActionType } from "./ActionType";
import { CardType } from "./Cards";

export class Game {

    channelId: string;
    players: Player[] = [];
    state: GameState;
    deck!: Deck;
    currentPlayerIndex: number = 0;
    lastAction: ActionType | null = null;
    lastPlayerId: string | null = null;

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
        // take a coin
        currentPlayer.coins += 1;

        this.nextTurn();

        return currentPlayer;
    }

    tax(playerId: string) {

    if (this.state !== GameState.STARTED) {
        throw new Error("La partie n'a pas commencé.");
    }

    const currentPlayer = this.getCurrentPlayer();

    if (currentPlayer.id !== playerId) {
        throw new Error("Ce n'est pas ton tour.");
    }

    currentPlayer.coins += 3;

    this.lastAction = ActionType.TAX;
    this.lastPlayerId = playerId;

    this.nextTurn();

    return currentPlayer;

    }

    challenge(challengerId: string) {

        if (!this.lastAction || !this.lastPlayerId) {
            throw new Error("Aucune action à contester.");
        }

        const challengedPlayer = this.players.find(p => p.id === this.lastPlayerId);
        const challenger = this.players.find(p => p.id === challengerId); // <-- important

        if (!challengedPlayer || !challenger) {
            throw new Error("Joueur introuvable.");
        }

        // Challenge sur Duke (TAX)
        if (this.lastAction === ActionType.TAX) {
            const hasDuke = challengedPlayer.cards.includes(CardType.DUKE);

            if (hasDuke) {
                const lostCard = challenger.loseInfluence();
                return {
                    result: "challenge_failed",
                    lostCard,
                    message: `${challenger.id} a perdu une influence ! (Duke confirmé)`
                };
            } else {
                const lostCard = challengedPlayer.loseInfluence();
                return {
                    result: "challenge_success",
                    lostCard,
                    message: `${challengedPlayer.id} bluffait et a perdu une influence !`
                };
            }
        }

        // Challenge sur Assassin (ASSASSINATE)
        if (this.lastAction === ActionType.ASSASSINATE) {
            const hasAssassin = challengedPlayer.cards.includes(CardType.ASSASSIN);

            if (hasAssassin) {
                const lostCard = challenger.loseInfluence();
                return {
                    result: "challenge_failed",
                    lostCard,
                    message: `${challenger.id} a perdu une influence ! (Assassin confirmé)`
                };
            } else {
                const lostCard = challengedPlayer.loseInfluence();
                return {
                    result: "challenge_success",
                    lostCard,
                    message: `${challengedPlayer.id} bluffait et a perdu une influence !`
                };
            }
        }

        // Challenge sur Contessa (BLOCK_ASSASSINATION)
        if (this.lastAction === ActionType.BLOCK_ASSASSINATION) {
            const hasContessa = challengedPlayer.cards.includes(CardType.CONTESSA);

            if (hasContessa) {
                const lostCard = challenger.loseInfluence();
                return {
                    result: "challenge_failed",
                    lostCard,
                    message: `${challenger.id} a perdu une influence ! (Contessa confirmée)`
                };
            } else {
                const lostCard = challengedPlayer.loseInfluence();
                return {
                    result: "challenge_success",
                    lostCard,
                    message: `${challengedPlayer.id} bluffait et a perdu une influence !`
                };
            }
        }

        // Si l’action n’est pas contestable
        throw new Error("Action non contestable.");
    }

    assassinate(playerId: string, targetId: string) {

        if (this.state !== GameState.STARTED) {
            throw new Error("La partie n'a pas commencé.");
        }

        const currentPlayer = this.getCurrentPlayer();

        if (currentPlayer.id !== playerId) {
            throw new Error("Ce n'est pas ton tour.");
        }

        if (currentPlayer.coins < 3) {
            throw new Error("Il faut 3 pièces pour assassiner.");
        }

        const target = this.players.find(p => p.id === targetId);

        if (!target) {
            throw new Error("Cible introuvable.");
        }

        currentPlayer.coins -= 3;

        const lostCard = target.loseInfluence();

        this.lastAction = ActionType.ASSASSINATE;
        this.lastPlayerId = playerId;

        this.nextTurn();

        return {
            attacker: currentPlayer,
            target: target,
            lostCard: lostCard
        };
    }

    blockAssassination(playerId: string) {

        if (this.lastAction !== ActionType.ASSASSINATE) {
            throw new Error("Il n'y a pas d'assassinat à bloquer.");
        }

        const target = this.players.find(p => p.id === playerId);

        if (!target) {
            throw new Error("Joueur introuvable.");
        }

        this.lastAction = ActionType.BLOCK_ASSASSINATION;
        this.lastPlayerId = playerId;

        return target;
    }


}