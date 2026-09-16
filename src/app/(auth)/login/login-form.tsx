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
import type { DemoConfig } from '@/actions/settings';
import { Sparkles, ShieldCheck, UserCheck, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoginFormProps {
  initialDemoConfig: DemoConfig;
}

export function LoginForm({ initialDemoConfig }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoConfig] = useState<DemoConfig>(initialDemoConfig);
  const [selectedDemo, setSelectedDemo] = useState<'admin' | 'employee' | null>(null);
  const router = useRouter();

  const handleSelectDemo = (type: 'admin' | 'employee') => {
    if (!demoConfig) return;
    if (type === 'admin') {
      setEmail(demoConfig.adminEmail || 'admin@eabsensi.com');
      setPassword(demoConfig.adminPassword || 'Admin123!');
    } else {
      setEmail(demoConfig.employeeEmail || 'owi@gmail.com');
      setPassword(demoConfig.employeePassword || 'owi12345');
    }
    setSelectedDemo(type);
    setError('');
    toast.info(`Akun demo ${type === 'admin' ? 'Admin' : 'Pegawai'} dipilih`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      const msg = 'Email dan kata sandi harus diisi.';
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await signIn.email({
        email,
        password,
      });

      if (response?.error) {
        const errorMsg = response.error.message || 'Login gagal. Periksa kembali email dan kata sandi.';
        setError(errorMsg);
        toast.error('Gagal Masuk', { description: errorMsg });
        setIsSubmitting(false);
      } else {
        toast.success('Login Berhasil!', { description: 'Mengalihkan ke dashboard...' });

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
      const errorMsg = 'Terjadi kesalahan saat login. Silakan coba lagi.';
      setError(errorMsg);
      toast.error('Error', { description: errorMsg });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1e] to-black relative overflow-hidden p-3 sm:p-4">
      {/* Decorative Background Elements isolated in an overflow-hidden wrapper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[15%] -left-[10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-[410px] mx-auto bg-[#0f172a]/85 backdrop-blur-md border border-white/10 shadow-2xl relative z-10 text-white rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-2xl" />

        <CardHeader className="text-center space-y-1 pt-5 pb-2">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center shadow-inner border border-white/5 mb-0.5 ring-1 ring-white/10">
            <img src="/icon.png" alt="Absensi Pegawai Logo" className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
            Absensi Pegawai
          </CardTitle>
          <CardDescription className="text-slate-400 font-medium text-xs">
            Portal Masuk Pegawai & Admin
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3 px-6 py-2">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-3 py-2 rounded-lg text-xs flex items-center gap-2 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                {error}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email" className="text-slate-300 text-[11px] font-bold uppercase tracking-wider pl-1">Email Anda</Label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukan Email Anda"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedDemo(null);
                  }}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-10 pl-3.5 text-sm transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-slate-300 text-[11px] font-bold uppercase tracking-wider pl-1">Kata Sandi</Label>
              <div className="relative group">
                <PasswordInput
                  id="password"
                  value={password}
                  placeholder="Masukan Kata Sandi Anda"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSelectedDemo(null);
                  }}
                  className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl h-10 pl-3.5 text-sm transition-all"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col px-6 pb-4 pt-1 space-y-2.5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-10 text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] border-t border-white/10 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses Masuk...
                </>
              ) : (
                'Masuk'
              )}
            </Button>

            {/* Bagian Akun Demo Cepat (Di bawah tombol masuk) */}
            {demoConfig?.enabled && (
              <div className="w-full pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                    Akun Demo Cepat
                  </span>
                  <span className="text-[9px] text-slate-500">Klik untuk isi form</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    id="btn-demo-admin"
                    onClick={() => handleSelectDemo('admin')}
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                      selectedDemo === 'admin'
                        ? 'bg-blue-600/25 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/50'
                        : 'bg-slate-900/70 border-slate-800 hover:border-blue-500/40 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md transition-colors ${
                        selectedDemo === 'admin' ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30'
                      }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">Akun Admin</span>
                    </div>
                    {selectedDemo === 'admin' && (
                      <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px]">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    id="btn-demo-employee"
                    onClick={() => handleSelectDemo('employee')}
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                      selectedDemo === 'employee'
                        ? 'bg-emerald-600/25 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                        : 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md transition-colors ${
                        selectedDemo === 'employee' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30'
                      }`}>
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-white">Akun Pegawai</span>
                    </div>
                    {selectedDemo === 'employee' && (
                      <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px]">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="w-full text-center pt-0.5">
              <p className="text-[11px] text-slate-400">
                Hubungi pihak IT jika ada kendala atau masalah
              </p>
              <p className="mt-1 text-[10px] text-slate-500 font-medium">
                &copy; {new Date().getFullYear()} Absensi Pegawai System
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
