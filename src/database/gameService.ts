import { db } from './db';

export async function endGame(gameId: number) {
    await db.query(`
        UPDATE game
        SET status = 'finished',
            finished_at = NOW()
        WHERE id_game = ?
    `, [gameId]);
}