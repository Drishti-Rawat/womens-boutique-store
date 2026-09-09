'use client';

import { useChatStore } from '@/store/chatStore';

export function ChatButton() {
  const { isOpen, toggleChat, messages } = useChatStore();

  // Count unread messages (assistant messages after last open)
  const hasUnread = !isOpen && messages.filter((m) => m.role === 'assistant' && m.id !== 'welcome').length > 0;

  return (
    <button
      id="chat-toggle-button"
      onClick={toggleChat}
      aria-label={isOpen ? 'Close style advisor' : 'Open style advisor — chat with Priya'}
      aria-expanded={isOpen}
      className="fixed bottom-6 right-4 sm:right-6 z-50 group"
    >
      {/* Glow ring */}
      <span
        className={`absolute inset-0 rounded-full ${!isOpen ? 'animate-ping-slow' : ''} bg-[#D7B982]/20`}
        style={{ borderRadius: '50%' }}
        aria-hidden="true"
      />

      {/* Main button */}
      <div
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? 'bg-[#21191A] rotate-45'
            : 'bg-[#4A1724] hover:bg-[#3a1220] hover:scale-105 active:scale-95'
        }`}
        style={{
          boxShadow: isOpen
            ? '0 4px 20px rgba(33,25,26,0.4)'
            : '0 4px 24px rgba(74,23,36,0.5), 0 0 0 1px rgba(215,185,130,0.3)',
        }}
      >
        {isOpen ? (
          /* Close X */
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D7B982"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          /* Sparkle / chat icon */
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D7B982"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M9 9h.01M12 9h.01M15 9h.01" strokeWidth="2.5" />
          </svg>
        )}
      </div>

      {/* Unread dot */}
      {hasUnread && !isOpen && (
        <span
          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#D7B982] border-2 border-[#F6F0E6] flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A1724]" />
        </span>
      )}

      {/* Tooltip label */}
      {!isOpen && (
        <span
          className="absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-[#21191A] text-[#D7B982] text-[10px] tracking-wider font-sans whitespace-nowrap rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          aria-hidden="true"
        >
          Chat with Priya ✨
        </span>
      )}
    </button>
  );
}
