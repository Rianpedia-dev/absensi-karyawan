# Panduan Penggunaan Docker untuk E-Absensi

## Prasyarat
- Docker Desktop terinstall dan berjalan
- Pastikan Anda memiliki setidaknya 4GB RAM tersedia untuk Docker

## Cara Menjalankan Aplikasi dengan Docker

### 1. Production Mode
Untuk menjalankan aplikasi dalam mode produksi:

```bash
docker-compose up --build
```

Aplikasi akan tersedia di http://localhost:3000

### 2. Development Mode
Untuk menjalankan aplikasi dalam mode development dengan hot-reload:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### 3. Menjalankan di Background
Untuk menjalankan container di background:

```bash
docker-compose up -d
```

## Struktur Docker

### Services
- `db`: PostgreSQL database (port 5432)
- `app`: Aplikasi Next.js (port 3000)

### Volumes
- `postgres_data`: Volume persisten untuk data PostgreSQL

## Konfigurasi Lingkungan

Pastikan Anda telah membuat file `.env.local` di root direktori dengan konfigurasi berikut:

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@db:5432/absensi_db"
AUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

Catatan: Dalam `docker-compose.yml`, nilai-nilai ini sudah ditentukan, tetapi Anda bisa menggantinya sesuai kebutuhan.

## Perintah Berguna

### Melihat logs
```bash
docker-compose logs -f
```

### Menjalankan migrasi manual
```bash
docker-compose exec app npx drizzle-kit push
```

### Mengakses database
```bash
docker-compose exec db psql -U postgres -d absensi_db
```

### Membersihkan containers dan rebuild
```bash
docker-compose down -v
docker-compose up --build
```

## Troubleshooting

### Jika aplikasi tidak bisa terhubung ke database:
- Pastikan nama service database dalam `DATABASE_URL` adalah `db` (bukan `localhost`)
- Pastikan `depends_on` dengan `condition: service_healthy` sudah benar

### Jika build gagal:
- Pastikan semua dependensi di `package.json` sudah benar
- Coba rebuild tanpa cache: `docker-compose build --no-cache`

### Jika volume tidak persisten:
- Pastikan volume `postgres_data` sudah didefinisikan di file `docker-compose.yml`
- Untuk reset data: `docker-compose down -v` (akan menghapus semua data)