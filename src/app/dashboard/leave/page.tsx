'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { requestLeave, getMyLeaves } from '@/actions/leave';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateOnly } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function LeavePage() {
  const { data: session, isPending } = useSession();
  const [leaveType, setLeaveType] = useState<'sick' | 'vacation' | 'other'>('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi Sinyal / Koneksi Offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const msg = 'Tidak dapat mengajukan cuti: Perangkat Anda sedang offline (tidak ada sinyal/internet).';
      setError(msg);
      toast.error('Koneksi Offline', { description: msg });
      return;
    }

    // Validasi tanggal
    if (!startDate || !endDate) {
      const msg = 'Tanggal mulai dan akhir harus diisi';
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!reason.trim()) {
      const msg = 'Alasan pengajuan cuti harus diisi';
      setError(msg);
      toast.error(msg);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      const msg = 'Tanggal mulai harus sebelum atau sama dengan tanggal akhir';
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    try {
      // Panggil server action untuk mengajukan cuti
      const result = await requestLeave(
        leaveType,
        start,
        end,
        reason
      );

      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message || 'Permintaan cuti berhasil diajukan');
        // Reset form
        setLeaveType('sick');
        setStartDate('');
        setEndDate('');
        setReason('');
        setIsFormVisible(false);
        // Muat ulang data cuti
        loadMyLeaves();
      } else {
        setError(result.message);
        toast.error(result.message || 'Gagal mengajukan cuti');
      }
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan saat mengajukan cuti';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMyLeaves = async () => {
    try {
      const leaves = await getMyLeaves();
      setMyLeaves(leaves);
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan saat memuat data cuti';
      setError(msg);
      toast.error(msg);
    }
  };

  // Load leaves when component mounts
  useEffect(() => {
    if (session?.user?.id) {
      loadMyLeaves();
    }
  }, [session?.user?.id]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengajuan Cuti</h1>
        <p className="text-gray-600">Ajukan cuti atau izin Anda di sini</p>
      </div>

      {!isFormVisible ? (
        <Button onClick={() => setIsFormVisible(true)}>Ajukan Cuti</Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ajukan Cuti Baru</CardTitle>
            <CardDescription>Isi formulir di bawah untuk mengajukan cuti</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{success}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Cuti</Label>
                  <Select value={leaveType} onValueChange={(value: any) => setLeaveType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sick">Sakit</SelectItem>
                      <SelectItem value="vacation">Cuti Tahunan</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Alasan</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Jelaskan alasan Anda mengajukan cuti"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>



              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" type="button" disabled={isSubmitting} onClick={() => setIsFormVisible(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengajukan...
                    </>
                  ) : (
                    'Ajukan Cuti'
                  )}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengajuan Cuti</CardTitle>
          <CardDescription>Daftar pengajuan cuti Anda sebelumnya</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Alasan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myLeaves.length > 0 ? (
                  myLeaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>
                        {leave.type === 'sick' && 'Sakit'}
                        {leave.type === 'vacation' && 'Cuti Tahunan'}
                        {leave.type === 'other' && 'Lainnya'}
                      </TableCell>
                      <TableCell>
                        {formatDateOnly(new Date(leave.startDate))} - {formatDateOnly(new Date(leave.endDate))}
                      </TableCell>
                      <TableCell>{leave.reason}</TableCell>
                      <TableCell>
                        {leave.status === 'pending' && (
                          <Badge variant="outline">Menunggu</Badge>
                        )}
                        {leave.status === 'approved' && (
                          <Badge variant="secondary">Disetujui</Badge>
                        )}
                        {leave.status === 'rejected' && (
                          <Badge variant="destructive">Ditolak</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      Belum ada pengajuan cuti
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