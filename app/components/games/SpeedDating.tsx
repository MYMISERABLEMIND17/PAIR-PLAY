"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Heart } from "lucide-react";

interface SpeedDatingProps {
  currentPrompt: {
    id: string;
    text: string;
    category: string;
  };
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  [key: string]: any;
}

const categoryConfig: Record<string, { label: string; icon: string; gradient: string; textClass: string; bgClass: string }> = {
  Best: {
    label: "Top Pick",
    icon: "👑",
    gradient: "from-pink-500 via-rose-500 to-red-600",
    textClass: "text-rose-400",
    bgClass: "bg-rose-500/10 border-rose-500/20"
  },
  Funny: {
    label: "Funny Vibe",
    icon: "😂",
    gradient: "from-amber-400 via-orange-500 to-yellow-600",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/20"
  },
  Icebreaker: {
    label: "Icebreaker",
    icon: "❄️",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    textClass: "text-sky-400",
    bgClass: "bg-sky-500/10 border-sky-500/20"
  }
};

export default function SpeedDating({
  currentPrompt,
  isFlipped,
  onFlip
}: SpeedDatingProps) {
  
  const category = currentPrompt.category || "Best";
  const config = categoryConfig[category] || categoryConfig.Best;

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full px-4 max-w-xl mx-auto py-6">
      
      {/* Dynamic Header Deck pill */}
      <div className="text-center mb-6">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 justify-center ${config.bgClass} ${config.textClass}`}>
          <span>{config.icon}</span> {config.label}
        </span>
      </div>

      {/* 3D Interactive Card Flip */}
      <div className="relative w-full h-[320px] cursor-pointer perspective-1000" onClick={onFlip}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-full h-full relative"
        >
          {/* Card Back: Category Deck Cover */}
          <div 
            style={{ backfaceVisibility: "hidden" }}
            className={`absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-between text-center bg-gradient-to-br ${config.gradient} border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)]`}
          >
            {/* Elegant overlay glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent)] rounded-3xl" />
            
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mt-4 backdrop-blur-sm">
              <Zap className="w-5 h-5 text-white fill-white/10" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl select-none filter drop-shadow-md">{config.icon}</span>
              <p className="text-sm font-black text-white font-extrabold drop-shadow-sm tracking-widest uppercase mt-3 font-mono">Speed Dating</p>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-white font-extrabold font-bold bg-black/20 px-4 py-1.5 rounded-full border border-white/5 mb-4 backdrop-blur-sm">
              Reveal Question
            </span>
          </div>

          {/* Card Front: The Speed Dating Question */}
          <div 
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
            className="absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-between text-center bg-[#08080c]/98 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
          >
            {/* Ambient Category Border */}
            <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${config.gradient} rounded-t-3xl`} />

            <div className="w-full flex justify-between items-center mt-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/70 font-semibold font-mono">
                ID: {currentPrompt.id}
              </span>
              <Sparkles className={`w-4 h-4 ${config.textClass}`} />
            </div>

            <div className="my-auto py-4">
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-white font-extrabold drop-shadow-sm text-center px-2">
                "{currentPrompt.text}"
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 mb-2 w-full">
              <div className="h-[1px] w-12 bg-white/10 mb-2" />
              <span className="text-[10px] font-semibold text-white/80 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-pink-500/50" /> Answer within 60 seconds!
              </span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
