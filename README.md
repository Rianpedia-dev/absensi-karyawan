# E-Absensi - Sistem Absensi Karyawan Fullstack

## Deskripsi
Aplikasi berbasis web untuk mencatat kehadiran karyawan secara real-time menggunakan validasi lokasi (Geolocation) dan waktu server. Aplikasi ini membedakan hak akses antara **Karyawan** (melakukan absensi) dan **Admin** (rekapitulasi & manajemen).

## Teknologi yang Digunakan
- **Framework:** Next.js 16 (App Router)
- **Bahasa:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Better Auth

## Instalasi

### Metode 1: Menggunakan Docker (Direkomendasikan)

1. Pastikan Docker Desktop terinstall dan berjalan
2. Buat file `.env.local` di root direktori (lihat `.env.example` sebagai referensi)
3. Jalankan perintah berikut:

```bash
# Mode development (dengan hot-reload)
docker-compose -f docker-compose.dev.yml up --build

# Mode production
docker-compose -f docker-compose.prod.yml up -d --build
```

Aplikasi akan berjalan di http://localhost:3000

### Metode 2: Instalasi Manual

1. Clone repositori ini
2. Jalankan perintah berikut:

```bash
npm install
```

3. Buat file `.env.local` di root direktori dan tambahkan variabel lingkungan berikut:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/absensi_db"
AUTH_SECRET="your-super-secret-key-here"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. Jalankan migrasi database:

```bash
npx drizzle-kit push
```

5. Jalankan aplikasi:

```bash
npm run dev
```

Aplikasi akan berjalan di http://localhost:3000

## Fitur Utama

### Autentikasi
- Login/registrasi dengan email dan password
- Proteksi route berdasarkan peran (admin/employee)

### Dashboard Karyawan
- Kartu status kehadiran harian
- Tombol absensi masuk/keluar dengan validasi lokasi
- Riwayat kehadiran
- Form pengajuan cuti

### Dashboard Admin
- Monitoring kehadiran real-time
- Manajemen data karyawan
- Persetujuan pengajuan cuti
- Laporan kehadiran

## Struktur Proyek

```
my-attendance-app/
├── app/
│   ├── (auth)/             # Route Group untuk Auth
│   │   ├── login/
│   │   └── sign-up/
│   ├── (dashboard)/        # Layout terproteksi untuk User
│   │   ├── page.tsx        # Dashboard Karyawan
│   │   ├── history/        # Riwayat Absensi
│   │   └── leave/          # Halaman Cuti
│   ├── (admin)/            # Layout terproteksi untuk Admin
│   │   ├── admin/
│   │   │   ├── employees/  # CRUD Karyawan
│   │   │   └── reports/    # Laporan
├── components/
│   ├── ui/                 # Komponen shadcn (Button, Card, dll)
│   ├── forms/              # Form Login, Form Absen
│   ├── layout/             # Sidebar, Navbar
│   └── shared/             # Komponen reusable (StatusBadge, Maps)
├── db/
│   ├── schema.ts           # Definisi Tabel Drizzle
│   ├── index.ts            # Koneksi Database
│   └── migrations/         # File migrasi SQL
├── lib/
│   ├── auth.ts             # Konfigurasi Better Auth
│   ├── auth-client.ts      # Client config Better Auth
│   ├── utils.ts            # Helper function (cn, date formatter)
│   └── geolocation.ts      # Fungsi hitung jarak (Haversine Formula)
├── actions/                # Server Actions (Logika Backend)
│   ├── attendance.ts       # function clockIn(), clockOut()
│   └── user.ts             # function createUser(), updateUser()
├── drizzle.config.ts       # Config Drizzle
├── middleware.ts           # Middleware proteksi route
├── Dockerfile              # Konfigurasi Docker untuk aplikasi
├── docker-compose.yml      # Konfigurasi Docker Compose
├── docker-compose.dev.yml  # Konfigurasi untuk development
├── docker-compose.prod.yml # Konfigurasi untuk production
├── .dockerignore           # File-file yang diabaikan saat build Docker
└── package.json
```

## Docker Setup

Lihat file `SETUP_DOCKER.md` untuk panduan lengkap penggunaan Docker.

## Kontribusi
Silakan buat pull request untuk kontribusi. Pastikan untuk menjalankan test sebelum mengirimkan perubahan.