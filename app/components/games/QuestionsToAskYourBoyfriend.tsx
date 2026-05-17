"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, HelpCircle, Heart } from "lucide-react";

interface QuestionsToAskYourBoyfriendProps {
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
  Deep: {
    label: "Deep Thoughts",
    icon: "🧠",
    gradient: "from-indigo-600 via-blue-600 to-violet-700",
    textClass: "text-blue-400",
    bgClass: "bg-blue-500/10 border-blue-500/20"
  },
  Fun: {
    label: "Fun & Hilarious",
    icon: "😂",
    gradient: "from-amber-400 via-orange-500 to-yellow-600",
    textClass: "text-amber-400",
    bgClass: "bg-amber-500/10 border-amber-500/20"
  },
  Personal: {
    label: "Personal & Private",
    icon: "❤️",
    gradient: "from-rose-500 via-pink-600 to-rose-700",
    textClass: "text-rose-400",
    bgClass: "bg-rose-500/10 border-rose-500/20"
  },
  Past: {
    label: "Childhood & Past",
    icon: "🕰",
    gradient: "from-teal-500 via-cyan-500 to-emerald-600",
    textClass: "text-teal-400",
    bgClass: "bg-teal-500/10 border-teal-500/20"
  },
  People: {
    label: "Friends & Family",
    icon: "👥",
    gradient: "from-purple-500 via-indigo-600 to-purple-700",
    textClass: "text-purple-400",
    bgClass: "bg-purple-500/10 border-purple-500/20"
  },
  Relationship: {
    label: "Love & Intimacy",
    icon: "💏",
    gradient: "from-pink-500 via-red-500 to-pink-600",
    textClass: "text-pink-400",
    bgClass: "bg-pink-500/10 border-pink-500/20"
  },
  Worldview: {
    label: "Worldview & Values",
    icon: "🌎",
    gradient: "from-emerald-500 via-teal-600 to-emerald-700",
    textClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10 border-emerald-500/20"
  },
  Entertainment: {
    label: "Movies & Pop Culture",
    icon: "🎬",
    gradient: "from-fuchsia-500 via-purple-600 to-indigo-600",
    textClass: "text-fuchsia-400",
    bgClass: "bg-fuchsia-500/10 border-fuchsia-500/20"
  }
};

export default function QuestionsToAskYourBoyfriend({
  currentPrompt,
  isFlipped,
  onFlip
}: QuestionsToAskYourBoyfriendProps) {
  
  const category = currentPrompt.category || "Deep";
  const config = categoryConfig[category] || categoryConfig.Deep;

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full px-4 max-w-xl mx-auto py-6">
      
      {/* Category Deck Indicator */}
      <div className="text-center mb-6">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 justify-center ${config.bgClass} ${config.textClass}`}>
          <span>{config.icon}</span> {config.label} Card
        </span>
      </div>

      {/* 3D Card Container */}
      <div className="relative w-full h-[320px] cursor-pointer perspective-1000" onClick={onFlip}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-full h-full relative"
        >
          {/* Card Back (Flipped = False) */}
          <div 
            style={{ backfaceVisibility: "hidden" }}
            className={`absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-between text-center bg-gradient-to-br ${config.gradient} border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)]`}
          >
            {/* Glowing pattern ornament */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15),transparent)] rounded-3xl" />
            
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mt-4 backdrop-blur-sm">
              <Heart className="w-6 h-6 text-white fill-white/20 animate-pulse" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-6xl select-none filter drop-shadow-md">{config.icon}</span>
              <p className="text-sm font-bold text-white/80 tracking-widest uppercase mt-3">Boyfriend Question Card</p>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 bg-black/20 px-3 py-1 rounded-full border border-white/5 mb-4 backdrop-blur-sm">
              Tap to Reveal
            </span>
          </div>

          {/* Card Front (Flipped = True, Rotated 180 deg) */}
          <div 
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
            className="absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-between text-center bg-[#0d0d12]/95 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
          >
            {/* Subtle top border category glow */}
            <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${config.gradient} rounded-t-3xl`} />

            <div className="w-full flex justify-between items-center mt-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono">
                ID: {currentPrompt.id}
              </span>
              <Sparkles className={`w-4 h-4 ${config.textClass}`} />
            </div>

            <div className="my-auto py-4">
              <p className="text-xl md:text-2xl font-bold leading-relaxed text-white/95 text-center px-2">
                "{currentPrompt.text}"
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 mb-2 w-full">
              <div className="h-[1px] w-12 bg-white/10 mb-2" />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-white/30" /> Alternate Answering Together
              </span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
