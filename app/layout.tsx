import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Header } from '@/components/layout/Header';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'Roopkala Royale — Luxury Women\'s Boutique & AI Assistant',
  description: 'Heritage Indian Retro & Contemporary Haute Couture for Royalty',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased bg-stone-950 text-stone-100">
      <body className="min-h-full flex flex-col font-sans bg-stone-950 text-stone-100">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <LoginModal />
          <RegisterModal />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
