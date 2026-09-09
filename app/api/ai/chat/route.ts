import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const MODEL = 'gemini-3.5-flash';

const STORE_POLICY = `
NOORÉ Boutique Policies:
- Shipping: Rs.99 flat. Free above Rs.2,500.
- Delivery: 5-7 business days across India.
- Returns: Within 7 days. Item must be unused, unwashed, with tags.
- Exchange: Free size exchange within 7 days.
- COD: Not available. UPI, debit/credit cards, net banking accepted.
- Cancellations: Before shipping only.
- Authenticity: All pieces handcrafted or curated by Indian artisans.
- Customer Care: Mon-Sat, 10am-6pm IST.
`.trim();

const VALID_CATEGORIES = ['Sarees', 'Kurtis', 'Lehengas', 'Dupattas', 'Jewellery', 'Accessories'];

// ─── Keyword extractor (no LLM needed) ───────────────────────────────────────
function extractKeywords(message: string): string {
  const stopWords = new Set([
    'show','me','i','want','need','looking','for','something','any','what',
    'do','you','have','can','please','some','a','an','the','get','find',
    'give','tell','ok','okay','hi','hello','hey','under','above','below',
    'around','price','rs','rupees','inr','is','this','that','those','these',
    'outfit','outfits','attire','clothes','clothing','wear','dress',
  ]);
  return message.toLowerCase()
    .replace(/[₹,]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w) && isNaN(Number(w)))
    .slice(0, 5)
    .join(' ') || message.slice(0, 60);
}

// ─── Parse intent from message (regex/heuristic — zero LLM cost) ─────────────
function parseIntent(message: string): {
  intent: 'product_search' | 'store_policy' | 'general';
  category: string | null;
  maxPrice: number | null;
  minPrice: number | null;
  color: string | null;
  size: string | null;
  keywords: string;
} {
  const lower = message.toLowerCase();

  // Policy keywords
  const policyWords = ['shipping','delivery','return','refund','exchange','cancel','cod','cash on delivery','authentic','customer care','support','policy'];
  if (policyWords.some((w) => lower.includes(w))) {
    return { intent: 'store_policy', category: null, maxPrice: null, minPrice: null, color: null, size: null, keywords: '' };
  }

  // Greeting / general
  const greetWords = ['hello','hi ','hey ','thanks','thank you','bye','good morning','good evening'];
  if (greetWords.some((w) => lower.includes(w)) && lower.split(' ').length < 5) {
    return { intent: 'general', category: null, maxPrice: null, minPrice: null, color: null, size: null, keywords: '' };
  }

  // Category detection
  let category: string | null = null;
  for (const cat of VALID_CATEGORIES) {
    if (lower.includes(cat.toLowerCase())) { category = cat; break; }
  }

  // Price detection: "under X", "below X", "less than X", "upto X"
  let maxPrice: number | null = null;
  let minPrice: number | null = null;
  const maxMatch = lower.match(/(?:under|below|less than|upto|up to|within)\s*(?:rs\.?|inr|₹)?\s*([\d,]+)/);
  if (maxMatch) maxPrice = parseInt(maxMatch[1].replace(/,/g, ''), 10);
  const minMatch = lower.match(/(?:above|over|more than|at least)\s*(?:rs\.?|inr|₹)?\s*([\d,]+)/);
  if (minMatch) minPrice = parseInt(minMatch[1].replace(/,/g, ''), 10);
  // Also handle "₹5000" or "Rs 5000" standalone
  const priceMatch = lower.match(/(?:rs\.?|inr|₹)\s*([\d,]+)/);
  if (priceMatch && !maxPrice && !minPrice) maxPrice = parseInt(priceMatch[1].replace(/,/g, ''), 10);

  // Color detection
  const colors = ['red','blue','green','pink','yellow','orange','purple','white','black','ivory','cream','gold','silver','maroon','burgundy','rose','peach','coral','teal','navy','grey','gray','beige','pastel','nude','brown','mustard','rust','olive'];
  const color = colors.find((c) => lower.includes(c)) || null;

  // Size detection
  const sizeMap: Record<string, string> = { 'xs': 'XS', 's': 'S', 'm': 'M', 'l': 'L', 'xl': 'XL', 'xxl': 'XXL', 'free size': 'Free Size' };
  let size: string | null = null;
  for (const [k, v] of Object.entries(sizeMap)) {
    if (new RegExp(`\\b${k}\\b`).test(lower)) { size = v; break; }
  }

  return {
    intent: 'product_search',
    category,
    maxPrice,
    minPrice,
    color,
    size,
    keywords: extractKeywords(message),
  };
}

