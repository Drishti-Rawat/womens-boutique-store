'use client';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SUGGESTIONS = [
  { icon: '💍', text: 'Show me wedding outfits under ₹5,000' },
  { icon: '🌸', text: 'I love pastel colours — what do you have?' },
  { icon: '🥻', text: 'What handcrafted sarees are in stock?' },
  { icon: '📦', text: 'What\'s your return & shipping policy?' },
];

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="px-3 pb-3 space-y-2">
      <p className="text-[10px] uppercase tracking-widest text-[#B98282] font-sans mb-2">
        Suggested questions
      </p>
      <div className="flex flex-col gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            onClick={() => onSelect(s.text)}
            className="flex items-start gap-2 px-3 py-2 rounded-lg border border-[#D7B982]/50 bg-[#FAF6EF] hover:bg-[#F0E6D3] hover:border-[#D7B982] text-left transition-all duration-150 group"
          >
            <span className="text-sm mt-0.5 flex-shrink-0">{s.icon}</span>
            <span className="text-[11px] text-[#21191A] leading-snug font-sans group-hover:text-[#4A1724] transition-colors">
              {s.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
