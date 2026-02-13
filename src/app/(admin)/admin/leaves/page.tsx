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
import { formatDateOnly, cn } from '@/lib/utils';
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
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">

      {/* === HEADER === */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-500 p-8 text-white shadow-xl shadow-emerald-500/10 flex-1 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/15 transition-colors duration-500" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <CalendarCheck className="h-6 w-6 text-white" />
              </div>
              <p className="text-white/80 text-sm font-semibold uppercase tracking-wider">Operational Panel</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Manajemen Cuti Karyawan</h1>
            <p className="text-emerald-50/80 text-sm mt-2 max-w-xl font-medium">Tinjau, setujui, atau tolak permohonan cuti dengan efisien dalam satu dashboard terpusat.</p>
          </div>
        </div>

        {/* Stats Grid - Large View */}
        <div className="grid grid-cols-3 gap-4 min-w-[360px]">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center group hover:border-emerald-200 transition-all duration-300">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingCount}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Menunggu</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center group hover:border-emerald-200 transition-all duration-300">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{approvedCount}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Disetujui</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center group hover:border-emerald-200 transition-all duration-300">
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-rose-600">
              <XCircle className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{rejectedCount}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Ditolak</p>
          </div>
        </div>
      </div>

      {/* === FILTER & TOOLS === */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex p-1.5 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl w-fit border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
          {[
            { key: 'pending' as LeaveFilter, label: 'Menunggu', icon: Clock },
            { key: 'all' as LeaveFilter, label: 'Semua Data', icon: FileText },
            { key: 'approved' as LeaveFilter, label: 'Disetujui', icon: CheckCircle2 },
            { key: 'rejected' as LeaveFilter, label: 'Ditolak', icon: XCircle },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${filter === tab.key
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-md ring-1 ring-black/5 dark:ring-white/10'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <tab.icon className={cn("h-4 w-4", filter === tab.key ? "text-emerald-500" : "text-slate-400")} />
              {tab.label}
              <span className={cn(
                "ml-1 text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors",
                filter === tab.key
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              )}>
                {tab.key === 'all' ? leaves.length : tab.key === 'pending' ? pendingCount : tab.key === 'approved' ? approvedCount : rejectedCount}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 font-medium italic">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Sistem memperbarui data secara otomatis setiap ada perubahan status.</span>
        </div>
      </div>

      {/* === LEAVE GRID/LIST === */}
      {filteredLeaves.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeaves.map((leave) => {
            const days = getDaysDiff(leave.startDate, leave.endDate);
            const isProcessing = processingId === leave.id;

            return (
              <Card key={leave.id} className="border-none shadow-sm shadow-slate-200 dark:shadow-none bg-white dark:bg-slate-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 group">
                <div className="h-2 w-full bg-slate-50 dark:bg-slate-700/50 relative overflow-hidden">
                  <div className={cn(
                    "absolute inset-0 transition-transform duration-500",
                    leave.status === 'pending' ? "bg-amber-400" : leave.status === 'approved' ? "bg-emerald-500" : "bg-rose-500"
                  )} />
                </div>

                <CardContent className="p-6">
                  {/* Action Buttons Overlay for Pending */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-100 dark:border-slate-600 transition-transform group-hover:scale-110 duration-500">
                        {leave.user?.image ? (
                          <img src={leave.user.image} alt={leave.user.name} className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          <span className="font-bold text-slate-500 text-lg uppercase">{leave.user?.name?.substring(0, 2) || '??'}</span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{leave.user?.name || '-'}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          <Building2 className="mr-1 h-3 w-3" /> {leave.user?.department || 'Divisi Umum'}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(leave.status)}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Durasi Cuti</span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{days} Hari Kalender</span>
                      </div>
                      <Badge className={cn("rounded-lg border-none shadow-sm font-bold", getLeaveTypeColor(leave.type))}>
                        {getLeaveTypeName(leave.type)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Mulai</label>
                        <div className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/20 p-2 rounded-xl border border-slate-100/50 dark:border-slate-700">
                          <CalendarDays className="h-3 w-3 mr-2 text-emerald-500" />
                          {formatDateOnly(new Date(leave.startDate))}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Hingga</label>
                        <div className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/20 p-2 rounded-xl border border-slate-100/50 dark:border-slate-700">
                          <CalendarDays className="h-3 w-3 mr-2 text-rose-400" />
                          {formatDateOnly(new Date(leave.endDate))}
                        </div>
                      </div>
                    </div>

                    {leave.reason && (
                      <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center">
                          <FileText className="h-3 w-3 mr-1" /> Alasan Pengajuan
                        </label>
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border-l-2 border-slate-200 dark:border-slate-700 leading-relaxed">
                          "{leave.reason}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions Area */}
                  {leave.status === 'pending' && (
                    <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                      <Button
                        onClick={() => handleApprove(leave.id)}
                        disabled={isProcessing}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-11 font-bold shadow-lg shadow-emerald-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Setujui
                          </div>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleReject(leave.id)}
                        disabled={isProcessing}
                        variant="outline"
                        className="flex-1 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-2xl h-11 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 mr-2" />
                            Tolak
                          </div>
                        )}
                      </Button>
                    </div>
                  )}

                  {leave.status !== 'pending' && (
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-700 mt-6 flex justify-center">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Closed Request</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-none shadow-sm bg-white dark:bg-slate-800 rounded-3xl animate-in zoom-in-95 duration-500">
          <CardContent className="py-24 text-center">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarCheck className="h-10 w-10 text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Data Belum Tersedia</h3>
            <p className="text-slate-400 max-w-xs mx-auto text-sm">
              {filter === 'pending'
                ? 'Semua permohonan telah diproses. Tidak ada pengajuan yang menunggu saat ini.'
                : 'Belum ada data cuti yang tercatat dalam kategori ini.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}