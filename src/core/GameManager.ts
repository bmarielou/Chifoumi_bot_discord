import { Game } from "./Game";

export class GameManager {

    games: Map<string, Game> = new Map();

    createGame(channelId: string, creatorId: string): Game {

        const existingGame = this.games.get(channelId);

        if (existingGame) {
            // version safe (pas de crash bot)
            throw new Error("Une partie est déjà en cours dans ce salon.");
        }

        const game = new Game(channelId, creatorId);

        // creator auto join
        game.addPlayer(creatorId);

        this.games.set(channelId, game);

        return game;
    }

    getGame(channelId: string): Game | undefined {
        return this.games.get(channelId);
    }

    deleteGame(channelId: string): void {
        this.games.delete(channelId);
    }

    hasGame(channelId: string): boolean {
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

    getAllGames(): Game[] {
        return Array.from(this.games.values());
    }
}