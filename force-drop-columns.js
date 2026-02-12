const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function forceDropColumns() {
    const client = await pool.connect();
    try {
        console.log("Dropping problematic columns from 'user' table...");
        await client.query('ALTER TABLE "user" DROP COLUMN IF EXISTS email_verified');
        await client.query('ALTER TABLE "user" DROP COLUMN IF EXISTS password');

        // Also drop them from other tables if they exist with wrong types
        await client.query('ALTER TABLE "session" DROP COLUMN IF EXISTS expires_at');
        await client.query('ALTER TABLE "account" DROP COLUMN IF EXISTS expires_at');
        await client.query('ALTER TABLE "verification" DROP COLUMN IF EXISTS expires_at');

        console.log("Columns dropped successfully.");
    } catch (err) {
        console.error("Error dropping columns:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

forceDropColumns();
