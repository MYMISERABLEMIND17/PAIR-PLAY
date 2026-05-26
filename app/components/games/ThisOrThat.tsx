"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ThisOrThatProps {
  currentPrompt: {
    id: string;
    optionA: string;
    optionB: string;
    category?: string;
  };
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  answers: Record<string, string>;
  userId: string | null;
  partnerId: string | null;
  onSubmitAnswer: (text: string) => void;
  sendReaction: (type: string) => void;
  state?: any;
}

const categoryIcons: Record<string, string> = {
  Popular: "👑",
  Food: "🍔",
  Travel: "✈️",
  Movies: "🎬",
  Music: "🎵",
  Relationships: "💏",
  Hypothetical: "🔮",
  Party: "🥳"
};

const categoryGradients: Record<string, { theme: string; border: string; bg: string; text: string; glow: string }> = {
  Popular: {
    theme: "from-amber-500 to-yellow-500",
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]"
  },
  Food: {
    theme: "from-orange-500 to-amber-500",
    border: "border-orange-500/20",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.2)]"
  },
  Travel: {
    theme: "from-emerald-500 to-teal-500",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]"
  },
  Movies: {
    theme: "from-sky-500 to-blue-500",
    border: "border-sky-500/20",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    glow: "shadow-[0_0_30px_rgba(14,165,233,0.2)]"
  },
  Music: {
    theme: "from-purple-500 to-indigo-500",
    border: "border-purple-500/20",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.2)]"
  },
  Relationships: {
    theme: "from-pink-500 to-rose-500",
    border: "border-pink-500/20",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    glow: "shadow-[0_0_30px_rgba(236,72,153,0.2)]"
  },
  Hypothetical: {
    theme: "from-indigo-500 to-violet-500",
    border: "border-indigo-500/20",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    glow: "shadow-[0_0_30px_rgba(99,102,241,0.2)]"
  },
  Party: {
    theme: "from-red-500 to-rose-500",
    border: "border-red-500/20",
    bg: "bg-red-500/10",
    text: "text-red-400",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.2)]"
  }
};

