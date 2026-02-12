const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkNullability() {
    const client = await pool.connect();
    try {
        const tables = ['user', 'session', 'account', 'verification'];
        for (const table of tables) {
            const res = await client.query(`
        SELECT column_name, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
      `, [table]);
            console.log(`--- Table: ${table} ---`);
            console.log(JSON.stringify(res.rows, null, 2));
        }
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkNullability();
