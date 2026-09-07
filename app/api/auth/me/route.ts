import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const token = getTokenFromRequest(req) || '';
    return NextResponse.json({ user: dbUser, token });
  } catch (error) {
    console.error('[AUTH/ME]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
