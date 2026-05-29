
Berikut adalah panduan detail langkah demi langkah untuk mengatur GitHub Actions sebagai "penjaga" *database* Supabase Anda:

### Langkah 1: Siapkan Kredensial Supabase

Sebelum mulai di GitHub, pastikan Anda sudah menyiapkan tiga hal dari *dashboard* Supabase Anda:

1. Buka *dashboard* Supabase > **Project Settings** > **API**.
2. Salin **Project URL** (contoh: `https://abcdefghijk.supabase.co`).
3. Salin **anon / public key**.
4. Tentukan **satu nama tabel** di database Anda yang akan dipanggil (misalnya: `users`, `profiles`, atau buat tabel kosong baru bernama `keep_alive`).

---

### Langkah 2: Simpan Kredensial di GitHub (Sebagai Secret)

Agar *Project URL* dan *API Key* Anda aman dan tidak terekspos ke publik, kita akan menyimpannya di fitur **Secrets** GitHub.

1. Buka repositori GitHub Anda.
2. Klik tab **Settings** (ikon roda gigi di kanan atas repositori).
3. Di menu sebelah kiri, *scroll* ke bawah lalu cari bagian **Security**.
4. Klik **Secrets and variables** > pilih **Actions**.
5. Klik tombol hijau **New repository secret**.
6. **Buat Secret Pertama (Untuk URL):**
* **Name:** `SUPABASE_URL`
* **Secret:** Masukkan *Project URL* Anda (tanpa garis miring `/` di akhir).
* Klik **Add secret**.


7. **Buat Secret Kedua (Untuk API Key):**
* Klik **New repository secret** lagi.
* **Name:** `SUPABASE_ANON_KEY`
* **Secret:** Masukkan *anon / public key* Supabase Anda.
* Klik **Add secret**.



---

### Langkah 3: Membuat File GitHub Actions

Sekarang kita akan membuat *script* otomatisasinya di dalam repositori Anda.

1. Buka repositori GitHub Anda, lalu klik tombol **Add file** > **Create new file**.
2. Pada kolom nama file di bagian atas, ketik struktur folder dan nama file persis seperti ini:
`.github/workflows/supabase-keep-alive.yml`
3. Salin dan tempel kode berikut ke dalam area teks (editor):

```yaml
name: Supabase Keep Alive

on:
  schedule:
    # Berjalan otomatis setiap 3 hari sekali pada jam 00:00 UTC
    - cron: '0 0 */3 * *' 
  workflow_dispatch: 
    # Menambahkan ini agar Anda bisa mengetesnya secara manual kapan saja

jobs:
  ping_supabase:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase API
        run: |
          # GANTI "nama_tabel_anda" DENGAN NAMA TABEL YANG ADA DI DATABASE
          curl -X GET '${{ secrets.SUPABASE_URL }}/rest/v1/nama_tabel_anda?select=*&limit=1' \
          -H 'apikey: ${{ secrets.SUPABASE_ANON_KEY }}' \
          -H 'Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}'

```

> **Penting:** Perhatikan baris kode `nama_tabel_anda` pada *script* di atas. Hapus teks tersebut dan ganti dengan nama tabel asli yang ada di Supabase Anda (contoh: `users`).

4. Jika sudah, klik tombol **Commit changes...** (biasanya berwarna hijau di kanan atas) lalu klik **Commit changes** lagi untuk menyimpan.

---

### Langkah 4: Tes Menjalankan Secara Manual (Wajib)

Setelah file dibuat, kita perlu memastikan *script* tersebut berfungsi tanpa error. Karena kita menambahkan fitur `workflow_dispatch`, Anda bisa mengetesnya sekarang juga tanpa perlu menunggu 3 hari.

1. Di repositori Anda, klik tab **Actions** (di sebelah tab *Pull requests*).
2. Di menu sebelah kiri, di bawah tulisan "All workflows", klik **Supabase Keep Alive**.
3. Di sisi kanan layar, akan muncul kotak biru dengan tulisan **This workflow has a workflow_dispatch event trigger**. Klik tombol **Run workflow** yang ada di sebelah kanannya.
4. Klik tombol hijau **Run workflow**.
5. Tunggu beberapa detik, lalu *refresh* halaman. Anda akan melihat sebuah proses sedang berjalan (ikon kuning).
6. Jika ikonnya berubah menjadi **ceklis hijau**, selamat! GitHub berhasil menghubungi Supabase Anda. Jika ikonnya silang merah, klik error tersebut untuk melihat detail kesalahannya (biasanya karena salah ketik nama tabel atau salah *copy* URL/Key).

---

Dengan pengaturan ini, selama repositori GitHub Anda tidak dihapus, GitHub akan secara konsisten "membangunkan" *database* Supabase Anda setiap 3 hari agar tidak di-*pause*.

Apakah Anda ingin saya bantu mengecek apakah kode *curl* di atas sudah sesuai dengan struktur tabel yang akan Anda gunakan?