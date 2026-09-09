# 👑 Nooré Couture — Royal Indian Women's Luxury Boutique Store

An ultra-premium, mobile-first E-Commerce web application for high-end Indian luxury fashion, featuring handwoven Banarasi sarees, royal velvet lehengas, and couture Anarkalis. Powered by **Next.js 16**, **React 19**, **Prisma ORM**, **Zustand**, and **Google Gemini AI**.

---

## 💎 Features

### 🛍️ Royal Shopping & UI Experience
- **Luxury Aesthetic**: Curated color palette (`#4A1724` Deep Burgundy, `#D7B982` Royal Gold, `#F6F0E6` Ivory Silk) with serif typography, glassmorphic overlays, and smooth micro-animations.
- **Mobile-First Responsive Layout**: Optimized navigation drawer, bottom sheet filters for quick catalog refining, and responsive 2-column product grids on mobile devices.
- **Interactive Catalog & Multi-Filters**: Filter handcrafted heirlooms by Category (Sarees, Lehengas, Anarkalis, Indo-Western), Fabric, Occasion, Color, and Price range.
- **Dynamic Wishlist & Cart Suite**: Real-time state synchronization using Zustand with persistence.

### 🤖 Nooré AI Couture Stylist
- Integrated **Google Gemini AI** shopping assistant (*Priya*) capable of recommending royal outfits based on wedding themes, body silhouettes, color preferences, and personal style.

### 👤 Customer Suite & Orders
- **User Authentication**: Secure JWT-based authentication supporting both HTTP cookies and Bearer tokens.
- **Account Dashboard**: View active and historical orders with live tracking status, itemized receipts, and saved wishlist items.

### 🛡️ Admin Management Dashboard
- Dedicated administrative control panel (`/admin/dashboard`) to manage inventory, update product listings, view live analytics, and track customer orders.
- Edge/Server request protection via Next.js `proxy.ts` middleware convention.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with Turbopack
- **UI Library**: React 19 & Lucide Icons
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Database & ORM**: PostgreSQL / Supabase via [Prisma ORM v6](https://www.prisma.io/)
- **Authentication**: JWT (`jsonwebtoken`) & `bcryptjs`
- **AI Integration**: `@google/generative-ai` (Gemini AI API)
- **Language**: TypeScript

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **PostgreSQL Database** (e.g., Supabase, Neon, or local PostgreSQL instance)

### 2. Clone the Repository
```bash
git clone https://github.com/Drishti-Rawat/womens-boutique-store.git
cd womens-boutique-store
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in your configuration details:

```env
# Supabase / PostgreSQL Connection Strings
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"

# AI Shopping Assistant (Google Gemini)
GEMINI_API_KEY="your-gemini-api-key"
```

### 5. Setup Database
Run Prisma migrations to initialize the database schema:

```bash
# Push database schema
npx prisma db push
```

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```text
womens-boutique-store/
├── app/                      # Next.js App Router (Pages & API Routes)
│   ├── account/              # User Account Suite & Wishlist
│   ├── admin/                # Admin Panel & Dashboard
│   ├── api/                  # RESTful API Endpoints (Auth, Cart, Orders, AI)
│   ├── catalog/              # Product Catalog & Dynamic Filtering
│   ├── checkout/             # Order Checkout Flow
│   ├── product/[slug]/       # Product Details Page
│   ├── layout.tsx            # Global Root Layout
│   └── page.tsx              # Royal Boutique Landing Page
├── components/               # Reusable React Components
│   ├── admin/                # Admin UI Components
│   ├── ai/                   # AI Stylist Chat Modal
│   ├── layout/               # Header, Footer, Drawer Navigation
│   └── product/              # Product Cards, Filters, Grid Views
├── lib/                      # Database & Backend Utilities (Prisma Client, Auth)
├── prisma/                   # Prisma Schema & Database Seeder Script
│   ├── schema.prisma
│   └── seed.ts
├── store/                    # Zustand Stores (Auth, Cart, Wishlist, UI)
├── types/                    # TypeScript Type Definitions
├── proxy.ts                  # Next.js Request Proxy / Middleware Protection
└── package.json
```

---

## 🏗️ Production Build & Verification

To verify or generate an optimized production bundle:

```bash
# Run TypeScript check and production build
npm run build

# Start production server
npm run start
```

---

## 📌 Project Submission Note

Developed as a full-stack E-Commerce Web Application assignment featuring a luxury responsive UI, Next.js App Router, Prisma ORM, and Google Gemini AI integration.