export default function ThisOrThat({
  currentPrompt,
  answers,
  userId,
  partnerId,
  onSubmitAnswer,
  onNext,
  sendReaction
}: ThisOrThatProps) {
  const myAnswer = userId ? answers[userId] : null;
  const partnerAnswer = partnerId ? answers[partnerId] : null;
  
  const hasBothAnswered = !!myAnswer && !!partnerAnswer;
  const hasIAnswered = !!myAnswer;
  const hasPartnerAnswered = !!partnerAnswer;

  const isMatch = hasBothAnswered && myAnswer === partnerAnswer;

  // Track selection state locally for micro-animations
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    // Reset local selection when question changes
    setSelectedOption(myAnswer);
  }, [currentPrompt.id, myAnswer]);

  const handleSelect = (option: "A" | "B") => {
    if (hasIAnswered) return;
    const value = option === "A" ? currentPrompt.optionA : currentPrompt.optionB;
    setSelectedOption(value);
    onSubmitAnswer(value);
    sendReaction("heart");
  };

  const category = currentPrompt.category || "Popular";
  const catIcon = categoryIcons[category] || "⚡";
  const themeConfig = categoryGradients[category] || categoryGradients.Popular;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center">
      
      {/* Title Header */}
      <div className="text-center mb-8">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border bg-black/40 ${themeConfig.border} ${themeConfig.text}`}>
          {catIcon} {category} Deck
        </span>
        <h2 className="text-2xl font-extrabold mt-4 text-white font-extrabold">
          Which one do you prefer?
        </h2>
      </div>

      {/* Main Choice Split Arena */}
      <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 relative mb-8">

        {/* Option A (Left/Top) */}
        <motion.button
          onClick={() => handleSelect("A")}
          disabled={hasIAnswered}
          whileHover={!hasIAnswered ? { scale: 1.02, y: -2 } : {}}
          whileTap={!hasIAnswered ? { scale: 0.98 } : {}}
          className={`relative flex-1 group overflow-hidden min-h-[160px] md:min-h-[180px] rounded-3xl p-6 border text-left flex flex-col justify-between transition-all duration-300 ${
            myAnswer === currentPrompt.optionA
              ? `bg-gradient-to-br from-amber-500/15 to-transparent border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]`
              : hasIAnswered
              ? "bg-white/[0.01] border-white/5 opacity-50"
              : "bg-white/[0.02] border-white/10 hover:border-amber-500/40 hover:bg-white/[0.04]"
          }`}
        >
          {/* Subtle Back Glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-full blur-xl group-hover:from-amber-500/10 transition-colors" />

          {/* Option Label */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500/60 group-hover:text-amber-500 transition-colors">
            Option A
          </span>

          <div className="my-auto pt-2 pb-4">
            <span className="text-2xl md:text-3xl font-black text-white font-extrabold group-hover:text-white leading-tight">
              {currentPrompt.optionA}
            </span>
          </div>

          {/* Choice status indicator */}
          <div className="flex items-center gap-2">
            {myAnswer === currentPrompt.optionA ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Selected
              </span>
            ) : hasIAnswered ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 font-semibold">
                Not chosen
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 font-bold group-hover:text-white/80 transition-colors">
                Tap to Select
              </span>
            )}
          </div>
        </motion.button>

        {/* First-class flex divider preventing overlapping */}
        <div className="flex flex-row md:flex-col items-center justify-center gap-3 py-2 md:py-0 select-none pointer-events-none">
          {/* Line A */}
          <div className="h-[2px] w-8 md:w-[2px] md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-transparent to-rose-500/40" />
          
          {/* Glow OR Badge */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 blur-md opacity-35" />
            <div className="relative w-11 h-11 rounded-full bg-neutral-950 border border-white/10 shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center justify-center font-bold text-xs uppercase tracking-widest text-rose-400">
              OR
            </div>
          </div>

          {/* Line B */}
          <div className="h-[2px] w-8 md:w-[2px] md:h-12 bg-gradient-to-r md:bg-gradient-to-b from-rose-500/40 to-transparent" />
        </div>

        {/* Option B (Right/Bottom) */}
        <motion.button
          onClick={() => handleSelect("B")}
          disabled={hasIAnswered}
          whileHover={!hasIAnswered ? { scale: 1.02, y: -2 } : {}}
          whileTap={!hasIAnswered ? { scale: 0.98 } : {}}
          className={`relative flex-1 group overflow-hidden min-h-[160px] md:min-h-[180px] rounded-3xl p-6 border text-left flex flex-col justify-between transition-all duration-300 ${
            myAnswer === currentPrompt.optionB
              ? `bg-gradient-to-br from-rose-500/15 to-transparent border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]`
              : hasIAnswered
              ? "bg-white/[0.01] border-white/5 opacity-50"
              : "bg-white/[0.02] border-white/10 hover:border-rose-500/40 hover:bg-white/[0.04]"
          }`}
        >
          {/* Subtle Back Glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/5 to-transparent rounded-full blur-xl group-hover:from-rose-500/10 transition-colors" />

          {/* Option Label */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500/60 group-hover:text-rose-500 transition-colors">
            Option B
          </span>

          <div className="my-auto pt-2 pb-4">
            <span className="text-2xl md:text-3xl font-black text-white font-extrabold group-hover:text-white leading-tight">
              {currentPrompt.optionB}
            </span>
          </div>

          {/* Choice status indicator */}
          <div className="flex items-center gap-2">
            {myAnswer === currentPrompt.optionB ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Selected
              </span>
            ) : hasIAnswered ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 font-semibold">
                Not chosen
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 font-bold group-hover:text-white/80 transition-colors">
                Tap to Select
              </span>
            )}
          </div>
        </motion.button>

      </div>

      {/* Synchronized Feedback Overlay */}
      <div className="w-full min-h-[90px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!hasIAnswered ? (
            <motion.div
              key="waiting-self"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <HelpCircle className="w-8 h-8 text-white/70 font-semibold animate-bounce mb-2" />
              <p className="text-sm font-medium text-white/80 font-bold">Select your preference above to sync!</p>
            </motion.div>
          ) : !hasPartnerAnswered ? (
            <motion.div
              key="waiting-partner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center bg-white/[0.02] border border-white/5 px-6 py-4 rounded-2xl"
            >
              <div className="w-5 h-5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-3" />
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400/80">Waiting for Partner...</p>
              <p className="text-[10px] text-white/80 font-bold mt-1">Once they vote, compatibility is revealed!</p>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center gap-4"
            >
              
              {/* Compatibility Result Banner */}
              {isMatch ? (
                <div className="relative w-full max-w-md rounded-2xl py-3 px-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/15 to-emerald-500/10 border border-emerald-500/30 text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col items-center">
                  <div className="absolute -top-3.5 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-lg">
                    Perfect Match! ❤️
                  </div>
                  <p className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                    You both chose <strong className="underline decoration-wavy decoration-emerald-400/40">{myAnswer}</strong>!
                  </p>
                  <p className="text-[10px] text-white font-extrabold font-bold mt-0.5">You're in absolute sync on this preference!</p>
                </div>
              ) : (
                <div className="relative w-full max-w-md rounded-2xl py-3 px-6 bg-gradient-to-r from-rose-500/10 via-purple-500/15 to-rose-500/10 border border-rose-500/30 text-center shadow-[0_0_30px_rgba(244,63,94,0.15)] flex flex-col items-center">
                  <div className="absolute -top-3.5 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-lg">
                    Opposites Attract! ☯️
                  </div>
                  <p className="text-sm font-bold text-rose-400 mt-1">
                    You chose <strong className="text-amber-400">{myAnswer}</strong>, they chose <strong className="text-rose-400">{partnerAnswer}</strong>!
                  </p>
                  <p className="text-[10px] text-white font-extrabold font-bold mt-0.5">Opposing choices make for the best debates! Share why you chose yours.</p>
                </div>
              )}

              {/* Dynamic Next Button */}
              <button
                onClick={onNext}
                className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-black bg-white hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Next Preference →
              </button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
