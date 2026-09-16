/**
 * Fungsi untuk menghitung jarak antara dua titik koordinat menggunakan rumus Haversine
 * @param lat1 Latitude titik pertama
 * @param lon1 Longitude titik pertama
 * @param lat2 Latitude titik kedua
 * @param lon2 Longitude titik kedua
 * @returns Jarak dalam meter
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Radius bumi dalam meter
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ dalam radian
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Jarak dalam meter
}

/**
 * Fungsi untuk mendapatkan lokasi pengguna saat ini
 * @returns Promise yang berisi objek dengan latitude dan longitude
 */
export function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak didukung oleh browser ini.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let message = 'Gagal mendeteksi lokasi.';
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            message = 'Izin akses lokasi ditolak. Harap izinkan akses lokasi (GPS) di browser Anda untuk melakukan absensi.';
            break;
          case 2: // POSITION_UNAVAILABLE
            message = 'Informasi lokasi tidak tersedia. Pastikan GPS perangkat Anda aktif.';
            break;
          case 3: // TIMEOUT
            message = 'Waktu permintaan lokasi habis (timeout). Silakan coba lagi.';
            break;
          default:
            message = error.message || 'Terjadi kesalahan saat mengambil lokasi.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 detik
        maximumAge: 0, // Selalu ambil lokasi terbaru
      }
    );
  });
}