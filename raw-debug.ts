import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function rawDebug(email: string) {
    try {
        console.log(`Raw checking user: ${email}`);

        // Check user table
        const userData = await db.execute(sql`SELECT * FROM "user" WHERE email = ${email}`);
        console.log('\n--- User Table (Raw) ---');
        console.log(userData.rows);

        if (userData.rows.length > 0) {
            const userId = userData.rows[0].id;
            // Check account table
            const accountData = await db.execute(sql`SELECT * FROM "account" WHERE user_id = ${userId}`);
            console.log('\n--- Account Table (Raw) ---');
            console.log(accountData.rows);
        }
    } catch (err) {
        console.error('Query error:', err);
    }
}

const targetEmail = process.argv[2] || 'rian@gmail.com';
rawDebug(targetEmail).then(() => process.exit(0));
