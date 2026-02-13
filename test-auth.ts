const { auth } = require('./src/lib/auth');
const { headers } = require('next/headers');

async function testSignup() {
    console.log("Starting test signup...");
    try {
        const result = await auth.api.signUpEmail({
            body: {
                email: `test-${Date.now()}@example.com`,
                password: "Password123!",
                name: "Test User",
            }
        });
        console.log("Signup success:", result.user.email);
    } catch (error) {
        console.error("Signup failed!");
        console.error(JSON.stringify(error, null, 2));
    }
}

// Since this uses Next.js headers() and other things, it might not run easily with node alone
// But let's try a simpler version that doesn't need headers() if possible
// Better Auth internal API usually doesn't need headers for signUpEmail unless specific plugins are used
