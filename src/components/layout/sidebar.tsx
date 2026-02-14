'use client';

import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Clock, Users, FileText, Calendar, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  if (isPending) {
    return <div className={cn("w-64 h-full bg-slate-50/50 p-4 border-r animate-pulse", className)} />;
  }

  if (!session) {
    return null;
  }

  const isAdmin = session.user.role === 'admin';

  const menuItems = isAdmin
    ? [
      { name: 'Dashboard Admin', href: '/admin', icon: LayoutDashboard },
      { name: 'Manajemen Karyawan', href: '/admin/employees', icon: Users },
      { name: 'Laporan Kehadiran', href: '/admin/reports', icon: FileText },
      { name: 'Pengajuan Cuti', href: '/admin/leaves', icon: Calendar },
      { name: 'Pengaturan Kantor', href: '/admin/settings', icon: Settings },
    ]
    : [
      { name: 'Status Absensi', href: '/dashboard', icon: Clock },
      { name: 'Riwayat Saya', href: '/dashboard/history', icon: Calendar },
      { name: 'Pengajuan Cuti', href: '/dashboard/leave', icon: FileText },
    ];

  return (
    <aside className={cn("w-72 h-full min-h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300", className)}>
      <div className="p-6">


        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}
                <Icon className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                )} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>


    </aside>
  );
}