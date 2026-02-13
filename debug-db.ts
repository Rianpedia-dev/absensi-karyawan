import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from './src/db';
import { user, account } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function debugUser(email: string) {
    console.log(`Checking user: ${email}`);

    const userRecord = await db.select().from(user).where(eq(user.email, email)).limit(1);
    if (userRecord.length === 0) {
        console.log('User not found');
        return;
    }

    console.log('User Table Record:');
    console.log({
        id: userRecord[0].id,
        email: userRecord[0].email,
        passwordPresent: !!userRecord[0].password,
        role: userRecord[0].role
    });

    const accounts = await db.select().from(account).where(eq(account.userId, userRecord[0].id));
    console.log('\nAccount Table Records:');
    accounts.forEach((acc, i) => {
        console.log(`Account ${i + 1}:`, {
            id: acc.id,
            providerId: acc.providerId,
            passwordPresent: !!acc.password
        });
    });
}

const targetEmail = process.argv[2] || 'rian@gmail.com';
debugUser(targetEmail).then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
