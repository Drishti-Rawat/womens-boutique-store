import type { Metadata } from 'next';
import '../globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'Checkout — NOORÉ',
  description: 'Complete your NOORÉ boutique order securely.',
};

/**
 * Checkout layout — intentionally does NOT include the site Header or CartDrawer.
 * This gives the checkout flow a focused, distraction-free environment.
 */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <LoginModal />
      <RegisterModal />
      <ToastContainer />
    </AuthProvider>
  );
}
