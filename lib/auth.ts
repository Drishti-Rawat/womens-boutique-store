import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'roopkala_royale_secret';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  const cookie = req.cookies.get('auth_token');
  return cookie?.value || null;
}

export function authenticate(req: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

export function requireAuth(req: NextRequest): { user: JWTPayload } | NextResponse {
  const user = authenticate(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
  }
  return { user };
}

export function requireAdmin(req: NextRequest): { user: JWTPayload } | NextResponse {
  const user = authenticate(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
  }
  if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden. Admin access only.' }, { status: 403 });
  }
  return { user };
}
