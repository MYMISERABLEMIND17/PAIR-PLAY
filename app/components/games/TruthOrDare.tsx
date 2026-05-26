"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import truthOrDareData from "../../data/truth_or_dare.json";
import truthAndDareCouplesData from "../../data/truth_and_dare_couples.json";

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

// Merge both classic and couples datasets for comprehensive dynamic lookup
const allPrompts = [...truthOrDareData.prompts, ...truthAndDareCouplesData.prompts];

export default function TruthOrDare({
  currentPrompt,
  isFlipped,
  onFlip,
  sendReaction,
  state
}: TruthOrDareProps) {
  
  const [choice, setChoice] = useState<"truth" | "dare" | "random" | null>(null);

  const category = currentPrompt.category || "Popular";
  const catIcon = categoryIcons[category] || "✨";
  const catTheme = categoryGradients[category] || "from-purple-500/10 to-pink-500/5 border-purple-500/20 text-purple-400";

  // Sync choice across clients using existing socket reactions
  useEffect(() => {
    if (state?.lastReaction?.type?.startsWith("choice_")) {
      const type = state.lastReaction.type.replace("choice_", "") as "truth" | "dare" | "random";
      setChoice(type);
    }
  }, [state?.lastReaction]);

  // Reset choice when card flips back
  useEffect(() => {
    if (!isFlipped) {
      setChoice(null);
    }
  }, [isFlipped]);

  // Select the exact prompts category sub-deck
  const categoryPrompts = allPrompts.filter(p => p.category === category);
  const truths = categoryPrompts.filter(p => p.type === "truth");
  const dares = categoryPrompts.filter(p => p.type === "dare");

  // Determine the deterministically chosen prompt
  const currentIdx = state?.currentPromptIndex || 0;
  let selectedPrompt = currentPrompt;

  if (choice === "truth" && truths.length > 0) {
    selectedPrompt = truths[currentIdx % truths.length];
  } else if (choice === "dare" && dares.length > 0) {
    selectedPrompt = dares[currentIdx % dares.length];
  } else if (choice === "random" && categoryPrompts.length > 0) {
    selectedPrompt = categoryPrompts[currentIdx % categoryPrompts.length];
  }

  const isTruth = selectedPrompt.type === "truth";

  const handleSelect = (selectedType: "truth" | "dare" | "random") => {
    setChoice(selectedType);
    if (sendReaction) {
      sendReaction("choice_" + selectedType);
    }
    onFlip();
  };

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
        className="relative w-full aspect-[3/4] cursor-pointer perspective-1000"
      >
        <div
          className={`w-full h-full relative transition-all duration-700 preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}
        >
          {/* Card Front: Three Choices (Truth, Dare, Random) */}
          <div className="absolute inset-0 backface-hidden elevated-card rounded-3xl p-6 flex flex-col items-center justify-between text-center border border-white/5 bg-[#0c0c10]">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mt-1">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>

            <div className="flex flex-col items-center gap-1 w-full my-auto">
              <h2 className="text-xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent uppercase tracking-widest mb-4">
                Choose Your Fate
              </h2>
              
              <div className="flex flex-col gap-3 w-full px-1">
                {/* Truth Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect("truth");
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600/20 via-indigo-600/10 to-transparent border border-purple-500/30 hover:border-purple-400 hover:bg-purple-600/30 transition-all flex items-center justify-between px-5 group/btn active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl filter drop-shadow">🤫</span>
                    <span className="font-bold text-xs text-purple-200 group-hover/btn:text-white transition-colors tracking-wider">TRUTH</span>
                  </div>
                  <span className="text-[8px] font-bold text-purple-400/80 bg-purple-500/15 px-2.5 py-1 rounded-full uppercase tracking-widest">Answer</span>
                </button>

                {/* Dare Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect("dare");
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600/20 via-rose-600/10 to-transparent border border-pink-500/30 hover:border-pink-400 hover:bg-pink-600/30 transition-all flex items-center justify-between px-5 group/btn active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl filter drop-shadow">😈</span>
                    <span className="font-bold text-xs text-pink-200 group-hover/btn:text-white transition-colors tracking-wider">DARE</span>
                  </div>
                  <span className="text-[8px] font-bold text-pink-400/80 bg-pink-500/15 px-2.5 py-1 rounded-full uppercase tracking-widest">Action</span>
                </button>

                {/* Random Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect("random");
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600/20 via-blue-600/10 to-transparent border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-600/30 transition-all flex items-center justify-between px-5 group/btn active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl filter drop-shadow">🎲</span>
                    <span className="font-bold text-xs text-cyan-200 group-hover/btn:text-white transition-colors tracking-wider">RANDOM</span>
                  </div>
                  <span className="text-[8px] font-bold text-cyan-400/80 bg-cyan-500/15 px-2.5 py-1 rounded-full uppercase tracking-widest">Wild Card</span>
                </button>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-1">
              Select one to flip
            </span>
          </div>

          {/* Card Back: Revealed Question */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 elevated-card bg-[#0e0e12]/98 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] rounded-3xl p-8 flex flex-col items-center justify-between text-center" onClick={onFlip}>
            
            {/* Elegant Accent indicator at top */}
            <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${isTruth ? "from-purple-500 to-indigo-500" : "from-pink-500 to-rose-500"} rounded-t-3xl`} />

            <div className="w-full flex justify-between items-center mt-2">
              <span className={`text-[9px] font-black uppercase tracking-widest font-mono ${isTruth ? "text-purple-400" : "text-pink-400"}`}>
                {selectedPrompt.type}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80 font-mono">
                ID: {selectedPrompt.id}
              </span>
            </div>

            <div className="my-auto py-4">
              <p className="text-3xl font-extrabold leading-relaxed text-white px-2 drop-shadow-md">
                "{selectedPrompt.text}"
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 mb-2 w-full">
              <div className="h-[1px] w-12 bg-white/10 mb-2" />
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                Take turns answering together
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
