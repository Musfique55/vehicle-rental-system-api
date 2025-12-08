import { Pool } from "pg";
import { config } from ".";
import cron from "node-cron"

export const pool = new Pool({connectionString : config.connectionStr});

export const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL CHECK (char_length(password) >= 6),
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

    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date TIMESTAMP NOT NULL,
        rent_end_date TIMESTAMP NOT NULL,
        total_price INT NOT NULL,
        status TEXT NOT NULL
        ) 
        `)   
}

cron.schedule('0 * * * *',async () => {
    try {
        await pool.query("BEGIN");
        await pool.query(`
            WITH updated_bookings AS (
            UPDATE  bookings
            SET status = 'returned'
            WHERE rent_end_date < NOW() AND status != 'returned'
            RETURNING vehicle_id
            )
            UPDATE vehicles
            SET availability_status = 'available'
            WHERE id IN (SELECT vehicle_id FROM updated_bookings)
            `);
        await pool.query("COMMIT");    
    } catch (error) {
        await pool.query(`ROLLBACK`);
    }
});