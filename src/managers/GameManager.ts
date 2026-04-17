import { GameEngine } from "../engine/GameEngine";

export class GameManager {

    currentGame: GameEngine | null = null;
    games: Map<string, GameEngine> = new Map();
    

    //Create new game in canal
    public createGame(channelId: string, creatorId: string): GameEngine {

        const existingGame = this.games.get(channelId);

        if (existingGame) {
            // version safe (pas de crash bot)
            throw new Error("Une partie est déjà en cours dans ce salon.");
        }

        const game = new GameEngine(channelId, creatorId);  //ADD creator (rappel)

        // creator auto join
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

    async endGame(channelId: string): Promise<void> {
        const game = this.games.get(channelId);

        if (!game) return;

        try {
            await game.checkGameEnd();
        } catch (err) {
            console.error("Error ending game:", err);
        }

        this.games.delete(channelId);
    }

    getAllGames(): GameEngine[] {
        return Array.from(this.games.values());
    }
}