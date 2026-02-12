const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function dropTables() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log('🔄 Menghubungkan ke database...');

        // Drop in order to satisfy FK constraints
        await pool.query('DROP TABLE IF EXISTS "session" CASCADE');
        await pool.query('DROP TABLE IF EXISTS "account" CASCADE');
        await pool.query('DROP TABLE IF EXISTS "verification" CASCADE');
        await pool.query('DROP TABLE IF EXISTS "user" CASCADE');

        console.log('✅ Tabel user, session, account, dan verification berhasil dihapus.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

dropTables();
