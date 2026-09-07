'use client';

import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';

export default function Home() {
  const { user } = useAuthStore();
  const { openModal } = useUIStore();

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-stone-950 text-stone-100 flex flex-col justify-center items-center px-6 overflow-hidden">
      {/* Decorative Royal Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-900/30 via-yellow-700/20 to-rose-900/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-4xl text-center space-y-6 animate-fade-in py-12">
        {/* Crown Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
          <span>👑</span> Roopkala Royale Haute Couture
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-500 font-bold leading-tight">
          Timeless Royal Elegance <br /> &amp; Bespoke Luxury
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-400 font-light leading-relaxed">
          Step into a sanctuary of handcrafted Banarasi silk sarees, embroidered royal lehengas, and contemporary bespoke boutique fashion.
        </p>

        {/* Auth Status & Quick Action Hero Card */}
        <div className="pt-6">
          {user ? (
            <div className="inline-block p-6 rounded-2xl bg-stone-900/90 border border-amber-500/40 backdrop-blur-md shadow-2xl text-left max-w-md w-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-stone-950 font-bold text-base uppercase">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-amber-200">{user.name}</h3>
                  <p className="text-xs text-stone-400">{user.email}</p>
                </div>
              </div>
              <div className="text-xs text-amber-400/90 bg-amber-950/40 p-3 rounded-lg border border-amber-500/20 mb-4">
                ✨ Privilege Pass Activated &bull; Role: <span className="font-bold">{user.role}</span>
              </div>
              <p className="text-xs text-stone-400">
                You are currently authenticated via JWT HTTP interceptor with in-memory token state management.
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => openModal('login')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-950/40"
              >
                Sign In to Privilege Account
              </button>
              <button
                onClick={() => openModal('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900 border border-amber-500/40 hover:border-amber-400 text-amber-200 font-semibold text-xs uppercase tracking-widest transition-all backdrop-blur-md"
              >
                Join Privilege Club
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
