"use client";

import { Flame } from "lucide-react";

interface TruthOrDareProps {
  currentPrompt: any;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  [key: string]: any;
}

export default function TruthOrDare({ currentPrompt, isFlipped, onFlip }: TruthOrDareProps) {
  return (
    <div className="flex-grow flex items-center justify-center w-full px-4 perspective-1000">
      <div 
        onClick={onFlip}
        className={`relative w-full max-w-sm aspect-[3/4] cursor-pointer transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Card Front */}
        <div className="absolute inset-0 backface-hidden elevated-card rounded-3xl p-8 flex flex-col items-center justify-center text-center group">
          <Flame className="w-16 h-16 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            {currentPrompt.type === 'truth' ? 'Truth' : 'Dare'}
          </h2>
          <p className="mt-8 text-white/50 text-sm">Tap to reveal together</p>
        </div>

        {/* Card Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 elevated-card bg-[#1a1a1e] border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.1)] rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-6">
            {currentPrompt.type}
          </span>
          <p className="text-2xl font-medium leading-relaxed text-white/90">
            {currentPrompt.text}
          </p>
        </div>
      </div>
    </div>
  );
}
