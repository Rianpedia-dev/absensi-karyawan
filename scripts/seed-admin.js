// Script untuk membuat akun admin
// Jalankan dengan: node scripts/seed-admin.js

const { Pool } = require('pg');
const { hashPassword, generateRandomString } = require('better-auth/crypto');
require('dotenv').config({ path: '.env.local' });

async function seedAdmin() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        console.log('🔄 Menghubungkan ke database...');

        const adminEmail = 'admin@eabsensi.com';
        const adminPassword = 'Admin123!';
        const adminName = 'Administrator';
        const adminDepartment = 'IT';

        // Cek apakah admin sudah ada
        const existing = await pool.query('SELECT id FROM "user" WHERE email = $1', [adminEmail]);

        if (existing.rows.length > 0) {
            console.log('⚠️  Admin sudah ada, menghapus data lama...');
            const userId = existing.rows[0].id;
            await pool.query('DELETE FROM "attendance" WHERE user_id = $1', [userId]);
            await pool.query('DELETE FROM "leaves" WHERE user_id = $1', [userId]);
            await pool.query('DELETE FROM "session" WHERE user_id = $1', [userId]);
            await pool.query('DELETE FROM "account" WHERE user_id = $1', [userId]);
            await pool.query('DELETE FROM "user" WHERE id = $1', [userId]);
            console.log('✅ Data admin lama dihapus');
        }

        // Hash password menggunakan Better Auth crypto (scrypt) agar kompatibel dengan sistem autentikasi
        const hashedPassword = await hashPassword(adminPassword);
        const userId = generateRandomString(32);

        // Insert user (catatan: password disimpan di tabel "account", bukan di tabel "user")
        await pool.query(
            `INSERT INTO "user" (id, name, email, email_verified, role, department, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
            [userId, adminName, adminEmail, true, 'admin', adminDepartment]
        );

        // Insert account (diperlukan oleh BetterAuth untuk credential login)
        const accountId = generateRandomString(32);
        await pool.query(
            `INSERT INTO "account" (id, user_id, account_id, provider_id, password, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [accountId, userId, userId, 'credential', hashedPassword]
        );

        console.log('');
        console.log('✅ Akun admin berhasil dibuat!');
        console.log('=============================');
        console.log(`📧 Email    : ${adminEmail}`);
        console.log(`🔑 Password : ${adminPassword}`);
        console.log(`👤 Nama     : ${adminName}`);
        console.log(`🏢 Dept     : ${adminDepartment}`);
        console.log(`🔐 Role     : admin`);
        console.log('=============================');
        console.log('');
        console.log('Gunakan kredensial di atas untuk login ke dashboard admin.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

seedAdmin().catch(console.error);
