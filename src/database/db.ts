import mysql from 'mysql2/promise';

export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'TON_MDP',
    database: 'coup_bot',
    waitForConnections: true,
    connectionLimit: 10
});