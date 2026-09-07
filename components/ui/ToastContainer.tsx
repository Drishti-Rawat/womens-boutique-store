'use client';

import { useUIStore } from '@/store/uiStore';

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-amber-700/40 bg-stone-900/95 text-amber-100';
        let badgeBg = 'bg-amber-600/20 text-amber-300';
        let typeLabel = 'INFO';

        if (toast.type === 'success') {
          borderClass = 'border-emerald-600/40 bg-stone-900/95 text-emerald-100';
          badgeBg = 'bg-emerald-600/20 text-emerald-300';
          typeLabel = 'SUCCESS';
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-600/40 bg-stone-900/95 text-rose-100';
          badgeBg = 'bg-rose-600/20 text-rose-300';
          typeLabel = 'ERROR';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-lg border backdrop-blur-md shadow-2xl transition-all transform duration-300 animate-slide-up ${borderClass}`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded uppercase ${badgeBg}`}>
                {typeLabel}
              </span>
              <p className="text-sm font-medium tracking-wide">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white transition-colors ml-4 text-xs"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
