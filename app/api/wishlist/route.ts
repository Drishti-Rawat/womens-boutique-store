import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/wishlist — Retrieve current user's saved wishlist items
export async function GET(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    const wishlistItems = await (prisma as any).wishlistItem.findMany({
      where: { userId: user.userId },
      include: {
        product: {
          include: {
            category: true,
            variants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const products = wishlistItems.map((item: any) => item.product);

    return NextResponse.json({ items: products });
  } catch (error) {
    console.error('[WISHLIST/GET]', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// POST /api/wishlist — Add a product to current user's wishlist in DB
export async function POST(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Create or ignore if existing
    await (prisma as any).wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: user.userId,
          productId,
        },
      },
      update: {},
      create: {
        userId: user.userId,
        productId,
      },
    });

    return NextResponse.json({ success: true, message: 'Added to wishlist in database' });
  } catch (error) {
    console.error('[WISHLIST/POST]', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

// DELETE /api/wishlist — Remove a product from current user's wishlist in DB
export async function DELETE(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await (prisma as any).wishlistItem.deleteMany({
      where: {
        userId: user.userId,
        productId,
      },
    });

    return NextResponse.json({ success: true, message: 'Removed from wishlist in database' });
  } catch (error) {
    console.error('[WISHLIST/DELETE]', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}
