import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get('featured') === 'true';
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const fabric = searchParams.get('fabric');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort'); // 'low-high' | 'high-low' | 'featured'
    
    // Pagination parameters with sanitization
    let page = parseInt(searchParams.get('page') || '1', 10);
    if (isNaN(page) || page < 1) page = 1;

    let limit = parseInt(searchParams.get('limit') || '6', 10);
    if (isNaN(limit) || limit < 1) limit = 6;
    if (limit > 50) limit = 50;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (featured) {
      where.isFeatured = true;
    }

    if (categorySlug && categorySlug !== 'all') {
      where.category = {
        slug: categorySlug,
      };
    }

    if (fabric && fabric !== 'All Fabrics') {
      where.fabric = {
        contains: fabric,
        mode: 'insensitive',
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fabric: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Determine OrderBy
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'low-high') {
      orderBy = { price: 'asc' };
    } else if (sort === 'high-low') {
      orderBy = { price: 'desc' };
    }

    // Total Count for Pagination
    const total = await prisma.product.count({ where });

    // Paginated DB Fetch
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
      },
      skip,
      take: limit,
      orderBy,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      },
    });
  } catch (error) {
    console.error('[PRODUCTS/GET]', error);
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}
