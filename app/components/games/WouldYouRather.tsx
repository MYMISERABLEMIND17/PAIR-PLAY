"use client";

import { HelpCircle } from "lucide-react";

interface WouldYouRatherProps {
  currentPrompt: any;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function WouldYouRather({ currentPrompt, isFlipped, onFlip }: WouldYouRatherProps) {
  // In a full version, we might track who voted for what.
  // For now, when either player clicks an option, it "flips" (reveals a Next button or highlights the choice).

  return (
    <div className="flex-grow flex flex-col md:flex-row items-center justify-center w-full px-4 gap-6 h-full">
      {/* Option A */}
      <div 
        onClick={onFlip}
        className={`w-full md:w-1/2 h-64 md:h-96 elevated-card rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group transition-all duration-300 border-t-2 border-t-red-500/50 hover:border-t-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.2)] ${isFlipped ? 'opacity-50' : ''}`}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-4">Option A</span>
        <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/90 group-hover:text-white">
          {currentPrompt.optionA}
        </p>
      </div>

      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1a1a1e] border border-white/10 flex items-center justify-center font-bold text-white/50 z-10 md:-mx-12">
        OR
      </div>

      {/* Option B */}
      <div 
        onClick={onFlip}
        className={`w-full md:w-1/2 h-64 md:h-96 elevated-card rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group transition-all duration-300 border-t-2 border-t-blue-500/50 hover:border-t-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] ${isFlipped ? 'opacity-50' : ''}`}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-4">Option B</span>
        <p className="text-xl md:text-2xl font-medium leading-relaxed text-white/90 group-hover:text-white">
          {currentPrompt.optionB}
        </p>
      </div>
    </div>
  );
}
