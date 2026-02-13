import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { types } from 'pg';
import { admin } from 'better-auth/plugins';

// Force node-postgres to return timestamps as Date objects
const parseDate = (val: string | null) => {
  if (val === null) return null;
  return new Date(val.includes(' ') && !val.includes('T') ? val.replace(' ', 'T') + 'Z' : val);
};
types.setTypeParser(1184, parseDate);
types.setTypeParser(1114, parseDate);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  plugins: [
    admin() // Biarkan default dulu untuk melihat apakah ini menyelesaikan masalah tipe di user.ts
  ],
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'employee',
        input: false,
      },
      department: {
        type: 'string',
        required: false,
      },
    },
  },
  secret: process.env.AUTH_SECRET || 'fallback-secret-for-development',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  logger: {
    level: "debug",
  },
});