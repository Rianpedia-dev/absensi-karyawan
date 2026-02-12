'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (session) {
        // Arahkan pengguna ke halaman yang sesuai berdasarkan peran
        if (session.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Jika belum login, arahkan ke halaman login
        router.push('/login');
      }
    }
  }, [session?.user?.id, isPending, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Memuat halaman...</p>
    </div>
  );
}