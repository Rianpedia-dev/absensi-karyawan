'use server';

import { db } from '@/db';
import { user, attendances, leaves, account } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function getUsers() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized or insufficient permissions");
    }

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.id !== userId && session.user.role !== 'admin')) {
      throw new Error("Unauthorized or insufficient permissions");
    }

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized: Hanya admin yang dapat membuat pengguna.");
    }

    // Cek Duplikasi
    const existing = await db.select().from(user).where(eq(user.email, userData.email)).limit(1);
    if (existing.length > 0) {
      throw new Error("Email sudah terdaftar.");
    }

    const authApi = auth as any;
    const adminApi = authApi.api?.admin || (authApi.api?.adminUpdateUser ? authApi.api : null) || authApi.admin;

    if (!adminApi) {
      throw new Error("Admin API tidak terkonfigurasi.");
    }

    try {
      console.log('DEBUG: Attempting to create user via Admin API...');
      const result = await adminApi.createUser({
        headers: await headers(),
        body: {
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role,
        },
      });

      if (result?.user?.id && userData.department) {
        await db.update(user)
          .set({ department: userData.department })
          .where(eq(user.id, result.user.id));
      }

      return result;
    } catch (adminError: any) {
      const msg = (adminError.message || adminError.error?.message || '').toLowerCase();

      // Jika error adalah soal otorisasi (khusus Vercel)
      if (msg.includes('not allowed') || msg.includes('unauthorized') || adminError.status === 403) {
        console.warn('DEBUG: Admin API unauthorized, using fallback signUpEmail...');
        const fbResult = await auth.api.signUpEmail({
          body: {
            email: userData.email,
            password: userData.password,
            name: userData.name,
          }
        });

        if (fbResult?.user) {
          await db.update(user)
            .set({
              role: userData.role,
              department: userData.department
            })
            .where(eq(user.id, fbResult.user.id));
          return fbResult;
        }
      }

      console.error('DEBUG: Better Auth Error Details:', adminError);
      throw adminError;
    }
  } catch (error: any) {
    console.error('Error in createUser server action:', error);
    const finalMsg = error.message || (error.error?.message) || "Gagal membuat pengguna.";
    throw new Error(finalMsg);
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized or insufficient permissions");
    }

    const updateData: any = {};
    if (userData.name) updateData.name = userData.name;
    if (userData.email) updateData.email = userData.email;
    if (userData.role) updateData.role = userData.role;
    if (userData.department !== undefined) updateData.department = userData.department;

    const result = await db.update(user)
      .set(updateData)
      .where(eq(user.id, userId))
      .returning();

    if (result.length === 0) {
      throw new Error("Pengguna tidak ditemukan");
    }

    return result[0];
  } catch (error: any) {
    console.error('Error in updateUser:', error);
    throw new Error(error.message || "Terjadi kesalahan saat memperbarui pengguna");
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized or insufficient permissions");
    }

    const result = await db.delete(user)
      .where(eq(user.id, userId))
      .returning();

    if (result.length === 0) {
      throw new Error("Pengguna tidak ditemukan");
    }

    return { success: true, message: "Pengguna berhasil dihapus" };
  } catch (error: any) {
    console.error('Error in deleteUser:', error);
    throw new Error(error.message || "Terjadi kesalahan saat menghapus pengguna");
  }
}

export async function getUserAttendance(userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.id !== userId && session.user.role !== 'admin')) {
      throw new Error("Unauthorized or insufficient permissions");
    }

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

export async function resetUserPassword(userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized: Hanya admin yang dapat mereset password.");
    }

    // Default password as requested
    const newPassword = 'User!2332!';

    // Use Better Auth's own hashPassword to ensure compatibility
    const { hashPassword } = await import('better-auth/crypto');
    const hashedPassword = await hashPassword(newPassword);

    // Update the account table directly
    const updateResult = await db.update(account)
      .set({ password: hashedPassword })
      .where(eq(account.userId, userId))
      .returning();

    if (updateResult.length === 0) {
      throw new Error("Gagal mereset password: Akun pengguna tidak ditemukan.");
    }

    return { success: true, message: `Password berhasil direset menjadi: ${newPassword}` };

  } catch (error: any) {
    console.error('Error in resetUserPassword:', error);
    throw new Error(error.message || "Terjadi kesalahan saat mereset password");
  }
}