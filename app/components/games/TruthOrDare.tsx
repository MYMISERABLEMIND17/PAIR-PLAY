"use client";

import { Flame, Sparkles } from "lucide-react";

interface TruthOrDareProps {
  currentPrompt: any;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  [key: string]: any;
}

const categoryIcons: Record<string, string> = {
  Popular: "👑",
  Crazy: "🤪",
  Party: "🥳",
  Spicy: "🔥",
  Kids: "👶",
  Relationships: "💏"
};

const categoryGradients: Record<string, string> = {
  Popular: "from-amber-500/10 to-yellow-500/5 border-amber-500/20 text-amber-400",
  Crazy: "from-purple-500/10 to-indigo-500/5 border-purple-500/20 text-purple-400",
  Party: "from-pink-500/10 to-rose-500/5 border-pink-500/20 text-pink-400",
  Spicy: "from-red-500/10 to-orange-500/5 border-red-500/20 text-red-400",
  Kids: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-400",
  Relationships: "from-sky-500/10 to-blue-500/5 border-sky-500/20 text-sky-400"
};

export default function TruthOrDare({ currentPrompt, isFlipped, onFlip }: TruthOrDareProps) {
  const category = currentPrompt.category || "Popular";
  const catIcon = categoryIcons[category] || "✨";
  const catTheme = categoryGradients[category] || "from-purple-500/10 to-pink-500/5 border-purple-500/20 text-purple-400";
  const isTruth = currentPrompt.type === 'truth';

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full px-4 max-w-sm mx-auto py-6">
      
      {/* Category Deck Pill */}
      <div className="text-center mb-6">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 justify-center bg-black/40 ${catTheme}`}>
          <span>{catIcon}</span> {category} Deck
        </span>
      </div>

      {/* 3D Card container */}
      <div 
        onClick={onFlip}
        className="relative w-full aspect-[3/4] cursor-pointer perspective-1000"
      >
        <div
          className={`w-full h-full relative transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* Card Front */}
          <div className="absolute inset-0 backface-hidden elevated-card rounded-3xl p-8 flex flex-col items-center justify-between text-center group border border-white/5 bg-[#0c0c10]">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mt-2">
              <Sparkles className="w-4 h-4 text-white/40 group-hover:text-pink-500 transition-colors" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <Flame className={`w-16 h-16 transition-transform group-hover:scale-110 duration-300 ${isTruth ? 'text-purple-500 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'text-pink-500 filter drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]'}`} />
              <h2 className="text-3.5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent uppercase tracking-wider">
                {isTruth ? 'Truth' : 'Dare'}
              </h2>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-2">
              Tap to Reveal
            </span>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 elevated-card bg-[#0e0e12]/98 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] rounded-3xl p-8 flex flex-col items-center justify-between text-center">
            
            {/* Elegant Accent indicator at top */}
            <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${isTruth ? 'from-purple-500 to-indigo-500' : 'from-pink-500 to-rose-500'} rounded-t-3xl`} />

            <div className="w-full flex justify-between items-center mt-2">
              <span className={`text-[9px] font-black uppercase tracking-widest font-mono ${isTruth ? 'text-purple-400' : 'text-pink-400'}`}>
                {currentPrompt.type}
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono">
                ID: {currentPrompt.id}
              </span>
            </div>

            <div className="my-auto py-4">
              <p className="text-2xl font-bold leading-relaxed text-white/95 px-2">
                {currentPrompt.text}
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 mb-2 w-full">
              <div className="h-[1px] w-12 bg-white/10 mb-2" />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Take turns answering together
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
