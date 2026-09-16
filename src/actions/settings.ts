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
    enabled: true,
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

        const parsed = JSON.parse(config.value);
        const lat = typeof parsed.latitude === 'string'
            ? parseFloat(parsed.latitude.replace(/,/g, '.'))
            : Number(parsed.latitude);
        const lng = typeof parsed.longitude === 'string'
            ? parseFloat(parsed.longitude.replace(/,/g, '.'))
            : Number(parsed.longitude);
        const rad = typeof parsed.radius === 'string'
            ? parseFloat(parsed.radius.replace(/,/g, '.'))
            : Number(parsed.radius);

        return {
            ...DEFAULT_CONFIG,
            ...parsed,
            latitude: isNaN(lat) ? DEFAULT_CONFIG.latitude : lat,
            longitude: isNaN(lng) ? DEFAULT_CONFIG.longitude : lng,
            radius: isNaN(rad) ? DEFAULT_CONFIG.radius : rad,
            enabled: parsed.enabled ?? DEFAULT_CONFIG.enabled,
        };
    } catch (error) {
        console.error('Error in getOfficeConfig:', error);
        return DEFAULT_CONFIG;
    }
}

export async function updateOfficeConfig(lat: number, lng: number, radius: number, enabled: boolean) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== 'admin') {
            throw new Error("Unauthorized");
        }

        const cleanLat = typeof lat === 'string' ? parseFloat(String(lat).replace(/,/g, '.')) : Number(lat);
        const cleanLng = typeof lng === 'string' ? parseFloat(String(lng).replace(/,/g, '.')) : Number(lng);
        const cleanRad = typeof radius === 'string' ? parseFloat(String(radius).replace(/,/g, '.')) : Number(radius);

        if (enabled && (isNaN(cleanLat) || isNaN(cleanLng) || isNaN(cleanRad))) {
            throw new Error("Koordinat atau radius tidak valid.");
        }

        const currentConfig = await getOfficeConfig();
        const finalLat = isNaN(cleanLat) ? currentConfig.latitude : cleanLat;
        const finalLng = isNaN(cleanLng) ? currentConfig.longitude : cleanLng;
        const finalRad = isNaN(cleanRad) ? currentConfig.radius : cleanRad;

        const value = JSON.stringify({
            latitude: finalLat,
            longitude: finalLng,
            radius: finalRad,
            enabled: Boolean(enabled),
        });

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
    } catch (error: any) {
        console.error('Error in updateOfficeConfig:', error);
        throw new Error(error.message || "Gagal memperbarui konfigurasi kantor");
    }
}

export async function toggleGeofencing(enabled: boolean) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== 'admin') {
            throw new Error("Unauthorized");
        }

        const currentConfig = await getOfficeConfig();
        const value = JSON.stringify({
            ...currentConfig,
            enabled: Boolean(enabled),
        });

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

        return { 
            success: true, 
            message: enabled 
                ? "Fitur Geofencing diaktifkan. Pegawai hanya dapat absen dalam radius kantor." 
                : "Fitur Geofencing dinonaktifkan. Pegawai dapat absen dari mana saja." 
        };
    } catch (error: any) {
        console.error('Error in toggleGeofencing:', error);
        throw new Error(error.message || "Gagal mengubah status geofencing");
    }
}

// Konfigurasi Akun Demo Login
export interface DemoConfig {
    enabled: boolean;
    adminEmail: string;
    adminPassword: string;
    employeeEmail: string;
    employeePassword: string;
}

const DEFAULT_DEMO_CONFIG: DemoConfig = {
    enabled: true,
    adminEmail: 'admin@eabsensi.com',
    adminPassword: 'Admin123!',
    employeeEmail: 'owi@gmail.com',
    employeePassword: 'owi12345',
};

const DEMO_CONFIG_KEY = 'login_demo_config';

export async function getDemoConfig(): Promise<DemoConfig> {
    try {
        const config = await db.query.settings.findFirst({
            where: eq(settings.key, DEMO_CONFIG_KEY),
        });

        if (!config) {
            return DEFAULT_DEMO_CONFIG;
        }

        const parsed = JSON.parse(config.value);
        return { ...DEFAULT_DEMO_CONFIG, ...parsed };
    } catch (error) {
        console.error('Error in getDemoConfig:', error);
        return DEFAULT_DEMO_CONFIG;
    }
}

export async function updateDemoConfig(enabled: boolean) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || session.user.role !== 'admin') {
            throw new Error("Unauthorized: Hanya admin yang dapat mengubah pengaturan ini.");
        }

        const current = await getDemoConfig();
        const updated: DemoConfig = {
            ...current,
            enabled,
        };

        const value = JSON.stringify(updated);

        await db.insert(settings)
            .values({
                key: DEMO_CONFIG_KEY,
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

        return {
            success: true,
            message: `Fitur akun demo di halaman login berhasil ${enabled ? 'diaktifkan' : 'dinonaktifkan'}`,
            data: updated,
        };
    } catch (error: any) {
        console.error('Error in updateDemoConfig:', error);
        throw new Error(error.message || "Gagal memperbarui pengaturan demo login");
    }
}
