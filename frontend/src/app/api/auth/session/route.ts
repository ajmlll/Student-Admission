import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    // Validate the token by querying NestJS /auth/me
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await res.json();
    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
