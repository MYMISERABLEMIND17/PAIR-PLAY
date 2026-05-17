"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Users, CheckCircle2, Sparkles, ChevronRight, Lock } from "lucide-react";

interface WouldYouRatherProps {
  currentPrompt: any;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  answers: Record<string, string>;
  userId: string | null;
  partnerId: string | undefined;
  onSubmitAnswer: (text: string) => void;
  sendReaction?: (type: string) => void;
  state?: any;
}

const EMOJI_MAP: Record<string, string> = {
  heart: "❤️",
  laugh: "😂",
  cry: "😭",
  shock: "😳"
};

export default function WouldYouRather({
  currentPrompt,
  answers,
  userId,
  partnerId,
  onSubmitAnswer,
  onNext,
  sendReaction,
  state
}: WouldYouRatherProps) {
  const [localChoice, setLocalChoice] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);

  // Clear local choice when question shifts
  useEffect(() => {
    setLocalChoice(null);
  }, [currentPrompt.id]);

  // Sync state reactions to display floating emojis locally
  useEffect(() => {
    if (state?.lastReaction) {
      const emoji = EMOJI_MAP[state.lastReaction.type] || "❤️";
      const newReaction = {
        id: state.lastReaction.timestamp + Math.random(),
        emoji,
        left: Math.random() * 60 + 20 // center area horizontal dispersion
      };
      setLocalReactions((prev) => [...prev, newReaction]);
      const timer = setTimeout(() => {
        setLocalReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state?.lastReaction?.timestamp, state?.lastReaction?.type]);

  const myAnswer = userId ? answers[userId] : undefined;
  const partnerAnswer = partnerId ? answers[partnerId] : undefined;
  const iVoted = !!myAnswer || !!localChoice;
  const partnerVoted = !!partnerAnswer;
  const bothVoted = iVoted && partnerVoted;

  const mySelectedOption = myAnswer || localChoice;
  const partnerSelectedOption = partnerAnswer;

  const pctA = currentPrompt.percentageA ?? 50;
  const pctB = currentPrompt.percentageB ?? 50;

  const handleSelect = (option: "A" | "B") => {
    if (iVoted) return; // Prevent changing choice once locked
    setLocalChoice(option);
    onSubmitAnswer(option);
  };

  // Determine partner status message
  let partnerStatus = "Waiting for partner...";
  if (!partnerId) {
    partnerStatus = "Waiting for partner to connect...";
  } else if (partnerVoted) {
    partnerStatus = "Partner Voted ✅";
  } else {
    partnerStatus = "Partner Choosing... ⚡";
  }

  // Check if both selected the same option
  const isMatch = bothVoted && mySelectedOption === partnerSelectedOption;

  return (
    <div className="relative w-full max-w-4xl px-4 flex flex-col items-center justify-center gap-6 h-full min-h-[450px]">
      
      {/* Floating Reactions Container (relative to card stage) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        <AnimatePresence>
          {localReactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ y: 150, x: `${r.left}%`, scale: 0.6, opacity: 0 }}
              animate={{ 
                y: -300, 
                x: `${r.left + (Math.random() * 20 - 10)}%`, 
                scale: [0.8, 1.4, 1.4, 1.0], 
                opacity: [0, 1, 1, 0] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute bottom-20 pointer-events-none text-5xl z-50 select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header status indicators */}
      <div className="w-full flex flex-wrap justify-between items-center gap-2 px-2 text-xs font-semibold tracking-wider uppercase text-white/50">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>Cinematic Choice</span>
        </div>
        <div className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
          <div className={`w-2 h-2 rounded-full ${partnerVoted ? "bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" : "bg-amber-400 animate-ping"}`} />
          <span className={partnerVoted ? "text-green-400" : "text-amber-400"}>{partnerStatus}</span>
        </div>
      </div>

      {/* Gameplay Container */}
      <div className="relative w-full flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-4 rounded-3xl p-2 bg-[#0d0d12]/40 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Option A Card */}
        <motion.div
          onClick={() => handleSelect("A")}
          whileHover={!iVoted ? { scale: 1.02 } : {}}
          whileTap={!iVoted ? { scale: 0.98 } : {}}
          className={`relative flex-1 rounded-2xl p-8 flex flex-col justify-between min-h-[220px] md:min-h-[300px] text-center cursor-pointer transition-all duration-500 border ${
            mySelectedOption === "A"
              ? "bg-gradient-to-br from-pink-500/15 via-pink-500/5 to-transparent border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.25)]"
              : iVoted
              ? "bg-white/[0.01] border-white/5 opacity-40 scale-95 pointer-events-none"
              : "bg-white/[0.02] border-white/10 hover:border-pink-500/40 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(236,72,153,0.08)]"
          }`}
        >
          {/* Top Label */}
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">Option A</span>
            {mySelectedOption === "A" && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-pink-500">
                <CheckCircle2 className="w-5 h-5 fill-pink-500/10" />
              </motion.div>
            )}
          </div>

          {/* Option Text */}
          <p className="my-6 text-xl md:text-2xl font-medium leading-relaxed text-white/90 group-hover:text-white drop-shadow-md">
            {currentPrompt.optionA}
          </p>

          {/* Bottom Results details (Revealed after both vote) */}
          <div className="h-10 flex items-center justify-center">
            {bothVoted ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center gap-1.5"
              >
                <div className="flex justify-between w-full text-xs font-bold text-white/70 px-1">
                  <span>Community Match</span>
                  <span className="text-pink-400 font-extrabold text-sm">{pctA}%</span>
                </div>
                <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pctA}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-rose-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                  />
                </div>
              </motion.div>
            ) : mySelectedOption === "A" ? (
              <div className="text-xs text-pink-400/80 font-medium flex items-center gap-1.5 animate-pulse bg-pink-500/5 px-3 py-1 rounded-full border border-pink-500/10">
                <Lock className="w-3.5 h-3.5" />
                Locked choice
              </div>
            ) : null}
          </div>

          {/* Avatar presence indication on reveal */}
          {bothVoted && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
              {mySelectedOption === "A" && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-pink-500 text-white shadow-md border border-pink-400/30">You</span>
              )}
              {partnerSelectedOption === "A" && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-600 text-white shadow-md border border-purple-400/30">Partner</span>
              )}
            </div>
          )}
        </motion.div>

        {/* Center Splitter / VS Circle */}
        <div className="flex-shrink-0 flex items-center justify-center z-10 md:my-0 -my-3">
          <motion.div 
            animate={bothVoted ? { rotate: 360 } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={`w-12 h-12 rounded-full border flex items-center justify-center font-black text-xs z-10 bg-[#0d0d12]/90 backdrop-blur-xl transition-all duration-500 ${
              bothVoted 
                ? "border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)] text-amber-400"
                : "border-white/10 text-white/40 shadow-lg"
            }`}
          >
            {bothVoted ? "VS" : "OR"}
          </motion.div>
        </div>

        {/* Option B Card */}
        <motion.div
          onClick={() => handleSelect("B")}
          whileHover={!iVoted ? { scale: 1.02 } : {}}
          whileTap={!iVoted ? { scale: 0.98 } : {}}
          className={`relative flex-1 rounded-2xl p-8 flex flex-col justify-between min-h-[220px] md:min-h-[300px] text-center cursor-pointer transition-all duration-500 border ${
            mySelectedOption === "B"
              ? "bg-gradient-to-br from-indigo-500/15 via-indigo-500/5 to-transparent border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.25)]"
              : iVoted
              ? "bg-white/[0.01] border-white/5 opacity-40 scale-95 pointer-events-none"
              : "bg-white/[0.02] border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]"
          }`}
        >
          {/* Top Label */}
          <div className="flex justify-between items-center w-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">Option B</span>
            {mySelectedOption === "B" && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-indigo-400">
                <CheckCircle2 className="w-5 h-5 fill-indigo-500/10" />
              </motion.div>
            )}
          </div>

          {/* Option Text */}
          <p className="my-6 text-xl md:text-2xl font-medium leading-relaxed text-white/90 group-hover:text-white drop-shadow-md">
            {currentPrompt.optionB}
          </p>

          {/* Bottom Results details (Revealed after both vote) */}
          <div className="h-10 flex items-center justify-center">
            {bothVoted ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center gap-1.5"
              >
                <div className="flex justify-between w-full text-xs font-bold text-white/70 px-1">
                  <span>Community Match</span>
                  <span className="text-indigo-400 font-extrabold text-sm">{pctB}%</span>
                </div>
                <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pctB}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-blue-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  />
                </div>
              </motion.div>
            ) : mySelectedOption === "B" ? (
              <div className="text-xs text-indigo-400/80 font-medium flex items-center gap-1.5 animate-pulse bg-indigo-500/5 px-3 py-1 rounded-full border border-indigo-500/10">
                <Lock className="w-3.5 h-3.5" />
                Locked choice
              </div>
            ) : null}
          </div>

          {/* Avatar presence indication on reveal */}
          {bothVoted && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
              {mySelectedOption === "B" && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-pink-500 text-white shadow-md border border-pink-400/30">You</span>
              )}
              {partnerSelectedOption === "B" && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-600 text-white shadow-md border border-purple-400/30">Partner</span>
              )}
            </div>
          )}
        </motion.div>

      </div>

      {/* Real-time waiting feedback panel */}
      {iVoted && !partnerVoted && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-center max-w-sm w-full"
        >
          <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-400 animate-pulse">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping mr-1" />
            Waiting for partner...
          </div>
          <p className="text-[11px] text-white/40 leading-normal">Your choice has been securely locked. The results will automatically synchronize and reveal once your partner submits.</p>
        </motion.div>
      )}

      {/* Dramatic Synchronized Match Reveal Panel */}
      {bothVoted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="w-full flex flex-col items-center gap-5 mt-2"
        >
          {/* Match Banner */}
          <div className={`relative px-8 py-3 rounded-full border text-center font-bold tracking-widest text-sm flex items-center gap-2.5 shadow-2xl ${
            isMatch 
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-400/50 text-pink-300 shadow-[0_0_30px_rgba(236,72,153,0.25)]" 
              : "bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border-indigo-400/50 text-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.25)]"
          }`}>
            <Sparkles className={`w-4 h-4 ${isMatch ? "text-pink-400 animate-spin" : "text-indigo-400"}`} />
            <span className="uppercase font-black text-xs">
              {isMatch ? "✨ IT'S A MATCH! SAME MINDS ✨" : "✨ OPPOSITES ATTRACT! ✨"}
            </span>
            <Sparkles className={`w-4 h-4 ${isMatch ? "text-pink-400 animate-spin" : "text-indigo-400"}`} />
          </div>

          {/* Social Reaction Dock inside the card */}
          {sendReaction && (
            <div className="flex flex-col items-center gap-2 bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-3 shadow-inner">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Send Live Reaction</span>
              <div className="flex items-center gap-3">
                {Object.entries(EMOJI_MAP).map(([type, emoji]) => (
                  <motion.button
                    key={type}
                    onClick={() => sendReaction(type)}
                    whileHover={{ scale: 1.25, rotate: [0, -10, 10, 0] }}
                    whileTap={{ scale: 0.9 }}
                    className="text-2xl cursor-pointer hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all select-none"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Next Button */}
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all cursor-pointer border border-amber-400/30"
          >
            <span>Next Question</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </motion.button>
        </motion.div>
      )}

    </div>
  );
}
