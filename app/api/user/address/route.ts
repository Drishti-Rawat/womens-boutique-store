import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/user/address — Fetch saved delivery address for logged-in user
 */
export async function GET(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        savedPhone:   true,
        savedAddress: true,
        savedCity:    true,
        savedState:   true,
        savedPincode: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ address: dbUser });
  } catch (error) {
    console.error('[USER/ADDRESS GET]', error);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}

/**
 * PATCH /api/user/address — Save delivery address for future checkouts
 */
export async function PATCH(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    const body = await req.json();
    const { phone, address, city, state, pincode } = body;

    await prisma.user.update({
      where: { id: user.userId },
      data: {
        savedPhone:   phone   || undefined,
        savedAddress: address || undefined,
        savedCity:    city    || undefined,
        savedState:   state   || undefined,
        savedPincode: pincode || undefined,
      },
    });

    return NextResponse.json({ success: true, message: 'Address saved to your profile' });
  } catch (error) {
    console.error('[USER/ADDRESS PATCH]', error);
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 });
  }
}
