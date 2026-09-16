'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { toast } from 'sonner';

export function OfflineAlert() {
  const [isOffline, setIsOffline] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // Cek status koneksi awal
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOffline = () => {
      setIsOffline(true);
      toast.error('Koneksi Internet Terputus (Offline)', {
        id: 'network-status-toast',
        description: 'Perangkat Anda kehilangan sinyal/internet. Absensi tidak dapat dilakukan dalam mode offline.',
        duration: Infinity,
      });
    };

    const handleOnline = () => {
      setIsOffline(false);
      toast.success('Koneksi Internet Terhubung Kembali (Online)', {
        id: 'network-status-toast',
        description: 'Perangkat Anda telah terhubung kembali ke jaringan internet.',
        duration: 4000,
      });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!hasMounted || !isOffline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-rose-600 text-white px-4 py-2.5 shadow-lg flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold animate-in slide-in-from-top duration-300">
      <WifiOff className="h-4 w-4 shrink-0 animate-pulse" />
      <span>Perangkat Sedang Offline — Tidak ada koneksi internet. Aktifkan Wi-Fi atau Data Seluler untuk absensi.</span>
    </div>
  );
}
