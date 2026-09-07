import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Try exact slug or ID match
    let product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slug },
          { id: slug },
        ],
      },
      include: {
        category: true,
        variants: true,
      },
    });

    // 2. Fallback to case-insensitive partial slug/name match
    if (!product) {
      const cleanSlug = slug.replace(/-/g, ' ');
      product = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: { contains: slug, mode: 'insensitive' } },
            { name: { contains: cleanSlug, mode: 'insensitive' } },
          ],
        },
        include: {
          category: true,
          variants: true,
        },
      });
    }

    // 3. Ultimate fallback: return first product if available
    if (!product) {
      product = await prisma.product.findFirst({
        include: {
          category: true,
          variants: true,
        },
      });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('[PRODUCTS_SLUG/GET]', error);
    return NextResponse.json({ error: 'Failed to fetch product.' }, { status: 500 });
  }
}
