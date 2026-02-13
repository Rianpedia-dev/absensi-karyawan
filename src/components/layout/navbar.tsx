'use client';

import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from 'lucide-react';

export function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  if (isPending) {
    return <div className="h-16 flex items-center justify-between px-4">Loading...</div>;
  }

  return (
    <nav className="h-16 flex items-center justify-between px-4 border-b">
      <Link href={session?.user.role === 'admin' ? '/admin' : '/dashboard'} className="text-xl font-bold">
        E-Absensi
      </Link>

      <div className="flex items-center space-x-4">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="h-8 w-8 rounded-full object-cover border border-white dark:border-slate-700 shadow-sm"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{session.user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={session.user.role === 'admin' ? '/admin/profile' : '/dashboard/profile'}>
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="space-x-2">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}