// ─── DB query with progressive fallback ──────────────────────────────────────
async function fetchProducts(parsed: ReturnType<typeof parseIntent>, userMessage: string) {
  const base = { isAvailable: true };

  async function query(where: Record<string, unknown>) {
    return prisma.product.findMany({
      where: { ...base, ...where },
      include: { category: true, variants: true },
      take: 5,
      orderBy: { isFeatured: 'desc' },
    });
  }

  const priceFilter = parsed.maxPrice || parsed.minPrice
    ? { price: { ...(parsed.maxPrice ? { lte: parsed.maxPrice } : {}), ...(parsed.minPrice ? { gte: parsed.minPrice } : {}) } }
    : {};

  const categoryFilter = parsed.category ? { category: { name: parsed.category } } : {};

  const keywordOR = (term: string) => ({
    OR: [
      { name: { contains: term, mode: 'insensitive' as const } },
      { description: { contains: term, mode: 'insensitive' as const } },
      { fabric: { contains: term, mode: 'insensitive' as const } },
    ],
  });

  const variantFilter = (parsed.color || parsed.size) ? {
    variants: {
      some: {
        ...(parsed.color ? { color: { contains: parsed.color, mode: 'insensitive' as const } } : {}),
        ...(parsed.size ? { size: { equals: parsed.size, mode: 'insensitive' as const } } : {}),
      },
    },
  } : {};

  // 1. All filters
  let r = await query({ ...categoryFilter, ...priceFilter, ...variantFilter, ...(parsed.keywords ? keywordOR(parsed.keywords) : {}) });
  if (r.length) return { products: r, exact: true };

  // 2. Drop variant filter
  r = await query({ ...categoryFilter, ...priceFilter, ...(parsed.keywords ? keywordOR(parsed.keywords) : {}) });
  if (r.length) return { products: r, exact: true };

  // 3. Drop category, use keywords + price
  if (parsed.keywords) {
    r = await query({ ...priceFilter, ...keywordOR(parsed.keywords) });
    if (r.length) return { products: r, exact: false };
  }

  // 4. Raw user message keywords
  const rawKeywords = extractKeywords(userMessage);
  if (rawKeywords !== parsed.keywords) {
    r = await query({ ...priceFilter, ...keywordOR(rawKeywords) });
    if (r.length) return { products: r, exact: false };
  }

  // 5. Price only
  if (parsed.maxPrice || parsed.minPrice) {
    r = await query(priceFilter);
    if (r.length) return { products: r, exact: false };
  }

  // 6. Featured fallback
  r = await query({ isFeatured: true });
  if (r.length) return { products: r, exact: false };

  // 7. Any products
  r = await prisma.product.findMany({ where: base, include: { category: true, variants: true }, take: 4, orderBy: { createdAt: 'desc' } });
  return { products: r, exact: false };
}

// ─── Build product context ────────────────────────────────────────────────────
function buildContext(products: Awaited<ReturnType<typeof fetchProducts>>['products'], exact: boolean) {
  if (!products.length) return 'No products available right now.';
  const note = exact ? '' : '(Showing our featured collection — no exact match found for this specific request)\n\n';
  return note + products.map((p) => {
    const colors = [...new Set(p.variants.map((v) => v.color))];
    const sizes = [...new Set(p.variants.map((v) => v.size))];
    const inStock = p.variants.filter((v) => v.stock > 0);
    return [
      `Name: ${p.name} | ID: ${p.id}`,
      `Category: ${p.category.name} | Price: Rs.${p.price}${p.salePrice ? ` (sale Rs.${p.salePrice})` : ''}`,
      `Colors: ${colors.join(', ')} | Sizes: ${sizes.join(', ')}`,
      `In stock: colors=${[...new Set(inStock.map(v => v.color))].join(', ')||'none'}, sizes=${[...new Set(inStock.map(v => v.size))].join(', ')||'none'}`,
      `Desc: ${p.description.slice(0, 150)}`,
    ].join('\n');
  }).join('\n\n---\n\n');
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: Array<{ role: 'user' | 'assistant'; content: string }> };

    if (!messages?.length) return NextResponse.json({ error: 'messages required.' }, { status: 400 });

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'user') return NextResponse.json({ error: 'Last message must be from user.' }, { status: 400 });

    const userText = lastMsg.content.trim();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ message: 'AI not configured.' }, { status: 503 });

    // History for context (last 6 exchanges)
    const historyText = messages.slice(-13, -1)
      .map((m) => `${m.role === 'user' ? 'User' : 'Priya'}: ${m.content}`)
      .join('\n');

    // Parse intent — zero LLM cost
    const parsed = parseIntent(userText);

    // Fetch products (only for product intents)
    let products: Awaited<ReturnType<typeof fetchProducts>>['products'] = [];
    let exact = true;
    if (parsed.intent === 'product_search') {
      const result = await fetchProducts(parsed, userText);
      products = result.products;
      exact = result.exact;
    }

    // Build prompt & call Gemini ONCE
    const productContext = parsed.intent === 'product_search' ? buildContext(products, exact) : '';

    const prompt = `You are Priya, warm personal style advisor at NOORE boutique (luxury Indian women's fashion).

Tone: Warm, graceful, editorial. Use occasional Hindi words naturally (sundaar, ekdum, bilkul). Short sentences. No bullet lists unless listing features.

${STORE_POLICY}

${productContext ? `PRODUCT CONTEXT (use ONLY these — never invent products):\n${productContext}` : ''}

RULES:
1. If products are listed above, ALWAYS recommend them. Never say "we don't have" when products ARE listed.
2. If context says "(Showing featured collection)", present warmly as "let me show you some beautiful pieces from our collection."
3. Never mention product IDs.
4. For policy questions, answer from Store Policies only.
5. Keep replies under 100 words.

${historyText ? `Conversation so far:\n${historyText}\n` : ''}
User: ${userText}
Priya:`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);
    const replyText = result.response.text().trim();

    return NextResponse.json({
      message: replyText,
      intent: parsed.intent,
      ...(products.length > 0 && { products: products.map((p) => p.id) }),
    });

  } catch (err) {
    console.error('[AI/CHAT]', (err as Error).message);
    return NextResponse.json(
      { message: "I'm having a quiet moment. Please try again shortly." },
      { status: 500 }
    );
  }
}
