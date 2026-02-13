'use client';

import { useState, useRef } from 'react';
import { authClient } from '@/lib/auth-client';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, User, Building2, Mail, ShieldCheck, Camera, X } from 'lucide-react';
import { ExtendedUser } from '@/lib/auth-client';
import { PasswordInput } from '@/components/ui/password-input';

interface ProfileFormProps {
    user: ExtendedUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [name, setName] = useState(user.name || '');
    const [department, setDepartment] = useState(user.department || '');
    const [loading, setLoading] = useState(false);

    // Image states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(user.image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Password states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 2MB');
                return;
            }
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return null;

        if (!supabase) {
            throw new Error('Konfigurasi Supabase (URL/Anon Key) tidak ditemukan. Jika sudah deploy, pastikan Anda sudah menambahkan Environment Variables di Vercel dan melakukan REDEPLOY (Build Ulang) agar variabel terbaca.');
        }

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(filePath, imageFile);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('profiles')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = user.image;

            // 1. Upload new image if chosen
            if (imageFile) {
                const uploadedUrl = await uploadImage();
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            // 2. Update user profile
            await authClient.updateUser({
                name: name,
                // @ts-ignore - department is an additional field
                department: department,
                image: imageUrl || undefined,
            });

            toast.success('Profil berhasil diperbarui');
            setImageFile(null); // Reset file selection after success
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(error.message || 'Gagal memperbarui profil. Pastikan Bucket Supabase "profiles" sudah dibuat dan disetel Public.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Konfirmasi kata sandi tidak cocok');
            return;
        }

        setPasswordLoading(true);
        try {
            await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });
            toast.success('Kata sandi berhasil diperbarui');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.message || 'Gagal memperbarui kata sandi. Pastikan kata sandi saat ini benar.');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <User size={120} />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                        {/* Profile Picture Upload Section */}
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold border-2 border-white/40 shadow-2xl overflow-hidden">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    user.name?.[0].toUpperCase() || 'U'
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 p-2.5 bg-white text-blue-600 rounded-xl shadow-lg hover:bg-blue-50 transition-all border border-blue-100 group-hover:scale-110 active:scale-95"
                            >
                                <Camera size={18} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <div className="text-center md:text-left">
                            <CardTitle className="text-2xl md:text-3xl font-bold">{user.name || 'User'}</CardTitle>
                            <CardDescription className="text-blue-100 flex items-center justify-center md:justify-start gap-1.5 mt-1 font-medium">
                                <ShieldCheck className="h-4 w-4" />
                                Akun {user.role === 'admin' ? 'Administrator' : 'Karyawan'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <form onSubmit={handleUpdate}>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Field: Nama */}
                            <div className="space-y-2.5">
                                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <User className="h-3.5 w-3.5 text-blue-500" /> Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Masukkan nama lengkap"
                                    className="rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 h-12 transition-all font-medium"
                                    required
                                />
                            </div>

                            {/* Field: Departemen */}
                            <div className="space-y-2.5">
                                <Label htmlFor="department" className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Building2 className="h-3.5 w-3.5 text-blue-500" /> Departemen / Divisi
                                </Label>
                                <Input
                                    id="department"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    placeholder="Contoh: IT, HR, Marketing"
                                    className="rounded-xl border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 h-12 transition-all font-medium"
                                />
                            </div>

                            {/* Field Readonly: Email */}
                            <div className="space-y-2.5">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5 text-slate-400" /> Alamat Email
                                </Label>
                                <div className="h-12 flex items-center px-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 font-semibold text-sm">
                                    {user.email}
                                </div>
                                <p className="text-[10px] text-slate-400 italic font-medium">Email adalah identitas utama dan tidak dapat diubah.</p>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="p-8 pt-0 flex flex-col md:flex-row items-center justify-between gap-6">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : 'Simpan Perubahan'}
                        </Button>

                        <div className="flex items-center gap-2 text-[11px] text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
                            <X className="h-3 w-3" />
                            <span>Pastikan ukuran foto tidak melebihi 2MB.</span>
                        </div>
                    </CardFooter>
                </form>
            </Card>

            {/* NEW: Change Password Section */}
            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-blue-600" />
                        Keamanan Akun
                    </CardTitle>
                    <CardDescription className="font-medium">Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2.5">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Kata Sandi Saat Ini</Label>
                                <PasswordInput
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="rounded-xl border-slate-200 h-11 font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Kata Sandi Baru</Label>
                                <PasswordInput
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className="rounded-xl border-slate-200 h-11 font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Konfirmasi Kata Sandi</Label>
                                <PasswordInput
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Ulangi kata sandi baru"
                                    className="rounded-xl border-slate-200 h-11 font-medium"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-8 pt-0 flex justify-between items-center">
                        <p className="text-[11px] text-slate-400 font-medium max-w-[300px]">
                            Sesi di perangkat lain akan dihentikan secara otomatis setelah perubahan kata sandi.
                        </p>
                        <Button
                            type="submit"
                            disabled={passwordLoading}
                            className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700 rounded-xl h-11 px-8 font-bold transition-all shadow-md"
                        >
                            {passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Sandi'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
