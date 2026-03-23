import { Game } from "./Game";

export class GameManager {

    currentGame: Game | null = null;
    private games: Map<string, Game> = new Map();
    

    //Create new game in canal
    createGame(channelId: string, creatorId: string): Game {

        // Check if game already exists
        if (this.games.has(channelId)) {
            throw new Error("Une partie est déjà en cours dans ce salon.");
        }

        const game = new Game(channelId, creatorId);  //ADD creator (rappel)

        // add creator on first player
        game.addPlayer(creatorId);

        this.games.set(channelId, game);

        return game;
    }

    //Recup game already exists
    getGame(channelId: string): Game | undefined {
        return this.games.get(channelId);
    }

    //delete game 
    deleteGame(channelId: string): void {
        this.games.delete(channelId);
    }

    //Check if game already exists
    hasGame(channelId: string): boolean {
        return this.games.has(channelId);
    }
}