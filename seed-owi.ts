import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { auth } from '@/lib/auth';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

async function seedOwi() {
    console.log("Memulai seeding untuk owi@gmail.com...");
    const email = "owi@gmail.com";
    const password = "owi12345";
    const name = "Owi";

    try {
        let userId = "";

        const existingUser = await db.query.user.findFirst({
            where: eq(schema.user.email, email)
        });

        if (existingUser) {
            console.log(`User ${email} sudah ada. ID: ${existingUser.id}`);
            userId = existingUser.id;
        } else {
            console.log(`Membuat user baru: ${email}`);
            
            // Menggunakan API better-auth untuk membuat user
            const result = await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name,
                }
            });

            if (!result || !result.user) {
                console.error("Gagal membuat user via API better-auth.");
                return;
            }
            userId = result.user.id;
            console.log(`User berhasil dibuat! ID: ${userId}`);
        }

        // Menambahkan Riwayat Absensi
        console.log("Menambahkan data Riwayat Absensi...");
        const pastDates = Array.from({length: 5}).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (i + 1));
            return d;
        });

        for (const date of pastDates) {
            const checkIn = new Date(date);
            checkIn.setHours(8, 0, 0, 0);
            const checkOut = new Date(date);
            checkOut.setHours(17, 0, 0, 0);

            // Insert absensi menggunakan Drizzle ORM
            await db.insert(schema.attendances).values({
                userId,
                date: date,
                checkInTime: checkIn,
                checkOutTime: checkOut,
                status: 'present',
                latitude: -6.200000,
                longitude: 106.816666,
                notes: 'Hadir tepat waktu'
            });
        }
        console.log("=> Riwayat Absensi berhasil ditambahkan.");

        // Menambahkan Riwayat Cuti
        console.log("Menambahkan data Riwayat Cuti...");
        const leaveStart1 = new Date();
        leaveStart1.setDate(leaveStart1.getDate() - 10);
        const leaveEnd1 = new Date();
        leaveEnd1.setDate(leaveStart1.getDate() + 2);

        await db.insert(schema.leaves).values({
            userId,
            type: 'sick',
            startDate: leaveStart1,
            endDate: leaveEnd1,
            status: 'approved',
            reason: 'Sakit demam'
        });

        const leaveStart2 = new Date();
        leaveStart2.setDate(leaveStart2.getDate() + 5);
        const leaveEnd2 = new Date();
        leaveEnd2.setDate(leaveStart2.getDate() + 3);

        await db.insert(schema.leaves).values({
            userId,
            type: 'vacation',
            startDate: leaveStart2,
            endDate: leaveEnd2,
            status: 'pending',
            reason: 'Acara keluarga di kampung halaman'
        });
        console.log("=> Riwayat Cuti berhasil ditambahkan.");

        console.log("SUCCESS: Semua data untuk Owi berhasil di-seed!");

    } catch (error: any) {
        console.error("FAILED untuk seeding data!");
        console.error(error);
    }
}

seedOwi().then(() => process.exit());
