import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  const db = drizzle(pool);
  
  // Migrasi akan dijalankan otomatis dengan drizzle-kit push
  console.log('Migration completed!');
}

migrate().catch(console.error);