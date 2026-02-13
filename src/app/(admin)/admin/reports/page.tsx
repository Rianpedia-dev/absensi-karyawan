'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { getFilteredAttendance } from '@/actions/attendance';

export default function ReportsPage() {
  const { data: session, isPending } = useSession();
  const [reportData, setReportData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [loading, setLoading] = useState(true);


  // Fungsi untuk memuat data laporan
  const loadReportData = async () => {
    try {
      setLoading(true);
      const data = await getFilteredAttendance(
        startDate || undefined,
        endDate || undefined,
        selectedDepartment
      );
      setReportData(data);
    } catch (error) {
      console.error('Error loading report data:', error);
      alert('Gagal memuat data laporan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    loadReportData();
  };

  const handleExport = () => {
    if (reportData.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    // Header CSV
    const headers = ['Nama', 'Departemen', 'Tanggal', 'Jam Masuk', 'Jam Pulang', 'Status'];

    // Konversi status ke bahasa Indonesia
    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'present': return 'Hadir';
        case 'late': return 'Terlambat';
        case 'early_departure': return 'Pulang Awal';
        case 'absent': return 'Tidak Hadir';
        default: return status;
      }
    };

    // Buat isi CSV
    const csvContent = [
      headers.join(';'), // Menggunakan titik koma sebagai pemisah untuk kompatibilitas Excel di regional Indonesia
      ...reportData.map(record => [
        `"${record.user?.name || '-'}"`,
        `"${record.user?.department || '-'}"`,
        `"${formatDateOnly(new Date(record.date))}"`,
        `"${record.checkInTime ? formatTime(new Date(record.checkInTime)) : '-'}"`,
        `"${record.checkOutTime ? formatTime(new Date(record.checkOutTime)) : '-'}"`,
        `"${getStatusLabel(record.status)}"`
      ].join(';'))
    ].join('\n');

    // Tambahkan Byte Order Mark (BOM) agar Excel mengenali encoding UTF-8 dengan benar
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-absensi-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isPending || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Laporan Absensi</h1>
        <p className="text-gray-600">Laporan kehadiran karyawan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
          <CardDescription>Atur rentang tanggal dan departemen untuk laporan</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Akhir</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departemen</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Departemen</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end space-x-2">
              <Button type="submit">Terapkan Filter</Button>
              <Button type="button" variant="outline" onClick={handleExport}>Ekspor ke CSV</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Laporan</CardTitle>
          <CardDescription>Laporan kehadiran berdasarkan filter yang dipilih</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jam Masuk</TableHead>
                  <TableHead>Jam Pulang</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.user?.name || '-'}</TableCell>
                    <TableCell>{record.user?.department || '-'}</TableCell>
                    <TableCell>{formatDateOnly(new Date(record.date))}</TableCell>
                    <TableCell>{record.checkInTime ? formatTime(new Date(record.checkInTime)) : '-'}</TableCell>
                    <TableCell>{record.checkOutTime ? formatTime(new Date(record.checkOutTime)) : '-'}</TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}