import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Header } from '@/components/layout/Header';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'NOORÉ — House of Indian Elegance & AI Stylist',
  description: 'Handcrafted luxury boutique celebrating Indian heritage, Banarasi weaves, and bespoke contemporary couture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased bg-[#F6F0E6] text-[#21191A]">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F6F0E6] text-[#21191A]">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <LoginModal />
          <RegisterModal />
          <CartDrawer />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
