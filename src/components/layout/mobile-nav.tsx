'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, FileText, Home, Users, Settings, BarChart3, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
    const pathname = usePathname();

    // Determine context from pathname — no session dependency
    const isAdminSection = pathname.startsWith('/admin');

    const employeeLinks = [
        { href: '/dashboard', icon: Home, label: 'Beranda' },
        { href: '/dashboard/history', icon: Calendar, label: 'Riwayat' },
        { href: '/dashboard/leave', icon: FileText, label: 'Cuti' },
    ];

    const adminLinks = [
        { href: '/admin', icon: Home, label: 'Beranda' },
        { href: '/admin/employees', icon: Users, label: 'Karyawan' },
        { href: '/admin/leaves', icon: CalendarCheck, label: 'Cuti' },
        { href: '/admin/reports', icon: BarChart3, label: 'Laporan' },
    ];

    const links = isAdminSection ? adminLinks : employeeLinks;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
            {/* Frosted glass background */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-around px-2 py-2">
                    {links.map((link) => {
                        const isActive =
                            link.href === '/dashboard' || link.href === '/admin'
                                ? pathname === link.href
                                : pathname.startsWith(link.href);
                        const Icon = link.icon;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 min-w-[60px]',
                                    isActive
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-slate-400 dark:text-slate-500'
                                )}
                            >
                                <div className={cn(
                                    'p-1.5 rounded-xl transition-all duration-300',
                                    isActive && 'bg-indigo-100 dark:bg-indigo-900/50'
                                )}>
                                    <Icon className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')} strokeWidth={isActive ? 2.5 : 1.8} />
                                </div>
                                <span className={cn(
                                    'text-[10px] leading-none',
                                    isActive ? 'font-bold' : 'font-medium'
                                )}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
                {/* Safe area for iPhone notch / gesture bar */}
                <div className="h-[env(safe-area-inset-bottom,0px)]" />
            </div>
        </nav>
    );
}
