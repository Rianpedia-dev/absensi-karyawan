# Dokumentasi Sistem Absensi Karyawan (E-Absensi)

Dokumen ini menjelaskan secara rinci cara kerja, arsitektur, dan alur data dari aplikasi E-Absensi yang telah dibangun.

## 1. Arsitektur Teknologi

Sistem ini dibangun menggunakan teknologi web modern yang berfokus pada performa, keamanan, dan pengalaman pengguna yang responsif.

*   **Framework Utama**: **Next.js 15** (App Router) - Menangani rendering sisi server (SSR) dan klien (CSR).
*   **Database & ORM**: **PostgreSQL** dengan **Drizzle ORM** - Untuk pengelolaan data yang tipe-aman (Next.js -> Drizzle -> DB).
*   **Autentikasi**: **Better Auth** - Mengelola sesi pengguna, login, register, dan hak akses (Role-Based Access Control).
*   **Styling**: **Tailwind CSS** & **Shadcn UI** - Untuk antarmuka yang bersih dan responsif.
*   **Bahasa Pemrograman**: **TypeScript** - Menjamin keamanan tipe data di seluruh aplikasi.

---

## 2. Struktur Database (Schema)

Sistem menggunakan database relasional dengan tabel utama sebagai berikut:

1.  **Users**: Menyimpan data karyawan dan admin (Nama, Email, Password, Role, Departemen).
2.  **Sessions**: Menyimpan token sesi aktif untuk autentikasi.
3.  **Attendances**: Mencatat data absensi (Check-in, Check-out, Tanggal, Status, Lokasi).
4.  **Leaves**: Mencatat pengajuan cuti (Tipe, Tanggal Mulai/Akhir, Alasan, Status Persetujuan).

---

## 3. Alur Kerja Utama

### A. Autentikasi & Keamanan
Sistem menggunakan pendekatan *Server-Side Auth Guards* untuk keamanan maksimal.

1.  **Login/Register**: Pengguna memasukkan kredensial. *Server Action* memvalidasi dan membuat sesi di database.
2.  **Proteksi Halaman**:
    *   Setiap kali halaman dimuat, `layout.tsx` di sisi server memeriksa apakah sesi valid melalui `headers()`.
    *   Jika tidak ada sesi -> Redirect paksa ke `/login`.
    *   Jika halaman Admin diakses oleh Karyawan -> Redirect paksa ke `/dashboard`.
    *   Ini mencegah *flicker* atau tampilan sekilas halaman yang tidak seharusnya dilihat.

### B. Proses Absensi (Clock In / Clock Out)
Fitur inti ini memastikan karyawan hanya bisa absen jika memenuhi syarat.

1.  **Deteksi Lokasi**: Aplikasi meminta izin lokasi (GPS) browser.
2.  **Validasi Jarak (Geofencing)**:
    *   Server menghitung jarak antara koordinat pengguna dan kantor pusat.
    *   Jika jarak > 100 meter (dapat dikonfigurasi), absensi **ditolak**.
3.  **Pencatatan**:
    *   **Clock In**: Mencatat waktu saat ini sebagai `checkInTime` dan status "Hadir" atau "Terlambat" (tergantung jam masuk).
    *   **Clock Out**: Mengupdate *record* hari ini dengan `checkOutTime`.

### C. Dashboard Karyawan
Menyediakan informasi real-time untuk pengguna.

*   **Status Hari Ini**: Mengambil data terbaru dari tabel `Attendances` untuk menampilkan jam masuk/pulang.
*   **Riwayat**: Menampilkan 5 aktivitas terakhir.
*   **Pengajuan Cuti**: Formulir terintegrasi yang menyimpan permintaan ke tabel `Leaves` dengan status awal `pending`.

### D. Panel Admin
Pusat kontrol untuk manajemen operasional.

