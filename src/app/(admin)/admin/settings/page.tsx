'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { getOfficeConfig, updateOfficeConfig } from '@/actions/settings';
import { toast } from 'sonner';
import { MapPin, Save, Loader2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

import { Switch } from '@/components/ui/switch';
import dynamic from 'next/dynamic';

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

    useEffect(() => {
        // Redirect non-admin is handled by layout, but good to have check here or just load data
        loadConfig();
    }, []);

    const loadConfig = async () => {
        try {
            setLoading(true);
            const data = await getOfficeConfig();
            setConfig({
                latitude: data.latitude.toString(),
                longitude: data.longitude.toString(),
                radius: data.radius.toString(),
                enabled: data.enabled ?? true, // Default true if undefined
            });
        } catch (error) {
            toast.error('Gagal memuat konfigurasi');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const lat = parseFloat(config.latitude);
        const lng = parseFloat(config.longitude);
        const rad = parseFloat(config.radius);

        if (config.enabled && (isNaN(lat) || isNaN(lng) || isNaN(rad))) {
            toast.error('Mohon masukkan angka yang valid');
            setSaving(false);
            return;
        }

        try {
            const result = await updateOfficeConfig(lat, lng, rad, config.enabled);
            if (result.success) {
                toast.success(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan konfigurasi');
        } finally {
            setSaving(false);
        }
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation tidak didukung oleh browser ini');
            return;
        }

        toast.info('Mengambil lokasi saat ini...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setConfig(prev => ({
                    ...prev,
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                }));
                toast.success('Lokasi berhasil diambil!');
            },
            (error) => {
                toast.error('Gagal mengambil lokasi: ' + error.message);
            }
        );
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
                        Tentukan koordinat titik pusat kantor dan jarak toleransi (radius) untuk absensi karyawan.
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
        </div>
    );
}
