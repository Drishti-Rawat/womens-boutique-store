'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useChatStore, type ChatMessage } from '@/store/chatStore';
import { ChatProductCard } from './ChatProductCard';
import { SuggestedQuestions } from './SuggestedQuestions';

// ─── Scrollable product strip with arrow buttons + wheel support ──────────────
function ProductStrip({ productIds }: { productIds: string[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    // Slight delay so cards have time to render and measure
    const t = setTimeout(checkScroll, 300);
    return () => clearTimeout(t);
  }, [productIds, checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    stripRef.current?.scrollBy({ left: dir === 'left' ? -148 : 148, behavior: 'smooth' });
  };

  // Convert vertical wheel to horizontal scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    stripRef.current?.scrollBy({ left: e.deltaY * 1.5, behavior: 'auto' });
  };

  return (
    <div className="relative w-full">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#4A1724]/80 text-[#D7B982] flex items-center justify-center shadow-md hover:bg-[#4A1724] transition-colors -ml-1"
          aria-label="Scroll left"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      )}

      {/* Scrollable strip */}
      <div
        ref={stripRef}
        onScroll={checkScroll}
        onWheel={handleWheel}
        className="flex gap-2 overflow-x-auto pb-1 px-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {productIds.map((id) => (
          <ChatProductCard key={id} productId={id} />
        ))}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#4A1724]/80 text-[#D7B982] flex items-center justify-center shadow-md hover:bg-[#4A1724] transition-colors -mr-1"
          aria-label="Scroll right"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      )}
    </div>
  );
}

// ─── Typing indicator ────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-[#4A1724] flex items-center justify-center flex-shrink-0 text-[10px] text-[#D7B982] font-serif font-bold">
        P
      </div>
      <div className="bg-white border border-[#D7B982]/40 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B98282] typing-dot" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#B98282] typing-dot" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#B98282] typing-dot" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

// ─── Single message bubble ────────────────────────────────────────────────────
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex items-end gap-2 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#4A1724] flex items-center justify-center flex-shrink-0 text-[10px] text-[#D7B982] font-serif font-bold">
          P
        </div>
      )}

      <div className={`flex flex-col gap-2 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Text bubble */}
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-[12.5px] leading-relaxed whitespace-pre-wrap font-sans ${
            isUser
              ? 'bg-[#4A1724] text-[#F6F0E6] rounded-br-sm'
              : 'bg-white border border-[#D7B982]/40 text-[#21191A] rounded-bl-sm shadow-sm'
          }`}
        >
          {message.content}
        </div>

        {/* Product cards strip */}
        {message.products && message.products.length > 0 && (
          <div className="w-full">
            <ProductStrip productIds={message.products} />
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[9px] text-[#B98282] px-1">
          {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// ─── Chat Window ──────────────────────────────────────────────────────────────
export function ChatWindow() {
  const { isOpen, messages, isTyping, sendMessage, clearHistory } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Show suggested questions only when just the welcome message is present
  const showSuggestions = messages.length === 1 && messages[0].id === 'welcome';

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;
    setInputValue('');
    sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col chat-window-slide"
      style={{
        width: 'min(380px, calc(100vw - 24px))',
        height: 'min(560px, calc(100vh - 120px))',
      }}
      role="dialog"
      aria-label="AI Shopping Assistant"
      aria-modal="true"
    >
      {/* Outer border — gold ornamental frame */}
      <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl border border-[#D7B982]/60 bg-[#F6F0E6]"
        style={{ boxShadow: '0 8px 40px rgba(74,23,36,0.18), 0 1px 0 rgba(215,185,130,0.4)' }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#4A1724] border-b border-[#D7B982]/30">
          <div className="flex items-center gap-2.5">
            {/* Ornament */}
            <div className="w-8 h-8 rounded-full bg-[#D7B982]/20 border border-[#D7B982]/40 flex items-center justify-center text-[#D7B982] text-sm font-serif font-bold">
              N
            </div>
            <div>
              <p className="text-[13px] font-serif text-[#F6F0E6] leading-none">Priya</p>
              <p className="text-[9px] text-[#D7B982]/70 tracking-widest uppercase">Style Advisor · NOORÉ</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Online indicator */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#69705A] animate-pulse" />
            <button
              onClick={clearHistory}
              title="Clear conversation"
              className="text-[#D7B982]/50 hover:text-[#D7B982] transition-colors p-1 text-xs rounded"
              aria-label="Clear conversation"
            >
              ↺
            </button>
          </div>
        </div>

        {/* ── Thin gold ornamental line ───────────────────────────────────── */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#D7B982]/50 to-transparent" />

        {/* ── Messages area ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 chat-scrollbar">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}

          {/* Suggested questions overlay (shown after welcome) */}
          {showSuggestions && !isTyping && (
            <SuggestedQuestions
              onSelect={(q) => {
                setInputValue('');
                sendMessage(q);
              }}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Thin divider ───────────────────────────────────────────────── */}
        <div className="h-px bg-[#D7B982]/20" />

        {/* ── Input area ─────────────────────────────────────────────────── */}
        <div className="px-3 py-3 bg-[#FAF6EF]">
          <div className="flex items-end gap-2 bg-white border border-[#D7B982]/40 rounded-xl px-3 py-2 focus-within:border-[#4A1724]/40 transition-colors">
            <textarea
              ref={inputRef}
              id="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything…"
              rows={1}
              disabled={isTyping}
              className="flex-1 resize-none text-[12.5px] text-[#21191A] placeholder-[#B98282]/60 bg-transparent outline-none font-sans leading-relaxed max-h-20 overflow-y-auto disabled:opacity-50"
              style={{ scrollbarWidth: 'none' }}
              aria-label="Chat input"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#4A1724] disabled:bg-[#4A1724]/30 text-[#D7B982] disabled:text-[#D7B982]/40 flex items-center justify-center transition-all duration-150 hover:bg-[#3a1220] active:scale-95"
              aria-label="Send message"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[9px] text-[#B98282]/50 mt-1.5 font-sans">
            Powered by NOORÉ AI · Priya knows our collection
          </p>
        </div>
      </div>
    </div>
  );
}
