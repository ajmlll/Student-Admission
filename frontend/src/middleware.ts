import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Decodes a JWT token payload without verifying the signature (safe for edge routing purposes)
function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isParentRoute = pathname.startsWith('/parent');
  const isAdmissionRoute = pathname.startsWith('/admission');

  // Decode user details from token if available
  const decoded = token ? decodeJwt(token) : null;
  const role = decoded?.role;

  // 1. If trying to access an authenticated route, check credentials
  if (isParentRoute || isAdmissionRoute) {
    if (!token || !decoded) {
      // Redirect to login page
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Clear token cookie just in case it was invalid
      response.cookies.delete('token');
      return response;
    }

    // Role checks
    if (isParentRoute && role !== 'parent') {
      // Direct unauthorized admission users to their own dashboard
      return NextResponse.redirect(new URL('/admission/dashboard', request.url));
    }

    if (isAdmissionRoute && role !== 'admission_team') {
      // Direct unauthorized parent users to their own dashboard
      return NextResponse.redirect(new URL('/parent/dashboard', request.url));
    }
  }

  // 2. If logged in and hitting an auth route (login/register), redirect to their respective dashboard
  if (isAuthRoute && token && decoded) {
    if (role === 'admission_team') {
      return NextResponse.redirect(new URL('/admission/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/parent/dashboard', request.url));
    }
  }

  // Allow standard routing
  return NextResponse.next();
}

// Config to specify matching paths
export const config = {
  matcher: [
    '/login',
    '/register',
    '/parent/:path*',
    '/admission/:path*',
  ],
};
