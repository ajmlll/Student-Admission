import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { token, user } = await request.json();
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Set the token inside an httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
