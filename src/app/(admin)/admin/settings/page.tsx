'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getOfficeConfig, updateOfficeConfig } from '@/actions/settings';
import { toast } from 'sonner';
import { MapPin } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        latitude: 0,
        longitude: 0,
        radius: 100,
    });

    useEffect(() => {
        loadConfig();
    }, []);

    async function loadConfig() {
        try {
            const data = await getOfficeConfig();
            setConfig(data);
        } catch (error) {
            toast.error("Gagal memuat konfigurasi");
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            await updateOfficeConfig(
                Number(config.latitude),
                Number(config.longitude),
                Number(config.radius)
            );
            toast.success("Konfigurasi berhasil disimpan");
        } catch (error) {
            toast.error("Gagal menyimpan konfigurasi");
        } finally {
            setSaving(false);
        }
    }

    function handleUseCurrentLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setConfig(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                    toast.success("Lokasi saat ini berhasil diambil");
                },
                (error) => {
                    toast.error("Gagal mengambil lokasi: " + error.message);
                }
            );
        } else {
            toast.error("Geolocation tidak didukung di browser ini");
        }
    }

    if (loading) return <div className="p-8">Memuat...</div>;

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
                <p className="text-muted-foreground">
                    Konfigurasi sistem absensi
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lokasi Kantor</CardTitle>
                    <CardDescription>
                        Tentukan titik koordinat kantor pusat dan radius toleransi absensi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    value={config.latitude}
                                    onChange={(e) => setConfig({ ...config, latitude: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude">Longitude</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    value={config.longitude}
                                    onChange={(e) => setConfig({ ...config, longitude: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="radius">Radius Toleransi (Meter)</Label>
                            <Input
                                id="radius"
                                type="number"
                                min="10"
                                value={config.radius}
                                onChange={(e) => setConfig({ ...config, radius: parseFloat(e.target.value) })}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Jarak maksimum yang diperbolehkan dari titik pusat kantor untuk melakukan absensi.
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={handleUseCurrentLocation}>
                                <MapPin className="mr-2 h-4 w-4" />
                                Gunakan Lokasi Saat Ini
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
