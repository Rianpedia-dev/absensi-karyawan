const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkUsers() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT id, name, email, role FROM "user"');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkUsers();
