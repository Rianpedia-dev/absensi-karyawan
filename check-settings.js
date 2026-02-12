const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkSettings() {
    const client = await pool.connect();
    try {
        const res = await client.query("SELECT * FROM settings WHERE key = 'office_config'");
        if (res.rows.length === 0) {
            console.log('No settings found in DB. Systems will use DEFAULT_CONFIG (Jakarta).');
        } else {
            console.log('Office Config in DB:', JSON.parse(res.rows[0].value));
        }
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkSettings();
