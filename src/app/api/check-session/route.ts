import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session) {
      return NextResponse.json({ user: session.user });
    } else {
      return NextResponse.json({ user: null }, { status: 401 });
    }
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json({ user: null, error: 'Failed to check session' }, { status: 500 });
  }
}

// Izinkan metode GET saja
export const runtime = 'nodejs';