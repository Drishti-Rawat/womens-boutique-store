import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/cart — Fetch active cart from PostgreSQL DB for logged-in user
export async function GET(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    let cart = await prisma.cart.findFirst({
      where: { userId: user.userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.userId },
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('[CART/GET]', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart — Sync or add item to user's cart in PostgreSQL DB
export async function POST(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    const { productId, size, color, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Get or create user cart
    let cart = await prisma.cart.findFirst({ where: { userId: user.userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.userId } });
    }

    // Find variant for product + size + color
    let variant = await prisma.productVariant.findFirst({
      where: {
        productId,
        size: size || 'M',
      },
    });

    if (!variant) {
      // Create fallback variant if needed
      variant = await prisma.productVariant.create({
        data: {
          productId,
          sku: `${productId}-${size || 'M'}-${Date.now()}`,
          size: size || 'M',
          color: color || 'Default',
          stock: 10,
        },
      });
    }

    // Upsert cart item
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId: variant.id,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: variant.id,
          quantity: quantity || 1,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Cart synced with database' });
  } catch (error) {
    console.error('[CART/POST]', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE /api/cart — Clear or remove item from user's cart in PostgreSQL DB
export async function DELETE(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get('cartItemId');

    const cart = await prisma.cart.findFirst({ where: { userId: user.userId } });
    if (!cart) {
      return NextResponse.json({ success: true });
    }

    if (cartItemId) {
      await prisma.cartItem.deleteMany({
        where: { id: cartItemId, cartId: cart.id },
      });
    } else {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    return NextResponse.json({ success: true, message: 'Cart updated in database' });
  } catch (error) {
    console.error('[CART/DELETE]', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
