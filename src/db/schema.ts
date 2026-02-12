import { pgTable, serial, text, timestamp, boolean, doublePrecision, integer, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum untuk role pengguna
export const roles = ['admin', 'employee'] as const;
export type Role = typeof roles[number];

// Enum untuk status kehadiran
export const attendanceStatuses = ['present', 'late', 'absent'] as const;
export type AttendanceStatus = typeof attendanceStatuses[number];

// Enum untuk jenis cuti
export const leaveTypes = ['sick', 'vacation', 'other'] as const;
export type LeaveType = typeof leaveTypes[number];

// Enum untuk status cuti
export const leaveStatuses = ['pending', 'approved', 'rejected'] as const;
export type LeaveStatus = typeof leaveStatuses[number];

// Tabel user (Satu per satu untuk BetterAuth)
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false), // Better Auth uses boolean in Drizzle Postgres many times
  image: text('image'),
  password: text('password'), // Better Auth stores password in 'account' table, so this can be null here
  role: text('role').$type<Role>().default('employee'),
  department: text('department'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// Tabel session (Diperlukan oleh BetterAuth) 
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// Tabel account (Untuk OAuth, diperlukan oleh BetterAuth)
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  expiresAt: timestamp('expires_at', { mode: 'date' }),
  password: text('password'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// Tabel verification (Untuk email verification, diperlukan oleh BetterAuth)
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// Tabel settings (Untuk konfigurasi global seperti lokasi kantor)
export const settings = pgTable('settings', {
  key: text('key').primaryKey(), // e.g., 'office_config'
  value: text('value').notNull(), // JSON string
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

// Relasi untuk user
export const userRelations = relations(user, ({ many }) => ({
  attendances: many(attendances),
  leaves: many(leaves),
  sessions: many(session),
  accounts: many(account),
}));

// Tabel attendance
export const attendances = pgTable('attendance', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  date: timestamp('date', { mode: 'date' }).defaultNow(),
  checkInTime: timestamp('check_in_time', { mode: 'date' }),
  checkOutTime: timestamp('check_out_time', { mode: 'date' }),
  status: text('status').$type<AttendanceStatus>(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  notes: text('notes'),
});

// Relasi untuk attendance
export const attendancesRelations = relations(attendances, ({ one }) => ({
  user: one(user, {
    fields: [attendances.userId],
    references: [user.id],
  }),
}));

// Tabel leaves (cuti)
export const leaves = pgTable('leaves', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  type: text('type').$type<LeaveType>().notNull(),
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }).notNull(),
  status: text('status').$type<LeaveStatus>().default('pending').notNull(),
  reason: text('reason').notNull(),
});

// Relasi untuk leaves
export const leavesRelations = relations(leaves, ({ one }) => ({
  user: one(user, {
    fields: [leaves.userId],
    references: [user.id],
  }),
}));