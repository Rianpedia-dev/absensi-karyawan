'use server';

import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Default configuration if not set in DB
const DEFAULT_CONFIG = {
    latitude: -6.200000,
    longitude: 106.816666,
    radius: 100, // meters
};

const CONFIG_KEY = 'office_config';

export async function getOfficeConfig() {
    try {
        const config = await db.query.settings.findFirst({
            where: eq(settings.key, CONFIG_KEY),
        });

        if (!config) {
            return DEFAULT_CONFIG;
        }

        return JSON.parse(config.value);
    } catch (error) {
        console.error('Error in getOfficeConfig:', error);
        return DEFAULT_CONFIG;
    }
}

export async function updateOfficeConfig(lat: number, lng: number, radius: number) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== 'admin') {
            throw new Error("Unauthorized");
        }

        const value = JSON.stringify({ latitude: lat, longitude: lng, radius });

        // Upsert logic (PostgreSQL style for Drizzle)
        await db.insert(settings)
            .values({
                key: CONFIG_KEY,
                value: value,
                updatedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: settings.key,
                set: {
                    value: value,
                    updatedAt: new Date(),
                },
            });

        return { success: true, message: "Konfigurasi kantor berhasil diperbarui" };
    } catch (error) {
        console.error('Error in updateOfficeConfig:', error);
        throw new Error("Gagal memperbarui konfigurasi kantor");
    }
}
