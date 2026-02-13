'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Fitur pendaftaran mandiri dinonaktifkan.
 * Pendaftaran karyawan hanya dapat dilakukan oleh Administrator melalui panel admin.
 */
export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium italic">Mengalihkan ke halaman login...</p>
      </div>
    </div>
  );
}