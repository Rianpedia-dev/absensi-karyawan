'use server';

import { db } from '@/db';
import { leaves, user } from '@/db/schema';
import { eq, and, gte, lte, inArray } from 'drizzle-orm';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function requestLeave(
  type: 'sick' | 'vacation' | 'other',
  startDate: Date,
  endDate: Date,
  reason: string
) {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    // Validasi tanggal
    if (startDate > endDate) {
      return { success: false, message: "Tanggal mulai harus sebelum tanggal akhir" };
    }

    // Buat permintaan cuti
    const newLeave = await db
      .insert(leaves)
      .values({
        userId: session.user.id,
        type,
        startDate,
        endDate,
        reason,
        status: 'pending' // Default status adalah pending
      })
      .returning();

    return {
      success: true,
      message: "Permintaan cuti berhasil diajukan",
      leave: newLeave[0]
    };
  } catch (error) {
    console.error('Error in requestLeave:', error);
    return { success: false, message: "Terjadi kesalahan saat mengajukan cuti" };
  }
}

export async function getMyLeaves() {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Ambil semua permintaan cuti milik pengguna ini
    const leaveRecords = await db
      .select()
      .from(leaves)
      .where(eq(leaves.userId, session.user.id))
      .orderBy(leaves.startDate);

    return leaveRecords;
  } catch (error) {
    console.error('Error in getMyLeaves:', error);
    throw new Error("Terjadi kesalahan saat mengambil data cuti");
  }
}

export async function getAllLeaves() {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized or insufficient permissions");
    }

    // Ambil semua permintaan cuti dengan informasi pengguna
    const leaveRecords = await db
      .select({
        id: leaves.id,
        userId: leaves.userId,
        type: leaves.type,
        startDate: leaves.startDate,
        endDate: leaves.endDate,
        status: leaves.status,
        reason: leaves.reason,
        user: {
          name: user.name,
          email: user.email,
          department: user.department,
        }
      })
      .from(leaves)
      .leftJoin(user, eq(leaves.userId, user.id))
      .orderBy(leaves.startDate);

    return leaveRecords;
  } catch (error) {
    console.error('Error in getAllLeaves:', error);
    throw new Error("Terjadi kesalahan saat mengambil semua data cuti");
  }
}

export async function updateLeaveStatus(leaveId: number, status: 'approved' | 'rejected') {
  try {
    // Dapatkan session pengguna
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'admin') {
      throw new Error("Unauthorized or insufficient permissions");
    }

    // Update status permintaan cuti
    const updatedLeave = await db
      .update(leaves)
      .set({ status })
      .where(eq(leaves.id, leaveId))
      .returning();

    if (updatedLeave.length === 0) {
      throw new Error("Permintaan cuti tidak ditemukan");
    }

    return {
      success: true,
      message: `Status cuti berhasil diubah menjadi ${status}`,
      leave: updatedLeave[0]
    };
  } catch (error) {
    console.error('Error in updateLeaveStatus:', error);
    throw new Error("Terjadi kesalahan saat memperbarui status cuti");
  }
}