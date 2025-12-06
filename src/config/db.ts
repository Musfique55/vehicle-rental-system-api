import { Pool } from "pg";
import { config } from ".";

export const pool = new Pool({connectionString : config.connectionStr});

export const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL CHECK (char_length(password) >= 5),
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(8) NOT NULL
        )
        `);
    
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name TEXT NOT NULL,
        type VARCHAR(4) NOT NULL,
        registration_number TEXT UNIQUE NOT NULL,
        daily_rent_price INT NOT NULL,
        availability_status TEXT NOT NULL
        )  
        `)
}