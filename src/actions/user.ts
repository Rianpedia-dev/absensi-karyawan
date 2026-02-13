'use server';

import { db } from '@/db';
import { user, attendances, leaves } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function getUsers() {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized or insufficient permissions");
    }

    // Ambil semua pengguna kecuali password
    const userRecords = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
      })
      .from(user);

    return userRecords;
  } catch (error) {
    console.error('Error in getUsers:', error);
    throw new Error("Terjadi kesalahan saat mengambil data pengguna");
  }
}

export async function getUserById(userId: string) {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.id !== userId && session.user.role !== 'admin')) {
      throw new Error("Unauthorized or insufficient permissions");
    }

    // Ambil pengguna berdasarkan ID
    const userRecord = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userRecord.length === 0) {
      throw new Error("Pengguna tidak ditemukan");
    }

    return userRecord[0];
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw new Error("Terjadi kesalahan saat mengambil data pengguna");
  }
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  department: string;
}) {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized or insufficient permissions");
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, userData.email));

    if (existingUser.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    // Buat pengguna baru menggunakan Better Auth API (Admin Plugin)
    // Ini memastikan hashing password konsisten (scrypt) dan tabel account terisi otomatis
    const authApi = auth as any;
    const newUser = await authApi.api.admin.createUser({
      headers: await headers(),
      body: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role as any, // Cast as any because of custom role mapping in admin plugin
        department: userData.department,
      },
    });

    return newUser as any;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw new Error("Terjadi kesalahan saat membuat pengguna baru");
  }
}

export async function updateUser(
  userId: string,
  userData: Partial<{
    name: string;
    email: string;
    role: 'admin' | 'employee';
    department: string;
  }>
) {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized or insufficient permissions");
    }

    // Update pengguna
    const updatedUser = await db
      .update(user)
      .set(userData)
      .where(eq(user.id, userId))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt,
      });

    if (updatedUser.length === 0) {
      throw new Error("Pengguna tidak ditemukan");
    }

    return updatedUser[0];
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw new Error("Terjadi kesalahan saat memperbarui pengguna");
  }
}

export async function deleteUser(userId: string) {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized or insufficient permissions");
    }

    // Hapus pengguna
    await db
      .delete(user)
      .where(eq(user.id, userId));

    return { success: true, message: "Pengguna berhasil dihapus" };
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw new Error("Terjadi kesalahan saat menghapus pengguna");
  }
}

export async function getUserAttendance(userId: string) {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.id !== userId && session.user.role !== 'admin')) {
      throw new Error("Unauthorized or insufficient permissions");
    }

    // Ambil data absensi pengguna
    const attendanceRecords = await db
      .select()
      .from(attendances)
      .where(eq(attendances.userId, userId))
      .orderBy(attendances.date);

    return attendanceRecords;
  } catch (error) {
    console.error('Error in getUserAttendance:', error);
    throw new Error("Terjadi kesalahan saat mengambil data absensi pengguna");
  }
}