
import { auth } from './src/lib/auth'; // Adjust path if needed
import { db } from './src/db';
import * as schema from './src/db/schema';
import { eq } from 'drizzle-orm';

async function createAdmin() {
    console.log("Starting admin creation...");
    const email = "admin@example.com"; // Fixed email for admin
    const password = "Password123!";
    const name = "Administrator";

    try {
        // 1. Check if user exists and delete to ensure clean slate (optional, but good for retries)
        const existingUser = await db.query.user.findFirst({
            where: eq(schema.user.email, email)
        });

        if (existingUser) {
            console.log(`User ${email} already exists. Updating role to admin...`);
            await db.update(schema.user)
                .set({ role: 'admin' })
                .where(eq(schema.user.email, email));
            console.log("Role updated to admin.");
            return;
        }

        console.log(`Creating new user: ${email}`);

        // 2. Sign up the user using Better Auth API
        // We use the internal API to properly hash password and create session/account
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name,
            }
        });

        if (!result) {
            console.error("Signup failed to return a result.");
            return;
        }

        console.log("User created successfully via Auth API.");

        // 3. Manually update the role to 'admin'
        // Better Auth might not allow setting role directly in signUpEmail based on config
        console.log("Promoting user to admin...");

        await db.update(schema.user)
            .set({ role: 'admin' })
            .where(eq(schema.user.email, email));

        console.log("SUCCESS: User promoted to admin!");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

    } catch (error: any) {
        console.error("FAILED to create admin!");
        console.error(error);
    }
}

createAdmin().then(() => process.exit());
