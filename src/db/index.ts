import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, types } from 'pg';
import * as schema from './schema';

// Force node-postgres to return timestamps as Date objects
// This is critical because Better Auth expects Date objects from the adapter.
// We add logging to verify this is actually being called in the Next.js environment.

const parseDate = (val: string | null) => {
  if (val === null) return null;
  // Handle both 'YYYY-MM-DD HH:MM:SS' and ISO formats
  const normalized = val.includes(' ') && !val.includes('T') ? val.replace(' ', 'T') + 'Z' : val;
  const date = new Date(normalized);
  return date;
};

// timestamptz (1184)
types.setTypeParser(1184, parseDate);
// timestamp (1114) 
types.setTypeParser(1114, parseDate);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });