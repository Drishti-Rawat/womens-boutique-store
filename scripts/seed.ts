import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌸 Seeding NOORÉ Boutique Database with 12+ 8K ultra-luxury silhouettes...');

  // 1. Seed Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@noore.com' },
    update: { password: adminPassword },
    create: {
      name: 'Nooré Royal Admin',
      email: 'admin@noore.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'priya@example.com' },
    update: { password: customerPassword },
    create: {
      name: 'Maharani Priya',
      email: 'priya@example.com',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  // 2. Seed Categories
  const categoriesData = [
    { name: 'Heritage Sarees', slug: 'sarees', image: '/images/hero_palace.jpg' },
    { name: 'Royal Lehengas', slug: 'lehengas', image: '/images/lehenga_royal.jpg' },
    { name: 'Anarkalis & Kurtas', slug: 'anarkalis', image: '/images/anarkali_luxe.jpg' },
    { name: 'Couture Co-ords', slug: 'co-ords', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' },
    { name: 'Dupattas & Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800' },
  ];

  const categoriesMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, image: cat.image },
      create: cat,
    });
    categoriesMap[cat.slug] = created.id;
  }

  // 3. Seed 12 Luxury DB Products
  const productsData = [
    {
      name: 'Gulnaar Banarasi Saree',
      slug: 'gulnaar-banarasi-saree',
      description: 'Handcrafted deep burgundy velvet Banarasi saree with heavy gold zari embroidery, captured in ancient Rajasthan palace sunbeams.',
      price: 6890,
      salePrice: 8500,
      images: ['/images/hero_palace.jpg', '/images/lehenga_royal.jpg'],
      fabric: 'Banarasi Silk • Zari Weave',
      isFeatured: true,
      categorySlug: 'sarees',
    },
    {
      name: 'Zara Velvet Bridal Lehenga',
      slug: 'zara-bridal-lehenga',
      description: 'Royal deep wine velvet lehenga featuring opulent heritage zardozi motifs, heavy zari embroidery, and double dupatta.',
      price: 14990,
      salePrice: 18990,
      images: ['/images/lehenga_royal.jpg', '/images/hero_palace.jpg'],
      fabric: 'Royal Velvet • Zardozi Embroidery',
      isFeatured: true,
      categorySlug: 'lehengas',
    },
    {
      name: 'Arohi Sage Silk Anarkali',
      slug: 'arohi-silk-anarkali',
      description: 'Sage olive silk Chanderi Anarkali with subtle champagne threadwork and matching flared border.',
      price: 5290,
      salePrice: 6990,
      images: ['/images/anarkali_luxe.jpg', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'],
      fabric: 'Sage Olive Raw Silk • Gold Threadwork',
      isFeatured: true,
      categorySlug: 'anarkalis',
    },
    {
      name: 'Ruhani Tissue Organza Saree',
      slug: 'ruhani-tissue-saree',
      description: 'Antique ivory tissue organza saree with delicate hand-block floral motifs and dusty rose border.',
      price: 5990,
      salePrice: 7990,
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', '/images/hero_palace.jpg'],
      fabric: 'Tissue Organza • Delicate Border',
      isFeatured: true,
      categorySlug: 'sarees',
    },
    {
      name: 'Meher Ivory Silk Co-ord',
      slug: 'meher-ivory-coord',
      description: 'Contemporary antique ivory silk co-ord set with minimalist collar embroidery and tailored trousers.',
      price: 4490,
      salePrice: 6000,
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800', '/images/anarkali_luxe.jpg'],
      fabric: 'Pure Raw Silk • Minimalist Stitching',
      isFeatured: true,
      categorySlug: 'co-ords',
    },
    {
      name: 'Suhani Velvet Anarkali',
      slug: 'suhani-velvet-anarkali',
      description: 'Plum burgundy flared velvet Anarkali featuring intricate Marodi hand embroidery along the hemlines.',
      price: 8990,
      salePrice: 11990,
      images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800', '/images/lehenga_royal.jpg'],
      fabric: 'Plum Velvet • Marodi Needlework',
      isFeatured: true,
      categorySlug: 'anarkalis',
    },
    {
      name: 'Kashvi Crimson Kanjivaram Saree',
      slug: 'kashvi-kanjivaram-saree',
      description: 'Traditional crimson red Kanjivaram silk saree with heavy temple borders and zari pallu.',
      price: 11890,
      salePrice: 14500,
      images: ['/images/hero_palace.jpg', '/images/lehenga_royal.jpg'],
      fabric: 'Pure Kanjivaram Silk • Gold Zari',
      isFeatured: false,
      categorySlug: 'sarees',
    },
    {
      name: 'Ananya Emerald Velvet Lehenga',
      slug: 'ananya-emerald-lehenga',
      description: 'Opulent emerald green velvet lehenga adorned with antique silver zardozi and mirror work.',
      price: 16990,
      salePrice: 19990,
      images: ['/images/lehenga_royal.jpg', '/images/anarkali_luxe.jpg'],
      fabric: 'Royal Velvet • Silver Zardozi',
      isFeatured: false,
      categorySlug: 'lehengas',
    },
    {
      name: 'Ina Champagne Silk Kurta Set',
      slug: 'ina-champagne-kurta',
      description: 'Champagne gold raw silk kurta set with pearls along the neckline and sheer organza dupatta.',
      price: 5490,
      salePrice: 7200,
      images: ['/images/anarkali_luxe.jpg', '/images/hero_palace.jpg'],
      fabric: 'Raw Silk • Pearl Handwork',
      isFeatured: false,
      categorySlug: 'anarkalis',
    },
    {
      name: 'Rahani Rose Silk Cocktail Dress',
      slug: 'rahani-rose-dress',
      description: 'Dusty rose Indian fusion silk dress with sculpted pleats and hand-embroidered waist belt.',
      price: 7560,
      salePrice: 9500,
      images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'],
      fabric: 'Dusty Rose Chanderi • Belt Detail',
      isFeatured: false,
      categorySlug: 'co-ords',
    },
    {
      name: 'Vanya Gold Zardozi Dupatta',
      slug: 'vanya-zardozi-dupatta',
      description: 'Heavy gold zardozi embroidered tissue dupatta designed to elevate any traditional outfit.',
      price: 3490,
      salePrice: 4800,
      images: ['https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800'],
      fabric: 'Tissue Silk • Heavy Zardozi',
      isFeatured: false,
      categorySlug: 'accessories',
    },
    {
      name: 'Tarini Pearl & Kundan Belt',
      slug: 'tarini-kundan-belt',
      description: 'Handcrafted waist belt studded with Kundan stones and freshwater pearl drops.',
      price: 2890,
      salePrice: 3500,
      images: ['https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800'],
      fabric: 'Antique Brass • Kundan & Pearls',
      isFeatured: false,
      categorySlug: 'accessories',
    },
  ];

  for (const prod of productsData) {
    const { categorySlug, ...rest } = prod;
    const categoryId = categoriesMap[categorySlug];

    const product = await prisma.product.upsert({
      where: { slug: rest.slug },
      update: {
        name: rest.name,
        description: rest.description,
        price: rest.price,
        salePrice: rest.salePrice,
        images: rest.images,
        fabric: rest.fabric,
        isFeatured: rest.isFeatured,
        categoryId,
      },
      create: {
        name: rest.name,
        slug: rest.slug,
        description: rest.description,
        price: rest.price,
        salePrice: rest.salePrice,
        images: rest.images,
        fabric: rest.fabric,
        isFeatured: rest.isFeatured,
        categoryId,
        variants: {
          create: [
            { sku: `${rest.slug}-s`, size: 'S', color: 'Bespoke Hue', stock: 15 },
            { sku: `${rest.slug}-m`, size: 'M', color: 'Bespoke Hue', stock: 20 },
            { sku: `${rest.slug}-l`, size: 'L', color: 'Bespoke Hue', stock: 10 },
            { sku: `${rest.slug}-xl`, size: 'XL', color: 'Bespoke Hue', stock: 5 },
          ],
        },
      },
    });

    console.log(`✨ Seeded 8K product: ${product.name} (₹${product.price})`);
  }

  console.log('✅ NOORÉ 12+ Product Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
