"use client";

import { useState, useEffect, useRef } from "react";
import { Smile, Sparkles, RotateCcw, Timer } from "lucide-react";

interface CharadesProps {
  currentPrompt: any;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  [key: string]: any;
}

const categoryIcons: Record<string, string> = {
  Easy: "🟢",
  Normal: "😎",
  Hard: "🧠",
  Kids: "🎈",
  Movies: "🎬",
  Party: "🥳"
};

const categoryGradients: Record<string, string> = {
  Easy: "from-emerald-500/10 to-green-500/5 border-emerald-500/20 text-emerald-400",
  Normal: "from-amber-500/10 to-yellow-500/5 border-amber-500/20 text-amber-400",
  Hard: "from-red-500/10 to-rose-500/5 border-red-500/20 text-red-400",
  Kids: "from-pink-500/10 to-teal-500/5 border-pink-500/20 text-pink-400",
  Movies: "from-sky-500/10 to-blue-500/5 border-sky-500/20 text-sky-400",
  Party: "from-purple-500/10 to-fuchsia-500/5 border-purple-500/20 text-purple-400"
};

const categoryBarGradients: Record<string, string> = {
  Easy: "from-emerald-500 to-green-500",
  Normal: "from-amber-500 to-yellow-500",
  Hard: "from-red-500 to-rose-500",
  Kids: "from-pink-500 to-teal-500",
  Movies: "from-sky-500 to-blue-500",
  Party: "from-purple-500 to-fuchsia-500"
};

export default function Charades({ currentPrompt, isFlipped, onFlip }: CharadesProps) {
  const category = currentPrompt.category || "Normal";
  const catIcon = categoryIcons[category] || "🎭";
  const catTheme = categoryGradients[category] || "from-purple-500/10 to-cyan-500/5 border-purple-500/20 text-purple-400";
  const barTheme = categoryBarGradients[category] || "from-purple-500 to-cyan-500";

  // Built-in 60s countdown timer
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer on card flip or new prompt
  useEffect(() => {
    setTimeLeft(60);
    setIsTimerActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [currentPrompt.id, isFlipped]);

  const toggleTimer = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent flipping the card when clicking timer controls!
    
    if (isTimerActive) {
      setIsTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsTimerActive(true);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const resetTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTimeLeft(60);
    setIsTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full px-4 max-w-sm mx-auto py-6">
      
      {/* Category Deck Pill */}
      <div className="text-center mb-6">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border flex items-center gap-1.5 justify-center bg-black/40 ${catTheme}`}>
          <span>{catIcon}</span> {category} Deck
        </span>
      </div>

      {/* 3D Card Container */}
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
              <Sparkles className="w-4 h-4 text-white/80 font-bold group-hover:text-indigo-400 transition-colors" />
            </div>

            <div className="flex flex-col items-center gap-3">
              <Smile className="w-16 h-16 text-indigo-400 transition-transform group-hover:scale-110 duration-300 filter drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]" />
              <h2 className="text-3.5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider">
                Charades
              </h2>
            </div>

            <span className="text-[10px] font-black uppercase tracking-widest text-white/80 font-bold bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-2">
              Tap to Reveal Word
            </span>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 elevated-card bg-[#0e0e12]/98 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] rounded-3xl p-8 flex flex-col items-center justify-between text-center">
            
            {/* Elegant Accent indicator at top */}
            <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${barTheme} rounded-t-3xl`} />

            <div className="w-full flex justify-between items-center mt-2">
              <span className={`text-[9px] font-black uppercase tracking-widest font-mono text-indigo-400`}>
                Act It Out 🎭
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/70 font-semibold font-mono">
                ID: {currentPrompt.id}
              </span>
            </div>

            {/* Word Display */}
            <div className="my-auto py-4">
              <p className="text-3xl font-black leading-relaxed bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent px-2 uppercase tracking-wide">
                {currentPrompt.text}
              </p>
            </div>

            {/* Built-in Interactive Timer Area */}
            <div 
              onClick={(e) => e.stopPropagation()} // stop click propagation inside timer area
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/80 font-bold flex items-center gap-1">
                  <Timer className="w-3.5 h-3.5" /> Built-in Timer
                </span>
                
                <div className="flex gap-2">
                  <button 
                    onClick={toggleTimer}
                    className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                      isTimerActive 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {isTimerActive ? 'Pause' : 'Start'}
                  </button>
                  <button 
                    onClick={resetTimer}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Timer Progress Bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    timeLeft <= 10 
                      ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                      : timeLeft <= 20 
                      ? 'bg-amber-500' 
                      : 'bg-indigo-500'
                  }`}
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
              </div>

              {/* Time display */}
              <div className="flex items-center justify-center gap-2">
                <span className={`text-2xl font-black font-mono leading-none tracking-wider ${
                  timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'
                }`}>
                  {timeLeft}s
                </span>
                {timeLeft === 0 && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full animate-bounce">
                    Time's Up! ⏰
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mb-2 w-full mt-4">
              <div className="h-[1px] w-12 bg-white/10 mb-2" />
              <span className="text-[10px] font-semibold text-white/80 font-bold uppercase tracking-widest">
                No talking or sounds allowed!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
