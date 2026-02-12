# Setup Aplikasi E-Absensi dengan Docker

## Prasyarat
- Docker Desktop terinstall dan berjalan
- Pastikan minimal 4GB RAM dialokasikan untuk Docker

## Langkah-langkah Setup

### 1. Clone atau buat proyek
Pastikan Anda berada di root direktori proyek E-Absensi

### 2. Buat file konfigurasi lingkungan
Buat file `.env.local` di root direktori dengan konten berikut:

```env
# Ganti dengan password database Anda
DB_PASSWORD=mysecretpassword

# Ganti dengan secret key yang kuat
AUTH_SECRET=ubah-dengan-string-acak-yang-panjang-dan-kuat

# URL aplikasi (ubah jika dideploy ke domain lain)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Untuk membuat AUTH_SECRET yang kuat, jalankan perintah berikut di terminal:
```bash
openssl rand -base64 32
```

### 3. Jalankan aplikasi dengan Docker

#### Mode Development (dengan hot-reload):
```bash
docker-compose -f docker-compose.dev.yml up --build
```

#### Mode Production:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

Aplikasi akan tersedia di http://localhost:3000

## Struktur Proyek
```
E-Absensi/
├── app/                    # File-file aplikasi Next.js
├── components/            # Komponen UI
├── db/                    # Skema dan konfigurasi database
├── lib/                   # Library dan utilitas
├── actions/               # Server actions
├── Dockerfile             # Konfigurasi Docker untuk aplikasi
├── docker-compose.yml     # Konfigurasi Docker Compose
├── docker-compose.dev.yml # Konfigurasi untuk development
├── docker-compose.prod.yml # Konfigurasi untuk production
├── .dockerignore          # File-file yang diabaikan saat build Docker
├── package.json           # Dependensi dan script
└── ...
```

## Perintah Umum

### Melihat status container:
```bash
docker-compose ps
```

### Melihat log aplikasi:
```bash
docker-compose logs app
```

### Melihat log database:
```bash
docker-compose logs db
```

### Menjalankan migrasi database secara manual:
```bash
docker-compose exec app npx drizzle-kit push
```

### Mengakses database secara langsung:
```bash
docker-compose exec db psql -U postgres -d absensi_db
```

### Menghentikan aplikasi:
```bash
docker-compose down
```

### Menghentikan dan menghapus volume (akan menghapus semua data):
```bash
docker-compose down -v
```

## Troubleshooting

### Jika aplikasi tidak bisa diakses di http://localhost:3000:
1. Pastikan port 3000 tidak digunakan oleh aplikasi lain
2. Cek log dengan `docker-compose logs app`
3. Pastikan database sudah sehat dengan `docker-compose ps`

### Jika build gagal:
1. Pastikan semua dependensi di `package.json` benar
2. Coba rebuild tanpa cache: `docker-compose build --no-cache`

### Jika database tidak bisa connect:
1. Pastikan nama service database adalah `db` dalam konfigurasi
2. Pastikan `depends_on` dengan `condition: service_healthy` sudah benar
3. Cek log database: `docker-compose logs db`

## Penyesuaian untuk Production

Saat deploy ke production, pastikan untuk:

1. Mengganti `AUTH_SECRET` dengan nilai yang kuat dan rahasia
2. Menggunakan password database yang kuat
3. Mengonfigurasi reverse proxy (nginx) untuk SSL
4. Menggunakan external volume untuk data database
5. Mengonfigurasi backup database secara rutin