'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, FileText, TrendingUp, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { formatTime, formatDateOnly, cn } from '@/lib/utils';
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
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Selamat datang kembali, <span className="font-semibold text-slate-700 dark:text-slate-200">{session?.user?.name}</span>. Berikut ringkasan operasional hari ini.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            {formatDateOnly(new Date())}
          </div>
          <button
            onClick={loadData}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"
            title="Refresh Data"
          >
            <TrendingUp className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-3 animate-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-md shadow-blue-500/5 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Users size={80} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-100 text-sm font-medium uppercase tracking-wider">Kehadiran Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">
              {stats?.todayPresent || 0} <span className="text-blue-200 text-xl font-normal">/ {stats?.totalEmployees || 0}</span>
            </div>
            <div className="mt-4 flex items-center text-blue-100 text-xs">
              <div className="w-full bg-blue-500/30 h-1.5 rounded-full mr-2">
                <div
                  className="bg-white h-1.5 rounded-full"
                  style={{ width: `${stats?.totalEmployees ? (stats.todayPresent / stats.totalEmployees) * 100 : 0}%` }}
                />
              </div>
              {stats?.totalEmployees ? Math.round((stats.todayPresent / stats.totalEmployees) * 100) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200 dark:shadow-none bg-white dark:bg-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-slate-100 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500">
            <Users size={80} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Karyawan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{stats?.totalEmployees || 0}</div>
            <p className="mt-2 text-xs text-slate-400 font-medium">Karyawan aktif dalam sistem</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-slate-200 dark:shadow-none bg-white dark:bg-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-slate-100 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500">
            <FileText size={80} />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Cuti Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{stats?.pendingLeaves || 0}</div>
            <p className="mt-2 flex items-center text-xs text-amber-600 font-medium">
              <AlertCircle className="h-3 w-3 mr-1" /> Membutuhkan persetujuan segera
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Section */}
      <Card className="border-none shadow-md shadow-slate-200 dark:shadow-none bg-white dark:bg-slate-800 overflow-hidden">
        <CardHeader className="border-b border-slate-50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 italic flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-500" />
                Live Monitoring Kehadiran
              </CardTitle>
              <CardDescription className="text-xs">Daftar kehadiran karyawan secara real-time</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">Sesuai Jadwal</Badge>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">Pantauan</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-700">
                  <th className="px-6 py-4 text-left uppercase tracking-wider text-[10px]">Karyawan</th>
                  <th className="px-6 py-4 text-left uppercase tracking-wider text-[10px]">Departemen</th>
                  <th className="px-6 py-4 text-left uppercase tracking-wider text-[10px]">Jam Masuk</th>
                  <th className="px-6 py-4 text-left uppercase tracking-wider text-[10px]">Jam Pulang</th>
                  <th className="px-6 py-4 text-left uppercase tracking-wider text-[10px]">Status Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {todayAttendance.length > 0 ? (
                  todayAttendance.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 mr-3 text-xs font-bold font-mono">
                            {record.user?.name?.substring(0, 2).toUpperCase() || '??'}
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">{record.user?.name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium">
                          {record.user?.department || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className={cn("h-3.5 w-3.5 mr-1.5", record.checkInTime ? "text-green-500" : "text-slate-300")} />
                          {record.checkInTime ? formatTime(new Date(record.checkInTime)) : '--:--'}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500">
                        {record.checkOutTime ? formatTime(new Date(record.checkOutTime)) : '--:--'}
                      </td>
                      <td className="px-6 py-4">
                        {record.status === 'present' && (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 rounded-md font-medium shadow-sm">
                            Hadir Tepat Waktu
                          </Badge>
                        )}
                        {record.status === 'late' && (
                          <Badge className="bg-red-50 text-red-700 border-red-100 hover:bg-red-100 rounded-md font-medium shadow-sm">
                            Terlambat
                          </Badge>
                        )}
                        {record.status === 'early_departure' && (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100 rounded-md font-medium shadow-sm">
                            Pulang Awal
                          </Badge>
                        )}
                        {record.status === 'absent' && (
                          <Badge className="bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 rounded-md font-medium shadow-sm">
                            Tidak Hadir
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-slate-200 mb-3" />
                        <p className="text-slate-400 font-medium">Belum ada data kehadiran untuk hari ini.</p>
                      </div>
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