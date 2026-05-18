"use client";

import { motion } from "framer-motion";
import { Sparkles, Eye, Key } from "lucide-react";

interface ConfessionProps {
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
  Embarrassing: {
    label: "Embarrassing Secret",
    icon: "😳",
    gradient: "from-amber-400 via-orange-500 to-yellow-600",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/20"
  },
  Relationships: {
    label: "Relationships Secret",
    icon: "💖",
    gradient: "from-pink-500 via-rose-500 to-red-600",
    textClass: "text-rose-400",
    bgClass: "bg-rose-500/10 border-rose-500/20"
  },
  Friends: {
    label: "Friends Secret",
    icon: "🤝",
    gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    textClass: "text-teal-400",
    bgClass: "bg-teal-500/10 border-teal-500/20"
  },
  Party: {
    label: "Party Secret",
    icon: "🥳",
    gradient: "from-purple-500 via-fuchsia-500 to-pink-600",
    textClass: "text-fuchsia-400",
    bgClass: "bg-fuchsia-500/10 border-fuchsia-500/20"
  },
  School: {
    label: "School Secret",
    icon: "📝",
    gradient: "from-blue-500 via-indigo-600 to-purple-700",
    textClass: "text-indigo-400",
    bgClass: "bg-indigo-500/10 border-indigo-500/20"
  },
  Work: {
    label: "Work Secret",
    icon: "💼",
    gradient: "from-slate-600 via-zinc-700 to-neutral-800",
    textClass: "text-zinc-400",
    bgClass: "bg-zinc-500/10 border-zinc-500/20"
  },
  "Social Media": {
    label: "Social Media Secret",
    icon: "📱",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    textClass: "text-sky-400",
    bgClass: "bg-sky-500/10 border-sky-500/20"
  },
  Food: {
    label: "Food Secret",
    icon: "🍔",
    gradient: "from-orange-500 via-red-500 to-rose-600",
    textClass: "text-orange-400",
    bgClass: "bg-orange-500/10 border-orange-500/20"
  }
};

export default function Confession({
  currentPrompt,
  isFlipped,
  onFlip
}: ConfessionProps) {
  
  const category = currentPrompt.category || "Embarrassing";
  const config = categoryConfig[category] || categoryConfig.Embarrassing;

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full px-4 max-w-xl mx-auto py-6 animate-in fade-in zoom-in duration-300">
      
      {/* Dynamic Header Deck pill */}
      <div className="text-center mb-8">
        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border flex items-center gap-2 justify-center shadow-lg backdrop-blur-md ${config.bgClass} ${config.textClass}`}>
          <span className="text-base leading-none">{config.icon}</span> {config.label}
        </span>
      </div>

      {/* 3D Interactive Card Flip */}
      <div className="relative w-full h-[340px] cursor-pointer perspective-1000" onClick={onFlip}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-full h-full relative"
        >
          {/* Card Front (Unrevealed/Cover) */}
          <div 
            style={{ backfaceVisibility: "hidden" }}
            className={`absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-between text-center bg-gradient-to-br ${config.gradient} border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)]`}
          >
            {/* Elegant glass glow overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12),transparent)] rounded-3xl" />
            
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mt-4 backdrop-blur-md shadow-inner">
              <Key className="w-6 h-6 text-white animate-pulse" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">{config.icon}</span>
              <p className="text-base font-black text-white tracking-widest uppercase mt-4 drop-shadow">Confess Your Secret</p>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-white/70 bg-black/35 px-5 py-2 rounded-full border border-white/10 mb-4 backdrop-blur-md hover:scale-105 transition-transform">
              Reveal Confession
            </span>
          </div>

          {/* Card Back (Revealed Prompt) */}
          <div 
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
            className="absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-between text-center bg-[#07070a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          >
            {/* Ambient Top Glow Border */}
            <div className={`absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r ${config.gradient} rounded-t-3xl`} />

            <div className="w-full flex justify-between items-center mt-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono">
                ID: {currentPrompt.id}
              </span>
              <Eye className={`w-4 h-4 ${config.textClass} animate-pulse`} />
            </div>

            <div className="my-auto py-4">
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-white/95 text-center px-2 drop-shadow-md">
                "{currentPrompt.text}"
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 mb-2 w-full">
              <div className="h-[1px] w-14 bg-white/10 mb-3" />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Share honestly & no judgements!
              </span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
