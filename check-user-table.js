const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function findTables() {
    const client = await pool.connect();
    try {
        const res = await client.query(`
      SELECT column_name, data_type, udt_name, (SELECT oid FROM pg_type WHERE typname = udt_name) as type_oid
      FROM information_schema.columns
      WHERE table_name = 'user'
    `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        await pool.end();
    }
}

findTables();
