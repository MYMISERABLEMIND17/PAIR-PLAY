"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface DeepConnectionProps {
  currentPrompt: any;
  answers: Record<string, string>;
  userId: string;
  partnerId?: string;
  onSubmitAnswer: (text: string) => void;
}

export default function DeepConnection({ currentPrompt, answers, userId, partnerId, onSubmitAnswer }: DeepConnectionProps) {
  const [inputText, setInputText] = useState("");

  const myAnswer = answers?.[userId];
  const partnerAnswer = partnerId ? answers?.[partnerId] : undefined;

  const bothAnswered = myAnswer && partnerAnswer && myAnswer !== "SUBMITTED_PLACEHOLDER" && partnerAnswer !== "SUBMITTED_PLACEHOLDER";
  const iAnswered = !!myAnswer && myAnswer !== "SUBMITTED_PLACEHOLDER";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmitAnswer(inputText.trim());
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center w-full px-4 max-w-2xl mx-auto h-full relative">
      
      {/* The Question Card */}
      <div className="w-full elevated-card rounded-3xl p-8 mb-8 text-center border-t-2 border-t-indigo-500/50 relative z-10">
        <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-medium leading-relaxed text-white/90">
          {currentPrompt.text}
        </h2>
      </div>

      {/* State 1: I haven't answered yet */}
      {!iAnswered && (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center animate-fade-in relative z-10">
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your answer honestly..."
            className="w-full bg-[#1a1a1e] border border-white/10 rounded-2xl p-6 text-lg text-white/90 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none min-h-[150px] shadow-inner transition-all placeholder:text-white/20"
            autoFocus
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="mt-6 px-8 py-3 rounded-full font-bold tracking-wide transition-all bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </form>
      )}

      {/* State 2: I answered, waiting for partner */}
      {iAnswered && !bothAnswered && (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-6" />
          <h3 className="text-xl font-bold text-white/80">Answer locked in!</h3>
          <p className="text-white/50 mt-2">Waiting for your partner to finish typing...</p>
        </div>
      )}

      {/* State 3: Both answered (The Reveal) */}
      {bothAnswered && (
        <div className="w-full flex flex-col md:flex-row gap-6 animate-fade-in relative z-10">
          {/* My Answer */}
          <div className="flex-1 elevated-card rounded-3xl p-6 border-l-4 border-l-indigo-500 bg-gradient-to-b from-[#1a1a1e] to-indigo-900/10">
            <div className="flex items-center gap-2 mb-4 text-indigo-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">You</span>
            </div>
            <p className="text-lg text-white/90 leading-relaxed">{myAnswer}</p>
          </div>

          {/* Partner's Answer */}
          <div className="flex-1 elevated-card rounded-3xl p-6 border-l-4 border-l-cyan-400 bg-gradient-to-b from-[#1a1a1e] to-cyan-900/10">
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Partner</span>
            </div>
            <p className="text-lg text-white/90 leading-relaxed">{partnerAnswer}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
