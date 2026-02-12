'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CalendarCheck, Clock, User, FileText, CheckCircle2,
  XCircle, Loader2, AlertCircle, CalendarDays, Building2
} from 'lucide-react';
import { formatDateOnly } from '@/lib/utils';
import { getAllLeaves, updateLeaveStatus } from '@/actions/leave';
import { toast } from 'sonner';

type LeaveFilter = 'pending' | 'all' | 'approved' | 'rejected';

export default function LeaveManagementPage() {
  const { data: session, isPending } = useSession();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<LeaveFilter>('pending');

  const loadAllLeaves = async () => {
    try {
      setLoading(true);
      const leavesData = await getAllLeaves();
      setLeaves(leavesData);
    } catch (err: any) {
      toast.error('Gagal memuat data cuti');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllLeaves();
  }, []);

  const handleApprove = async (leaveId: number) => {
    try {
      setProcessingId(leaveId);
      await updateLeaveStatus(leaveId, 'approved');
      toast.success('Cuti disetujui');
      loadAllLeaves();
    } catch (err: any) {
      toast.error('Gagal menyetujui cuti');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (leaveId: number) => {
    try {
      setProcessingId(leaveId);
      await updateLeaveStatus(leaveId, 'rejected');
      toast.success('Cuti ditolak');
      loadAllLeaves();
    } catch (err: any) {
      toast.error('Gagal menolak cuti');
    } finally {
      setProcessingId(null);
    }
  };

  // Helpers
  const getLeaveTypeName = (type: string) => {
    switch (type) {
      case 'sick': return 'Sakit';
      case 'vacation': return 'Cuti Tahunan';
      case 'other': return 'Lainnya';
      default: return type;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'sick': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800';
      case 'vacation': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
            <Clock className="h-3 w-3 mr-1" />
            Menunggu
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Disetujui
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">
            <XCircle className="h-3 w-3 mr-1" />
            Ditolak
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDaysDiff = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  };

  // Filter logic
  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedCount = leaves.filter(l => l.status === 'approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'rejected').length;

  const filteredLeaves = filter === 'all'
    ? leaves
    : leaves.filter(l => l.status === filter);

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-muted-foreground text-sm animate-pulse">Memuat data cuti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto pb-8">

      {/* === HEADER === */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-500 p-5 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="h-5 w-5 text-white/70" />
            <p className="text-white/70 text-sm font-medium">Manajemen Cuti</p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pengajuan Cuti</h1>
          <p className="text-white/70 text-sm mt-1">Kelola permintaan cuti karyawan</p>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 mt-4 grid grid-cols-3 gap-2">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 text-center">
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-[10px] text-white/70 uppercase tracking-wider">Menunggu</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 text-center">
            <p className="text-2xl font-bold">{approvedCount}</p>
            <p className="text-[10px] text-white/70 uppercase tracking-wider">Disetujui</p>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 text-center">
            <p className="text-2xl font-bold">{rejectedCount}</p>
            <p className="text-[10px] text-white/70 uppercase tracking-wider">Ditolak</p>
          </div>
        </div>
      </div>

      {/* === FILTER TABS === */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'pending' as LeaveFilter, label: 'Menunggu', count: pendingCount },
          { key: 'all' as LeaveFilter, label: 'Semua', count: leaves.length },
          { key: 'approved' as LeaveFilter, label: 'Disetujui', count: approvedCount },
          { key: 'rejected' as LeaveFilter, label: 'Ditolak', count: rejectedCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${filter === tab.key
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
              }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === tab.key ? 'bg-white/20' : 'bg-background'
              }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* === LEAVE LIST === */}
      {filteredLeaves.length > 0 ? (
        <div className="space-y-3">
          {filteredLeaves.map((leave) => {
            const days = getDaysDiff(leave.startDate, leave.endDate);
            const isProcessing = processingId === leave.id;

            return (
              <Card key={leave.id} className="border-0 shadow-md overflow-hidden">
                <CardContent className="p-4">
                  {/* Top Row - Name & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {(leave.user?.name || '?')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{leave.user?.name || '-'}</p>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          <span className="text-xs truncate">{leave.user?.department || '-'}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(leave.status)}
                  </div>

                  <Separator className="my-3" />

                  {/* Leave Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={getLeaveTypeColor(leave.type)}>
                        {getLeaveTypeName(leave.type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium">{days} hari</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>
                        {formatDateOnly(new Date(leave.startDate))} — {formatDateOnly(new Date(leave.endDate))}
                      </span>
                    </div>

                    {leave.reason && (
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">{leave.reason}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Only for pending */}
                  {leave.status === 'pending' && (
                    <>
                      <Separator className="my-3" />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApprove(leave.id)}
                          disabled={isProcessing}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-10"
                          size="sm"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1.5" />
                              Setujui
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleReject(leave.id)}
                          disabled={isProcessing}
                          variant="outline"
                          className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950 h-10"
                          size="sm"
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1.5" />
                              Tolak
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="py-16 text-center">
            <CalendarCheck className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">
              {filter === 'pending'
                ? 'Tidak ada pengajuan cuti yang menunggu'
                : filter === 'approved'
                  ? 'Belum ada cuti yang disetujui'
                  : filter === 'rejected'
                    ? 'Belum ada cuti yang ditolak'
                    : 'Belum ada pengajuan cuti'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}