1.  **Dashboard Statistik**:
    *   Menggunakan *Server Action* `getAdminStats` untuk menghitung total karyawan, kehadiran hari ini, dan cuti pending secara *real-time* dari database.
2.  **Manajemen Karyawan (CRUD)**:
    *   Admin dapat menambah, mengedit, atau menghapus akun karyawan.
    *   Setiap perubahan langsung disinkronisasi ke tabel `Users`.
3.  **Laporan Absensi**:
    *   Fitur filter canggih menggunakan query database dinamis (`getFilteredAttendance`) berdasarkan rentang tanggal dan departemen.
4.  **Persetujuan Cuti**:
    *   Admin melihat daftar cuti `pending`.
    *   Saat tombol "Setujui" atau "Tolak" ditekan, status di tabel `Leaves` diperbarui dan langsung tercermin di dashboard karyawan.

---

## 4. Keunggulan Teknis

*   **Data Dinamis & Real-time**: Tidak ada lagi *mock data*. Semua angka dan tabel mencerminkan kondisi database terkini.
*   **Optimasi performa**: Penggunaan *Server Components* meminimalkan JavaScript yang dikirim ke browser, membuat aplikasi cepat.
*   **Type Safety**: Integrasi TypeScript penuh dari database hingga frontend mencegah *bug* umum seperti *undefined variable*.
*   **Stabilitas**: Mekanisme routing yang stabil mencegah error saat *refresh* halaman, menjamin pengalaman pengguna yang mulus.

---

## 5. Cara Menjalankan

1.  Pastikan PostgreSQL berjalan.
2.  Jalankan `npm run dev`.
3.  Akses `http://localhost:3000`.
4.  Login sebagai Admin untuk pengaturan, atau Karyawan untuk melakukan absensi.

---

## 6. Struktur Direktori Proyek

Berikut adalah pemetaan file penting dalam proyek ini:

```
src/
├── actions/                  # Server Actions (Backend Logic)
│   ├── attendance.ts         # Logika absensi, statistik admin, & riwayat
│   ├── leave.ts              # Logika pengajuan & persetujuan cuti
│   └── user.ts               # CRUD Karyawan (Create, Read, Update, Delete)
│
├── app/                      # App Router (Halaman Web)
│   ├── (admin)/              # Area Admin (Layout khusus Admin)
│   │   └── admin/            # Dashboard, Employees, Leaves, Reports
│   ├── (auth)/               # Halaman Login & Register
│   ├── (dashboard)/          # Area Karyawan (Layout khusus Karyawan)
│   │   └── dashboard/        # Dashboard Utama, History, Leave Request
│   └── api/auth/             # Route Handler untuk Better Auth
│
├── components/               # Komponen UI Reusable
│   ├── ui/                   # Shadcn UI (Button, Card, Input, Table, dll)
│   └── layout/               # Navbar & Sidebar
│
├── db/                       # Konfigurasi Database
│   └── schema.ts             # Definisi Tabel Drizzle ORM
│
└── lib/                      # Utilitas Pembantu
    ├── auth.ts               # Konfigurasi Better Auth (Server)
    ├── auth-client.ts        # Konfigurasi Better Auth (Client)
    ├── geolocation.ts        # Hitung jarak (Haversine Formula) & GPS
    └── utils.ts              # Format tanggal, waktu, & mata uang
```

## 7. Catatan Pengembang

*   **Pemisahan Layout**: Menggunakan *Route Groups* `(admin)` dan `(dashboard)` memungkinkan kita memiliki *sidebar* dan aturan proteksi yang berbeda untuk kedua peran tersebut tanpa mempengaruhi struktur URL.
*   **Geolokasi**: Menggunakan *Haversine Formula* di sisi klien dan server untuk memvalidasi jarak pengguna dari kantor dengan presisi tinggi.
*   **Keamanan**: Selain pengecekan di UI, seluruh *Server Actions* memvalidasi ulang sesi pengguna sebelum melakukan operasi database, mencegah serangan manipulasi API.
