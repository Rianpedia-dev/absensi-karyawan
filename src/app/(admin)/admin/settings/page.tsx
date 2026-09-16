'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { getOfficeConfig, updateOfficeConfig, getDemoConfig, updateDemoConfig, type DemoConfig } from '@/actions/settings';
import { toast } from 'sonner';
import { MapPin, Save, Loader2, Sparkles, Shield, UserCheck, EyeOff, CheckCircle2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

import { Switch } from '@/components/ui/switch';
import dynamic from 'next/dynamic';
import { getCurrentLocation } from '@/lib/geolocation';

const MapPicker = dynamic(() => import('@/components/ui/map-picker'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-lg" />
});

export default function AdminSettingsPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        latitude: '',
        longitude: '',
        radius: '',
        enabled: true,
    });

    const [demoConfig, setDemoConfig] = useState<DemoConfig>({
        enabled: true,
        adminEmail: 'admin@eabsensi.com',
        adminPassword: 'Admin123!',
        employeeEmail: 'owi@gmail.com',
        employeePassword: 'owi12345',
    });
    const [savingDemo, setSavingDemo] = useState(false);

    useEffect(() => {
        // Redirect non-admin is handled by layout, but good to have check here or just load data
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const [data, demoData] = await Promise.all([
                getOfficeConfig(),
                getDemoConfig(),
            ]);
            setConfig({
                latitude: data.latitude.toString(),
                longitude: data.longitude.toString(),
                radius: data.radius.toString(),
                enabled: data.enabled ?? true, // Default true if undefined
            });
            setDemoConfig(demoData);
        } catch (error) {
            toast.error('Gagal memuat konfigurasi');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleDemo = async (checked: boolean) => {
        setSavingDemo(true);
        setDemoConfig(prev => ({ ...prev, enabled: checked }));
        try {
            const res = await updateDemoConfig(checked);
            if (res.success) {
                toast.success(res.message);
            }
        } catch (error: any) {
            setDemoConfig(prev => ({ ...prev, enabled: !checked }));
            toast.error(error.message || 'Gagal mengubah pengaturan demo login');
        } finally {
            setSavingDemo(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const lat = parseFloat(config.latitude);
        const lng = parseFloat(config.longitude);
        const rad = parseFloat(config.radius);

        if (config.enabled) {
            if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
                toast.error('Mohon masukkan angka koordinat dan radius yang valid');
                return;
            }
            if (rad <= 0) {
                toast.error('Radius toleransi harus lebih besar dari 0 meter');
                return;
            }
            if (lat < -90 || lat > 90) {
                toast.error('Latitude harus berada dalam rentang -90 hingga 90 derajat');
                return;
            }
            if (lng < -180 || lng > 180) {
                toast.error('Longitude harus berada dalam rentang -180 hingga 180 derajat');
                return;
            }
        }

        setSaving(true);

        try {
            const result = await updateOfficeConfig(lat, lng, rad, config.enabled);
            if (result.success) {
                toast.success(result.message || 'Konfigurasi kantor berhasil disimpan');
            } else {
                toast.error(result.message || 'Gagal menyimpan konfigurasi');
            }
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan konfigurasi');
        } finally {
            setSaving(false);
        }
    };

    const handleGetCurrentLocation = async () => {
        toast.info('Mengambil lokasi GPS saat ini...');
        try {
            const position = await getCurrentLocation();
            setConfig(prev => ({
                ...prev,
                latitude: position.latitude.toString(),
                longitude: position.longitude.toString(),
            }));
            toast.success('Lokasi kantor berhasil diambil dari GPS!');
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengambil lokasi saat ini');
        }
    };

    if (isPending || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // Double check admin role just in case
    if (session?.user?.role !== 'admin') {
        return <div className="p-8 text-center text-red-500">Akses Ditolak. Halaman ini hanya untuk Administrator.</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pengaturan Kantor</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Konfigurasi lokasi kantor pusat untuk validasi absensi (Geofencing).
                </p>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            Lokasi & Radius Absensi
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="geofencing-mode"
                                checked={config.enabled}
                                onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                            />
                            <Label htmlFor="geofencing-mode" className="text-sm font-medium">
                                {config.enabled ? 'Aktif' : 'Nonaktif'}
                            </Label>
                        </div>
                    </div>
                    <CardDescription>
                        Tentukan koordinat titik pusat kantor dan jarak toleransi (radius) untuk absensi pegawai.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {!config.enabled && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm border border-amber-100 dark:border-amber-800 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                                <span>Fitur Geofencing sedang dinonaktifkan. Karyawan dapat absen dari mana saja.</span>
                            </div>
                        )}

                        <div className={config.enabled ? '' : 'opacity-50 pointer-events-none filter blur-[1px] transition-all'}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <Label htmlFor="latitude">Latitude (Garis Lintang)</Label>
                                    <Input
                                        id="latitude"
                                        placeholder="-6.2088"
                                        value={config.latitude}
                                        onChange={(e) => setConfig({ ...config, latitude: e.target.value })}
                                        type="number"
                                        step="any"
                                        required={config.enabled}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="longitude">Longitude (Garis Bujur)</Label>
                                    <Input
                                        id="longitude"
                                        placeholder="106.8456"
                                        value={config.longitude}
                                        onChange={(e) => setConfig({ ...config, longitude: e.target.value })}
                                        type="number"
                                        step="any"
                                        required={config.enabled}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <Label htmlFor="radius">Radius Toleransi (Meter)</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="radius"
                                        placeholder="100"
                                        value={config.radius}
                                        onChange={(e) => setConfig({ ...config, radius: e.target.value })}
                                        type="number"
                                        min="1"
                                        className="max-w-[200px]"
                                        required={config.enabled}
                                    />
                                    <span className="text-sm text-slate-500">meter dari titik pusat</span>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                <Label>Peta Lokasi Kantor</Label>
                                <MapPicker
                                    latitude={parseFloat(config.latitude) || 0}
                                    longitude={parseFloat(config.longitude) || 0}
                                    radius={parseFloat(config.radius) || 100}
                                    enabled={config.enabled}
                                    onLocationSelect={(lat, lng) => setConfig({
                                        ...config,
                                        latitude: lat.toString(),
                                        longitude: lng.toString()
                                    })}
                                />
                                <p className="text-[12px] text-slate-500">Klik di peta untuk menentukan titik pusat lokasi kantor.</p>
                            </div>

                            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800">
                                <MapPin className="h-4 w-4 mr-2 shrink-0" />
                                <p>
                                    Tips: Anda bisa menggunakan tombol <strong>"Ambil Lokasi Saat Ini"</strong> jika Anda sedang berada di kantor untuk mengisi koordinat secara otomatis.
                                </p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGetCurrentLocation}
                            className="gap-2"
                            disabled={!config.enabled}
                        >
                            <MapPin className="h-4 w-4" />
                            Ambil Lokasi Saat Ini
                        </Button>

                        <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]">
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {/* Pengaturan Akun Demo Login */}
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2.5 text-lg">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <span>Akun Demo di Halaman Login</span>
                        </CardTitle>
                        <div className="flex items-center gap-3">
                            {savingDemo && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs">
                                <Switch
                                    id="demo-accounts-switch"
                                    checked={demoConfig.enabled}
                                    disabled={savingDemo}
                                    onCheckedChange={handleToggleDemo}
                                />
                                <Label htmlFor="demo-accounts-switch" className="text-sm font-semibold cursor-pointer select-none">
                                    {demoConfig.enabled ? (
                                        <span className="text-emerald-600 dark:text-emerald-400">Aktif</span>
                                    ) : (
                                        <span className="text-slate-400">Nonaktif</span>
                                    )}
                                </Label>
                            </div>
                        </div>
                    </div>
                    <CardDescription className="text-slate-500 dark:text-slate-400 mt-1.5">
                        Saklar untuk mengaktifkan atau mematikan tombol cepat akun demo (Admin & Pegawai) di halaman login.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {demoConfig.enabled ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40 rounded-xl text-sm flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                                        Fitur Akun Demo Sedang Aktif di Halaman Login
                                    </p>
                                    <p className="text-emerald-700 dark:text-emerald-400 text-xs mt-0.5">
                                        Pengguna dapat mengklik tombol demo di halaman login untuk mengisi email dan kata sandi secara otomatis.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/40 dark:bg-blue-950/10 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-blue-900 dark:text-blue-300">Akun Admin</span>
                                        </div>
                                        <span className="text-[10px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">Role: Admin</span>
                                    </div>
                                    <div className="text-xs space-y-1 pt-1 font-mono">
                                        <p className="text-slate-700 dark:text-slate-300">
                                            <span className="text-slate-400 font-sans">Email: </span>{demoConfig.adminEmail}
                                        </p>
                                        <p className="text-slate-700 dark:text-slate-300">
                                            <span className="text-slate-400 font-sans">Password: </span>{demoConfig.adminPassword}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/40 dark:bg-emerald-950/10 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                                                <UserCheck className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Akun Pegawai</span>
                                        </div>
                                        <span className="text-[10px] font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">Role: Employee</span>
                                    </div>
                                    <div className="text-xs space-y-1 pt-1 font-mono">
                                        <p className="text-slate-700 dark:text-slate-300">
                                            <span className="text-slate-400 font-sans">Email: </span>{demoConfig.employeeEmail}
                                        </p>
                                        <p className="text-slate-700 dark:text-slate-300">
                                            <span className="text-slate-400 font-sans">Password: </span>{demoConfig.employeePassword}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm flex items-start gap-3 text-slate-600 dark:text-slate-400">
                            <EyeOff className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                    Fitur Akun Demo Dinonaktifkan
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Tombol akun demo tidak akan muncul di halaman login. Form login harus diisi manual.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
