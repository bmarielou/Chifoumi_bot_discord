import { db } from './db';

export async function eliminatePlayer(userId: string, gameId: number) {
    await db.query(`
        UPDATE participation
        SET is_alive = FALSE, eliminated_at = NOW()
        WHERE id_user = ? AND id_game = ?
    `, [userId, gameId]);
}

export async function addCoin(userId: string, gameId: number, amount: number) {
    await db.query(`
        UPDATE participation
        SET coins = coins + ?
        WHERE id_user = ? AND id_game = ?
    `, [amount, userId, gameId]);
}