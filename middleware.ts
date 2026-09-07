import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface JWTPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  exp?: number;
}

/**
 * Edge-compatible JWT Payload Decoder
 */
function decodeJwtPayload(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload) as JWTPayload;

    // Check expiration
    if (parsed.exp && Date.now() >= parsed.exp * 1000) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const tokenCookie = req.cookies.get('auth_token')?.value;
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : tokenCookie;

  const payload = token ? decodeJwtPayload(token) : null;

  // ─── 1. Admin Page Protection (/admin/*) ───────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // A) If accessing Admin Login (/admin/login)
    if (pathname === '/admin/login') {
      // If already logged in as ADMIN, redirect straight to /admin dashboard
      if (payload && payload.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }

    // B) Protected Admin Pages (/admin/dashboard, /admin/products, etc.)
    if (!payload) {
      // No token or expired → Redirect to Admin Login
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    if (payload.role !== 'ADMIN') {
      // Logged in as CUSTOMER → Forbidden. Redirect to home or admin login with forbidden flag
      const redirectUrl = new URL('/admin/login', req.url);
      redirectUrl.searchParams.set('error', 'forbidden');
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  // ─── 2. Protected Admin API Routes (/api/admin/*) ──────────────────────────
  if (pathname.startsWith('/api/admin')) {
    // Exempt /api/admin/auth/login from protection
    if (pathname === '/api/admin/auth/login') {
      return NextResponse.next();
    }

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Admin credentials required.' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // ─── 3. Customer Protected Routes (/orders, /checkout) ─────────────────────
  if (pathname.startsWith('/orders') || pathname.startsWith('/checkout')) {
    if (!payload) {
      const redirectUrl = new URL('/', req.url);
      redirectUrl.searchParams.set('auth', 'required');
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/orders/:path*',
    '/checkout/:path*',
  ],
};
