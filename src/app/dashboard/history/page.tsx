'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatTime, formatDateOnly } from '@/lib/utils';
import { getUserAttendanceHistory } from '@/actions/attendance';

export default function HistoryPage() {
  const { data: session, isPending } = useSession();
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const loadAttendanceHistory = async () => {
    try {
      if (!session?.user?.id) return;
      setLoading(true);
      // Ambil 30 hari terakhir riwayat absensi
      const history = await getUserAttendanceHistory(session.user.id, 30);
      setAttendanceHistory(history);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat riwayat absensi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      loadAttendanceHistory();
    }
  }, [session?.user?.id]);

  if (isPending || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Riwayat Absensi</h1>
        <p className="text-gray-600">Riwayat kehadiran Anda selama ini</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Kehadiran</CardTitle>
          <CardDescription>Riwayat absensi 30 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jam Masuk</TableHead>
                  <TableHead>Jam Pulang</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceHistory.length > 0 ? (
                  attendanceHistory
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Urutkan dari terbaru
                    .map((record) => {
                      // Hitung durasi kerja jika tersedia jam masuk dan pulang
                      let duration = '-';
                      if (record.checkInTime && record.checkOutTime) {
                        const checkIn = new Date(record.checkInTime);
                        const checkOut = new Date(record.checkOutTime);
                        const diffMs = checkOut.getTime() - checkIn.getTime();
                        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                        duration = `${diffHrs}h ${diffMins}m`;
                      }

                      return (
                        <TableRow key={record.id}>
                          <TableCell>{formatDateOnly(new Date(record.date))}</TableCell>
                          <TableCell>
                            {record.checkInTime ? formatTime(new Date(record.checkInTime)) : '-'}
                          </TableCell>
                          <TableCell>
                            {record.checkOutTime ? formatTime(new Date(record.checkOutTime)) : '-'}
                          </TableCell>
                          <TableCell>{duration}</TableCell>
                          <TableCell>
                            {record.status === 'present' && (
                              <Badge variant="secondary">Hadir</Badge>
                            )}
                            {record.status === 'late' && (
                              <Badge variant="destructive">Terlambat</Badge>
                            )}
                            {record.status === 'absent' && (
                              <Badge variant="outline">Tidak Hadir</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Belum ada riwayat absensi
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}