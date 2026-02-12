'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Clock, MapPin, LogIn, LogOut, CalendarDays,
  Timer, CheckCircle2, XCircle, Loader2, Fingerprint,
  TrendingUp, History
} from 'lucide-react';
import { calculateDistance, getCurrentLocation } from '@/lib/geolocation';
import { formatTime, formatDateOnly } from '@/lib/utils';
import { clockIn, clockOut, getTodayUserAttendance, getUserAttendanceHistory } from '@/actions/attendance';
import { getOfficeConfig } from '@/actions/settings';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [config, setConfig] = useState({
    latitude: 0,
    longitude: 0,
    radius: 100,
  });

  // Update waktu setiap detik untuk jam real-time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    if (!session?.user?.id) return;
    try {
      setPageLoading(true);
      const [today, historyData, officeConfig] = await Promise.all([
        getTodayUserAttendance(),
        getUserAttendanceHistory(session.user.id, 7),
        getOfficeConfig()
      ]);
      setTodayAttendance(today);
      setHistory(historyData);
      setConfig(officeConfig);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      loadData();
    }
  }, [session?.user?.id]);

  const handleClockIn = async () => {
    setLoading(true);
    setLocationError(null);

    try {
      const userLocation = await getCurrentLocation();
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        config.latitude,
        config.longitude
      );

      if (distance > config.radius) {
        const errMsg = `Anda berada di luar jangkauan kantor! Jarak: ${distance.toFixed(0)}m (Max: ${config.radius}m). Lokasi Anda: ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}`;
        setLocationError(errMsg);
        toast.error('Gagal Clock In', { description: 'Lokasi Anda di luar jangkauan kantor.' });
        setLoading(false);
        return;
      }

      const result = await clockIn(userLocation.latitude, userLocation.longitude);

      if (result.success) {
        await loadData();
        toast.success('Berhasil!', { description: result.message });
      } else {
        setLocationError(result.message);
        toast.error('Gagal', { description: result.message });
      }
    } catch (error: any) {
      console.error('Error during clock in:', error);
      setLocationError(error.message || 'Gagal melakukan absensi masuk');
      toast.error('Error', { description: error.message || 'Gagal mendapatkan lokasi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    setLocationError(null);

    try {
      const userLocation = await getCurrentLocation();
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        config.latitude,
        config.longitude
      );

      if (distance > config.radius) {
        const errMsg = `Anda berada di luar jangkauan kantor! Jarak: ${distance.toFixed(0)}m (Max: ${config.radius}m). Lokasi Anda: ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}`;
        setLocationError(errMsg);
        toast.error('Gagal Clock Out', { description: 'Lokasi Anda di luar jangkauan kantor.' });
        setLoading(false);
        return;
      }

      const result = await clockOut(userLocation.latitude, userLocation.longitude);

      if (result.success) {
        await loadData();
        toast.success('Berhasil!', { description: result.message });
      } else {
        setLocationError(result.message);
        toast.error('Gagal', { description: result.message });
      }
    } catch (error: any) {
      console.error('Error during clock out:', error);
      setLocationError(error.message || 'Gagal melakukan absensi pulang');
      toast.error('Error', { description: error.message || 'Gagal mendapatkan lokasi.' });
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const hasCheckedIn = !!todayAttendance?.checkInTime;
  const hasCheckedOut = !!todayAttendance?.checkOutTime;

  const getWorkDuration = () => {
    if (!hasCheckedIn) return { hours: 0, minutes: 0, text: '-' };
    const start = new Date(todayAttendance.checkInTime).getTime();
    const end = hasCheckedOut ? new Date(todayAttendance.checkOutTime).getTime() : currentTime.getTime();
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes, text: `${hours}j ${minutes}m` };
  };

  const getWorkProgress = () => {
    if (!hasCheckedIn) return 0;
    const duration = getWorkDuration();
    const totalMinutes = duration.hours * 60 + duration.minutes;
    return Math.min((totalMinutes / (8 * 60)) * 100, 100); // 8-hour workday
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
  };

  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (isPending || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          </div>
          <p className="text-muted-foreground text-sm animate-pulse">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const workDuration = getWorkDuration();
  const workProgress = getWorkProgress();

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto pb-8">

      {/* === HEADER SECTION === */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-5 md:p-8 text-white shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium">{getGreeting()} 👋</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 tracking-tight">
            {session?.user?.name || 'Karyawan'}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-white/80 text-sm">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDay(currentTime)}, {formatFullDate(currentTime)}</span>
          </div>
        </div>

        {/* Live Clock */}
        <div className="relative z-10 mt-4 flex items-center gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <p className="text-3xl md:text-4xl font-mono font-bold tracking-wider">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <div className="flex flex-col">
            {hasCheckedIn && !hasCheckedOut && (
              <Badge className="bg-emerald-400/20 text-emerald-100 border-emerald-400/30 backdrop-blur-sm animate-pulse">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 inline-block" />
                Sedang Bekerja
              </Badge>
            )}
            {hasCheckedOut && (
              <Badge className="bg-blue-400/20 text-blue-100 border-blue-400/30 backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Selesai
              </Badge>
            )}
            {!hasCheckedIn && (
              <Badge className="bg-amber-400/20 text-amber-100 border-amber-400/30 backdrop-blur-sm">
                <Clock className="h-3 w-3 mr-1" />
                Belum Absen
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* === CLOCK IN/OUT BUTTON === */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col items-center py-8 px-4">
            {/* Main Action Button */}
            {!hasCheckedIn ? (
              <button
                onClick={handleClockIn}
                disabled={loading}
                className="group relative w-36 h-36 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
              >
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-300/30 animate-ping opacity-40" />
                <div className="relative flex flex-col items-center gap-1 text-white">
                  {loading ? (
                    <Loader2 className="h-10 w-10 animate-spin" />
                  ) : (
                    <>
                      <Fingerprint className="h-10 w-10 md:h-12 md:w-12" />
                      <span className="text-sm font-bold tracking-wide">CLOCK IN</span>
                    </>
                  )}
                </div>
              </button>
            ) : hasCheckedOut ? (
              <div className="w-36 h-36 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shadow-inner">
                <div className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-300">
                  <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12" />
                  <span className="text-xs font-semibold">SELESAI</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleClockOut}
                disabled={loading}
                className="group relative w-36 h-36 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-full border-4 border-rose-300/30 animate-ping opacity-40" />
                <div className="relative flex flex-col items-center gap-1 text-white">
                  {loading ? (
                    <Loader2 className="h-10 w-10 animate-spin" />
                  ) : (
                    <>
                      <LogOut className="h-10 w-10 md:h-12 md:w-12" />
                      <span className="text-sm font-bold tracking-wide">CLOCK OUT</span>
                    </>
                  )}
                </div>
              </button>
            )}

            {/* Subtitle */}
            <p className="text-muted-foreground text-xs mt-4 text-center">
              {!hasCheckedIn
                ? 'Tekan tombol di atas untuk absen masuk'
                : hasCheckedOut
                  ? 'Anda sudah menyelesaikan absensi hari ini'
                  : 'Tekan tombol di atas untuk absen pulang'}
            </p>
          </div>

          {/* Error message */}
          {locationError && (
            <div className="mx-4 mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2">
              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-destructive text-sm">{locationError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* === TODAY STATUS CARDS === */}
      <div className="grid grid-cols-3 gap-3">
        {/* Jam Masuk */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-3 md:p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-2">
              <LogIn className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Masuk</p>
            <p className="text-base md:text-lg font-bold tabular-nums">
              {hasCheckedIn ? formatTime(new Date(todayAttendance.checkInTime)) : '--:--'}
            </p>
          </CardContent>
        </Card>

        {/* Jam Pulang */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-3 md:p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-rose-50 dark:bg-rose-950 flex items-center justify-center mb-2">
              <LogOut className="h-5 w-5 text-rose-500" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Pulang</p>
            <p className="text-base md:text-lg font-bold tabular-nums">
              {hasCheckedOut ? formatTime(new Date(todayAttendance.checkOutTime)) : '--:--'}
            </p>
          </CardContent>
        </Card>

        {/* Durasi */}
        <Card className="border-0 shadow-md overflow-hidden">
          <CardContent className="p-3 md:p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-purple-50 dark:bg-purple-950 flex items-center justify-center mb-2">
              <Timer className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mb-1">Durasi</p>
            <p className="text-base md:text-lg font-bold tabular-nums">
              {hasCheckedIn ? workDuration.text : '--:--'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* === WORK PROGRESS === */}
      {hasCheckedIn && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Progress Kerja</span>
              </div>
              <span className="text-sm font-bold text-primary">{workProgress.toFixed(0)}%</span>
            </div>
            <Progress value={workProgress} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">
              Target: 8 jam kerja{hasCheckedOut ? ' • Sudah selesai' : ' • Sedang berjalan'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* === ATTENDANCE HISTORY === */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle className="text-base md:text-lg">Riwayat Absensi</CardTitle>
          </div>
          <CardDescription>7 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent className="px-3 md:px-6 pb-4">
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.map((record: any) => {
                const date = new Date(record.date);
                const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
                const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                const checkIn = record.checkInTime ? formatTime(new Date(record.checkInTime)) : '-';
                const checkOut = record.checkOutTime ? formatTime(new Date(record.checkOutTime)) : '-';
                const isPresent = record.status === 'present';

                return (
                  <div
                    key={record.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
                  >
                    {/* Date */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase">{dayName}</span>
                      <span className="text-sm font-bold text-primary">{date.getDate()}</span>
                    </div>

                    {/* Times */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{checkIn}</span>
                        <span className="text-muted-foreground text-xs">→</span>
                        <span className="text-sm font-semibold">{checkOut}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{dateStr}</p>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant={isPresent ? 'secondary' : 'outline'}
                      className={isPresent
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300'}
                    >
                      {isPresent ? 'Hadir' : record.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">Belum ada riwayat absensi</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}