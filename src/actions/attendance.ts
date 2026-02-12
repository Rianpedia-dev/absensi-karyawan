'use server';

import { db } from '@/db';
import { attendances, user } from '@/db/schema';
import { eq, and, gte, lte, isNull, desc, count } from 'drizzle-orm';
import { leaves } from '@/db/schema';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { calculateDistance } from '@/lib/geolocation';

import { getOfficeConfig } from './settings';

// Koordinat kantor dan jarak maksimum diambil dari konfigurasi database
// Default values are handled in getOfficeConfig

export async function clockIn(lat: number, lng: number) {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    // Validasi Lokasi (Geofencing)
    const config = await getOfficeConfig();

    const distance = calculateDistance(
      lat,
      lng,
      config.latitude,
      config.longitude
    );

    if (distance > config.radius) {
      return {
        success: false,
        message: `Anda berada di luar jangkauan kantor! Jarak: ${distance.toFixed(0)}m (Max: ${config.radius}m). Lokasi terdeteksi: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      };
    }

    // Cek apakah sudah absen masuk hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await db.select()
      .from(attendances)
      .where(and(
        eq(attendances.userId, session.user.id),
        gte(attendances.date, today),
        lte(attendances.date, tomorrow)
      ));

    if (existingAttendance.length > 0) {
      return { success: false, message: "Anda sudah absen masuk hari ini" };
    }

    // Simpan ke DB
    await db.insert(attendances).values({
      userId: session.user.id,
      date: new Date(),
      checkInTime: new Date(),
      latitude: lat,
      longitude: lng,
      status: 'present' // Default status
    });

    return { success: true, message: "Berhasil Absen Masuk!" };
  } catch (error) {
    console.error('Error in clockIn:', error);
    return { success: false, message: "Terjadi kesalahan saat absen masuk" };
  }
}

export async function clockOut(lat: number, lng: number) {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    // Validasi Lokasi (Geofencing)
    const config = await getOfficeConfig();

    const distance = calculateDistance(
      lat,
      lng,
      config.latitude,
      config.longitude
    );

    if (distance > config.radius) {
      return {
        success: false,
        message: `Anda berada di luar jangkauan kantor! Jarak: ${distance.toFixed(0)}m (Max: ${config.radius}m). Lokasi terdeteksi: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
      };
    }

    // Cek apakah sudah absen masuk hari ini tetapi belum absen pulang
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendanceRecord = await db.select()
      .from(attendances)
      .where(and(
        eq(attendances.userId, session.user.id),
        gte(attendances.date, today),
        lte(attendances.date, tomorrow),
        isNull(attendances.checkOutTime) // Belum absen pulang
      ))
      .orderBy(desc(attendances.id))
      .limit(1);

    if (attendanceRecord.length === 0) {
      return { success: false, message: "Anda belum absen masuk hari ini" };
    }

    // Update record DB (isi checkOutTime)
    await db.update(attendances)
      .set({
        checkOutTime: new Date(),
      })
      .where(eq(attendances.id, attendanceRecord[0].id));

    return { success: true, message: "Berhasil Absen Pulang!" };
  } catch (error) {
    console.error('Error in clockOut:', error);
    return { success: false, message: "Terjadi kesalahan saat absen pulang" };
  }
}

export async function getTodayAttendance() {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized or insufficient permissions");
    }

    // Ambil data absensi hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendanceRecords = await db
      .select({
        id: attendances.id,
        userId: attendances.userId,
        date: attendances.date,
        checkInTime: attendances.checkInTime,
        checkOutTime: attendances.checkOutTime,
        status: attendances.status,
        user: {
          name: user.name,
          email: user.email,
          department: user.department,
        }
      })
      .from(attendances)
      .leftJoin(user, eq(attendances.userId, user.id))
      .where(and(
        gte(attendances.date, today),
        lte(attendances.date, tomorrow)
      ));

    return attendanceRecords;
  } catch (error) {
    console.error('Error in getTodayAttendance:', error);
    throw new Error("Terjadi kesalahan saat mengambil data absensi hari ini");
  }
}

export async function getTodayUserAttendance() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const record = await db.select().from(attendances).where(and(
      eq(attendances.userId, session.user.id),
      gte(attendances.date, today),
      lte(attendances.date, tomorrow)
    )).limit(1);

    return record[0] || null;
  } catch (error) {
    console.error('Error in getTodayUserAttendance:', error);
    throw new Error("Gagal mengambil data absensi hari ini");
  }
}

export async function getUserAttendanceHistory(userId: string, days: number = 5) {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Hanya pengguna itu sendiri atau admin yang bisa mengakses
    if (session.user.id !== userId && session.user.role !== 'admin') {
      throw new Error("Insufficient permissions");
    }

    // Ambil data absensi beberapa hari terakhir
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);

    const attendanceRecords = await db
      .select()
      .from(attendances)
      .where(and(
        eq(attendances.userId, userId),
        gte(attendances.date, pastDate)
      ))
      .orderBy(desc(attendances.date)); // Desc for history

    return attendanceRecords;
  } catch (error) {
    console.error('Error in getUserAttendanceHistory:', error);
    throw new Error("Terjadi kesalahan saat mengambil riwayat absensi");
  }
}

export async function getAdminStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Total Karyawan
    const totalEmployeesCount = await db
      .select({ value: count() })
      .from(user)
      .where(eq(user.role, 'employee'));

    // 2. Hadir Hari Ini (Hanya yang sudah checkIn)
    const presentTodayCount = await db
      .select({ value: count() })
      .from(attendances)
      .where(and(
        gte(attendances.date, today),
        lte(attendances.date, tomorrow)
      ));

    // 3. Cuti Pending
    const pendingLeavesCount = await db
      .select({ value: count() })
      .from(leaves)
      .where(eq(leaves.status, 'pending'));

    return {
      totalEmployees: totalEmployeesCount[0].value,
      todayPresent: presentTodayCount[0].value,
      pendingLeaves: pendingLeavesCount[0].value,
    };
  } catch (error) {
    console.error('Error in getAdminStats:', error);
    throw new Error("Gagal mengambil statistik admin");
  }
}

export async function getFilteredAttendance(
  startDate?: string,
  endDate?: string,
  department?: string
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized");
    }

    const conditions = [];

    if (startDate) {
      conditions.push(gte(attendances.date, new Date(startDate)));
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(attendances.date, end));
    }

    if (department && department !== 'all') {
      conditions.push(eq(user.department, department));
    }

    let query = db
      .select({
        id: attendances.id,
        userId: attendances.userId,
        date: attendances.date,
        checkInTime: attendances.checkInTime,
        checkOutTime: attendances.checkOutTime,
        status: attendances.status,
        user: {
          name: user.name,
          email: user.email,
          department: user.department,
        }
      })
      .from(attendances)
      .leftJoin(user, eq(attendances.userId, user.id));

    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }

    return await query;
  } catch (error) {
    console.error('Error in getFilteredAttendance:', error);
    throw new Error("Gagal mengambil data laporan");
  }
}