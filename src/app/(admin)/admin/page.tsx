'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, FileText } from 'lucide-react';
import { formatTime, formatDateOnly } from '@/lib/utils';
import { getAdminStats, getTodayAttendance } from '@/actions/attendance';

export default function AdminDashboardPage() {
  const { data: session, isPending } = useSession();
  const [stats, setStats] = useState<{
    totalEmployees: number;
    todayPresent: number;
    pendingLeaves: number;
  } | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, attendanceData] = await Promise.all([
        getAdminStats(),
        getTodayAttendance()
      ]);
      setStats(statsData);
      setTodayAttendance(attendanceData);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id && session.user.role === 'admin') {
      loadData();
    }
  }, [session?.user?.id]);

  if (isPending || loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-600">Halo, {session?.user?.name || 'Admin'}! Selamat datang di panel administrasi.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Statistik Hari Ini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hadir Hari Ini</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.todayPresent || 0}/{stats?.totalEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">
              dari {stats?.totalEmployees || 0} karyawan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Karyawan</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">Total karyawan terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuti Pending</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingLeaves || 0}</div>
            <p className="text-xs text-muted-foreground">Permintaan cuti menunggu persetujuan</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Monitoring - Kehadiran Hari Ini */}
      <Card>
        <CardHeader>
          <CardTitle>Kehadiran Hari Ini</CardTitle>
          <CardDescription>{formatDateOnly(new Date())}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Nama</th>
                  <th className="py-2 text-left">Departemen</th>
                  <th className="py-2 text-left">Jam Masuk</th>
                  <th className="py-2 text-left">Jam Pulang</th>
                  <th className="py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendance.length > 0 ? (
                  todayAttendance.map((record) => (
                    <tr key={record.id} className="border-b">
                      <td className="py-2">{record.user?.name || '-'}</td>
                      <td className="py-2">{record.user?.department || '-'}</td>
                      <td className="py-2">{record.checkInTime ? formatTime(new Date(record.checkInTime)) : '-'}</td>
                      <td className="py-2">{record.checkOutTime ? formatTime(new Date(record.checkOutTime)) : '-'}</td>
                      <td className="py-2">
                        {record.status === 'present' && (
                          <Badge variant="secondary">Hadir</Badge>
                        )}
                        {record.status === 'late' && (
                          <Badge variant="destructive">Terlambat</Badge>
                        )}
                        {record.status === 'early_departure' && (
                          <Badge variant="outline">Pulang Awal</Badge>
                        )}
                        {record.status === 'absent' && (
                          <Badge variant="outline">Tidak Hadir</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      Belum ada data kehadiran hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}