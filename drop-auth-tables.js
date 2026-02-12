const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function dropAllAuthTables() {
    const client = await pool.connect();
    try {
        console.log("Dropping all Better Auth tables to ensure clean state...");
        // Drop tables with CASCADE to handle references
        await client.query('DROP TABLE IF EXISTS "verification" CASCADE');
        await client.query('DROP TABLE IF EXISTS "account" CASCADE');
        await client.query('DROP TABLE IF EXISTS "session" CASCADE');
        await client.query('DROP TABLE IF EXISTS "user" CASCADE');

        console.log("Tables dropped successfully.");
    } catch (err) {
        console.error("Error dropping tables:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

dropAllAuthTables();
