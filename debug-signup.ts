import { auth } from './src/lib/auth';
import { db } from './src/db';
import * as schema from './src/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

async function debugSignup() {
    console.log("Starting debug signup...");
    const email = `debug-${Date.now()}@example.com`;

    try {
        // Clean up existing if any (unlikely with timestamp name)
        await db.delete(schema.user).where(eq(schema.user.email, email));

        console.log(`Attempting to sign up: ${email}`);

        // We use the internal API to avoid HTTP overhead and see better errors
        const result = await auth.api.signUpEmail({
            body: {
                email: email,
                password: "Password123!",
                name: "Debug User",
            }
        });

        console.log("Signup successful!", JSON.stringify(result, null, 2));
    } catch (error: any) {
        console.error("Signup FAILED!");
        console.error("Error Message:", error.message);
        console.error("Error Name:", error.name);
        console.error("Error Stack:", error.stack);

        if (error.cause) {
            console.error("Error Cause:", error.cause);
            if (error.cause.stack) {
                console.error("Error Cause Stack:", error.cause.stack);
            }
        }

        // Inspect the error object properties
        console.log("Error properties:", Object.keys(error));
    }
}

debugSignup().then(() => process.exit());
