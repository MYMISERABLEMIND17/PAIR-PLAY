"use client";

import { MessageCircleHeart } from "lucide-react";

interface ConversationStartersProps {
  currentPrompt: any;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function ConversationStarters({ currentPrompt, isFlipped, onFlip }: ConversationStartersProps) {
  return (
    <div className="flex-grow flex items-center justify-center w-full px-4">
      <div 
        onClick={onFlip}
        className="w-full max-w-xl elevated-card rounded-3xl p-10 md:p-16 flex flex-col items-center justify-center text-center cursor-pointer group border-t-2 border-t-emerald-400/50 hover:border-t-emerald-400"
      >
        <MessageCircleHeart className="w-12 h-12 text-emerald-400 mb-8 opacity-50 group-hover:opacity-100 transition-opacity" />
        <p className="text-2xl md:text-3xl font-medium leading-relaxed text-white/90">
          "{currentPrompt.text}"
        </p>
      </div>
    </div>
  );
}
