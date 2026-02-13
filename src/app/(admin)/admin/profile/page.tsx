'use client';

import { useSession } from '@/lib/auth-client';
import { ProfileForm } from '@/components/profile/profile-form';

export default function AdminProfilePage() {
    const { data: session, isPending } = useSession();

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                    <p className="text-slate-500 text-sm font-medium animate-pulse">Menyiapkan profil...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Pengaturan Profil</h1>
                <p className="text-slate-500 font-medium">Kelola informasi pribadi dan pengaturan akun administrator Anda.</p>
            </div>

            <ProfileForm user={session.user} />
        </div>
    );
}
