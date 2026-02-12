import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const adminEmail = "admin@eabsensi.com";
        const adminPassword = "Admin123!";
        const adminName = "Administrator";
        const adminDepartment = "IT";

        console.log("--- Starting Admin Setup ---");

        // 1. Delete existing user and related data more thoroughly
        const existingUser = await db.query.user.findFirst({
            where: eq(user.email, adminEmail),
        });

        if (existingUser) {
            console.log("Cleaning up existing admin user:", existingUser.id);
            // Delete in order to satisfy FK constraints
            await db.delete(session).where(eq(session.userId, existingUser.id));
            await db.delete(account).where(eq(account.userId, existingUser.id));
            await db.delete(user).where(eq(user.id, existingUser.id));
            console.log("Cleanup complete.");
        }

        // 2. Create user via Better Auth API
        console.log("Attempting to create admin via Better Auth API...");

        // We use auth.api.signUpEmail which handles everything including hashing
        // Note: We bypass the client-side validation here
        const res = await auth.api.signUpEmail({
            body: {
                email: adminEmail,
                password: adminPassword,
                name: adminName,
                department: adminDepartment,
            },
        });

        if (!res) {
            console.error("signUpEmail returned null/undefined");
            return NextResponse.json({ error: "Failed to create user via Better Auth (null response)" }, { status: 500 });
        }

        console.log("Admin user created successfully, updating role to admin...");

        // 3. Update role to admin manually via Drizzle
        // Because role has input: false in auth.ts, Better Auth won't let us set it in signUpEmail
        await db.update(user)
            .set({ role: "admin" })
            .where(eq(user.email, adminEmail));

        console.log("Role updated. Setup finished.");

        return NextResponse.json({
            message: "Admin account setup successful",
            user: {
                email: adminEmail,
                name: adminName,
                role: "admin"
            }
        });

    } catch (error: any) {
        console.error("Setup Admin Error Detail:", error);
        return NextResponse.json({
            error: error.message || "Internal Server Error",
            detail: error.toString(),
            stack: error.stack
        }, { status: 500 });
    }
}
