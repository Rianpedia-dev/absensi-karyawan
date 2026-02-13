const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkSchema() {
    const client = await pool.connect();
    try {
        console.log('Checking "account" table schema...');
        const res = await client.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'account'
        `);
        if (res.rows.length === 0) {
            console.log('JSON_RESULT: {"table": "account", "status": "NOT FOUND"}');
        } else {
            console.log('JSON_RESULT_ACCOUNT: ' + JSON.stringify(res.rows, null, 2));
        }

        const resUser = await client.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'user'
        `);
        console.log('JSON_RESULT_USER: ' + JSON.stringify(resUser.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

checkSchema();
