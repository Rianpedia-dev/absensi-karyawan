const { db } = require('./src/db');
const { user } = require('./src/db/schema');
const crypto = require('crypto');

async function testDate() {
    try {
        console.log("Testing Drizzle Date Insert...");
        const id = crypto.randomUUID();
        const now = new Date();

        await db.insert(user).values({
            id,
            name: "Test Date User",
            email: `test_date_${Date.now()}@test.com`,
            password: "password",
            createdAt: now,
            updatedAt: now,
        });

        console.log("✅ Insert successful");

        const result = await db.query.user.findFirst({
            where: (u, { eq }) => eq(u.id, id)
        });

        console.log("Result createdAt type:", typeof result.createdAt);
        console.log("Result createdAt instanceof Date:", result.createdAt instanceof Date);
        console.log("Result createdAt value:", result.createdAt);

        if (result.createdAt instanceof Date) {
            console.log("Result toISOString:", result.createdAt.toISOString());
        }

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        process.exit();
    }
}

testDate();
