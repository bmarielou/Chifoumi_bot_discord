import { GameEngine } from "../engine/GameEngine";

export class GameManager {

    currentGame: GameEngine | null = null;
    games: Map<string, GameEngine> = new Map();
    

    //Create new game in canal
    public createGame(channelId: string, creatorId: string): GameEngine {

        // Check if game already exists
        if (this.games.has(channelId)) {
            throw new Error("Une partie est déjà en cours dans ce salon.");
        }

        const game = new GameEngine(channelId, creatorId);  //ADD creator (rappel)

        // add creator on first player
        game.addPlayer(creatorId);

        this.games.set(channelId, game);

        return game;
    }

    //Recup game already exists
    public getGame(channelId: string): GameEngine | undefined {
        return this.games.get(channelId);
    }

    //delete game 
    public deleteGame(channelId: string): void {
        this.games.delete(channelId);
    }

    //Check if game already exists
    public hasGame(channelId: string): boolean {
        return this.games.has(channelId);
    }
}