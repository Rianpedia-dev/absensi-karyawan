# Dokumentasi Arsitektur Aplikasi E-Absensi

## Gambaran Umum
Aplikasi E-Absensi adalah sistem absensi karyawan berbasis web yang dibangun dengan pendekatan fullstack. Aplikasi ini memungkinkan karyawan untuk melakukan absensi harian dengan validasi lokasi, sementara administrator dapat mengelola data karyawan dan memonitor kehadiran.

## Arsitektur Sistem

### Frontend
- **Framework:** Next.js 15 dengan App Router
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS
- **Komponen UI:** shadcn/ui
- **Autentikasi Client:** Better Auth client-side

### Backend
- **Framework:** Next.js App Router (Server Components & Server Actions)
- **Bahasa:** TypeScript
- **Autentikasi Server:** Better Auth
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL

### Database Schema
1. **users**
   - id (Text/UUID, PK)
   - name (Text)
   - email (Text, Unique)
   - password (Text - Hashed)
   - role (Enum: 'admin', 'employee')
   - department (Text)
   - createdAt (Timestamp)

2. **attendance**
   - id (Serial/UUID, PK)
   - userId (FK -> users.id)
   - date (Date)
   - checkInTime (Timestamp)
   - checkOutTime (Timestamp, Nullable)
   - status (Enum: 'present', 'late', 'absent')
   - latitude (Decimal)
   - longitude (Decimal)
   - notes (Text, Optional)

3. **leaves** (Cuti/Izin)
   - id (Serial/UUID, PK)
   - userId (FK -> users.id)
   - type (Enum: 'sick', 'vacation', 'other')
   - startDate (Date)
   - endDate (Date)
   - status (Enum: 'pending', 'approved', 'rejected')
   - reason (Text)

## Alur Bisnis

### Absensi Masuk
1. Karyawan mengklik tombol "Clock In"
2. Aplikasi meminta izin akses lokasi
3. Lokasi pengguna dikirim ke server
4. Server memvalidasi jarak dari kantor (geofencing)
5. Jika valid, data absensi disimpan ke database

### Absensi Keluar
1. Karyawan mengklik tombol "Clock Out"
2. Aplikasi meminta izin akses lokasi
3. Lokasi pengguna dikirim ke server
4. Server memvalidasi jarak dari kantor dan apakah sudah absen masuk
5. Jika valid, waktu pulang diperbarui di database

### Pengajuan Cuti
1. Karyawan mengisi formulir pengajuan cuti
2. Data dikirim ke server
3. Status permintaan disimpan sebagai "pending"
4. Administrator menyetujui atau menolak permintaan
5. Status diperbarui di database

## Keamanan
- Autentikasi berbasis sesi menggunakan Better Auth
- Proteksi route berdasarkan peran (admin vs employee)
- Validasi lokasi untuk mencegah absensi palsu
- Password di-hash sebelum disimpan

## Deployment
Aplikasi dirancang untuk dideploy di platform seperti Vercel atau VPS dengan Docker/Coolify.

## Testing
Unit test dan integrasi test direkomendasikan untuk:
- Server actions
- Validasi bisnis
- Middleware proteksi route
- Fungsi geofencing