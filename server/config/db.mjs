import "dotenv/config"; 

export const AuthDatabase = {
    host : '192.168.0.221',
    // host : '101.101.211.229',
    // host : '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}