const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkDetailedSchema() {
    const client = await pool.connect();
    try {
        const tables = ['user', 'account', 'session', 'account'];
        for (const table of tables) {
            console.log(`\n--- Table: ${table} ---`);
            const res = await client.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = '${table}'
                ORDER BY ordinal_position
            `);
            console.log(JSON.stringify(res.rows, null, 2));
        }
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkDetailedSchema();
