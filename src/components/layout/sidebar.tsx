'use client';

import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Clock, Users, FileText, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className={cn("w-64 h-full bg-muted p-4", className)}>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const isAdmin = session.user.role === 'admin';

  return (
    <Card className={cn("w-64 h-full min-h-screen", className)}>
      <CardHeader>
        <CardTitle>Menu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {!isAdmin ? (
            <>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/dashboard">
                  <Clock className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/dashboard/history">
                  <Calendar className="mr-2 h-4 w-4" />
                  Riwayat
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/dashboard/leave">
                  <FileText className="mr-2 h-4 w-4" />
                  Pengajuan Cuti
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin">
                  <Users className="mr-2 h-4 w-4" />
                  Dashboard Admin
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/employees">
                  <Users className="mr-2 h-4 w-4" />
                  Manajemen Karyawan
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/reports">
                  <FileText className="mr-2 h-4 w-4" />
                  Laporan
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/leaves">
                  <Calendar className="mr-2 h-4 w-4" />
                  Pengajuan Cuti
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Pengaturan
                </Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}