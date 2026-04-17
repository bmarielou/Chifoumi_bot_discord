import { db } from './db';

export async function getOrCreateUser(id: string, username: string) {
    const [rows]: any = await db.query(
        'SELECT * FROM user WHERE id_user = ?',
        [id]
    );

    if (rows.length > 0) return rows[0];

    await db.query(
        'INSERT INTO user (id_user, username) VALUES (?, ?)',
        [id, username]
    );

    return {
        id_user: id,
        username,
        created_at: new Date()
    };
}