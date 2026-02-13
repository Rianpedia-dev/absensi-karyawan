const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function fixDb() {
    const client = await pool.connect();
    try {
        console.log('Applying database fixes...');

        // 1. Set default for email_verified
        await client.query('ALTER TABLE "user" ALTER COLUMN email_verified SET DEFAULT false');
        console.log('Step 1: Set DEFAULT false for "user".email_verified');

        // 2. Update existing nulls (though NOT NULL usually prevents this, just in case)
        await client.query('UPDATE "user" SET email_verified = false WHERE email_verified IS NULL');
        console.log('Step 2: Updated NULLs in email_verified');

        // 3. Remove redundant password column from user table (it should be in account table)
        // Check if column exists first
        const checkPass = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'user' AND column_name = 'password'
        `);
        if (checkPass.rows.length > 0) {
            await client.query('ALTER TABLE "user" DROP COLUMN password');
            console.log('Step 3: Dropped "password" column from "user" table');
        } else {
            console.log('Step 3: "password" column already gone from "user" table');
        }

        console.log('ALL FIXES APPLIED SUCCESSFULLY!');

    } catch (err) {
        console.error('FAILED TO APPLY FIXES:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

fixDb();
