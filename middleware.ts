import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware hanya untuk redirect dasar, tidak memeriksa session
export function middleware(request: NextRequest) {
  // Tidak ada logika kompleks di sini untuk menghindari impor database
  return NextResponse.next();
}

// Tentukan path mana yang harus dicek oleh middleware
export const config = {
  matcher: [
    /*
     * Match semua path kecuali:
     * - file statis (_next/static, _next/image, favicon.ico, dll)
     * - halaman login dan signup
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|sign-up|$).*)',
  ],
};