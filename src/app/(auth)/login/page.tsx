'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn, authClient, type ExtendedUser } from '@/lib/auth-client';
import { PasswordInput } from '@/components/ui/password-input';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await signIn.email({
        email,
        password,
      });

      if (response?.error) {
        setError(response.error.message || 'Login failed');
      } else {
        // Fetch session to get user role
        const { data: session } = await authClient.getSession();

        if ((session?.user as ExtendedUser)?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1e] to-black overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md mx-4 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 shadow-2xl relative z-10 text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-xl" />

        <CardHeader className="text-center space-y-3 pt-12 pb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl flex items-center justify-center shadow-inner border border-white/5 mb-6 ring-1 ring-white/10">
            <img src="/icon.png" alt="E-Absensi Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
            E-Absensi
          </CardTitle>
          <CardDescription className="text-slate-400 font-medium text-lg">
            Portal Masuk Karyawan
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 px-10">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-3 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-slate-300 text-xs font-bold uppercase tracking-wider pl-1">Email Perusahaan</Label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  placeholder="anda@perusahaan.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-14 pl-4 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-slate-300 text-xs font-bold uppercase tracking-wider pl-1">Kata Sandi</Label>
              <div className="relative group">
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-14 pl-4 transition-all"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col px-10 pb-12 pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-14 text-lg rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] border-t border-white/10"
            >
              Masuk
            </Button>

            <p className="mt-8 text-center text-xs text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} E-Absensi System. v1.0
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}