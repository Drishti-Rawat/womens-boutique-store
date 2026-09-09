/**
 * Chat Store — manages AI shopping assistant conversation state.
 * Session-only: history resets on page refresh (intentional).
 */
import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: string[]; // Product IDs returned by AI — rendered as cards
  isLoading?: boolean;
  timestamp: Date;
}

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  error: string | null;

  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
}

// Welcome message shown on first open
const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Namaste! I'm Priya, your personal style advisor at NOOR\u00c9. \u2728 I can help you discover handcrafted pieces, check availability, or simply guide you through our collection. What are you looking for today?",
  timestamp: new Date(),
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  messages: [WELCOME_MESSAGE],
  isTyping: false,
  error: null,

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  clearHistory: () =>
    set({
      messages: [WELCOME_MESSAGE],
      error: null,
    }),

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Optimistically add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
      error: null,
    }));

    try {
      // Build history for the API (exclude the welcome message and loading stubs)
      const { messages } = get();
      const history = messages
        .filter((m) => m.id !== 'welcome' && !m.isLoading)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content:
          data.message ||
          "I'm having a quiet moment. Please try again shortly.",
        products: data.products?.length ? data.products : undefined,
        timestamp: new Date(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isTyping: false,
      }));
    } catch {
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: generateId(),
            role: 'assistant',
            content:
              'Something went wrong on my end. Please try again in a moment.',
            timestamp: new Date(),
          },
        ],
        isTyping: false,
        error: 'Failed to reach the AI assistant.',
      }));
    }
  },
}));
