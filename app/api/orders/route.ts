import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/orders — Retrieve customer's order history from PostgreSQL DB
export async function GET(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('[ORDERS/GET]', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders — Submit new customer order into PostgreSQL DB
export async function POST(req: NextRequest) {
  try {
    const result = requireAuth(req);
    if (result instanceof NextResponse) return result;
    const { user } = result;

    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      subtotal,
      discount,
      shippingFee,
      total,
      couponCode,
      items,
    } = body;

    if (!customerName || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    const orderNumber = `NOORE-${Date.now().toString().slice(-6)}`;

    // Create Order with OrderItems in PostgreSQL DB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.userId,
        customerName,
        customerEmail: customerEmail || user.email,
        customerPhone: customerPhone || '',
        shippingAddress,
        shippingCity: shippingCity || '',
        shippingState: shippingState || '',
        shippingPincode: shippingPincode || '',
        subtotal: parseFloat(subtotal) || 0,
        discount: parseFloat(discount) || 0,
        shippingFee: parseFloat(shippingFee) || 0,
        total: parseFloat(total) || 0,
        couponCode: couponCode || null,
        paymentStatus: 'PAID',
        orderStatus: 'CONFIRMED',
        items: {
          create: items.map((item: any) => ({
            variantId: item.variantId || 'fallback-variant-id',
            productName: item.name,
            sku: item.slug || 'SKU-HERITAGE',
            color: item.color || 'Royal Maroon',
            size: item.size || 'M',
            purchasePrice: parseFloat(item.price),
            quantity: parseInt(item.quantity, 10),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Clear user cart in PostgreSQL DB after checkout
    const cart = await prisma.cart.findFirst({ where: { userId: user.userId } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('[ORDERS/POST]', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
