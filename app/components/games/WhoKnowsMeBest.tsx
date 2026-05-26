"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Users, CheckCircle2, Sparkles, ChevronRight, Lock, HelpCircle as HelpIcon, ArrowRightLeft } from "lucide-react";

interface WhoKnowsMeBestProps {
  currentPrompt: any;
  answers: Record<string, string>;
  userId: string | null;
  partnerId: string | undefined;
  onSubmitAnswer: (text: string) => void;
  onNext: () => void;
  sendReaction?: (type: string) => void;
  state?: any;
  [key: string]: any;
}

const EMOJI_MAP: Record<string, string> = {
  heart: "❤️",
  laugh: "😂",
  cry: "😭",
  shock: "😳"
};

export default function WhoKnowsMeBest({
  currentPrompt,
  answers,
  userId,
  partnerId,
  onSubmitAnswer,
  onNext,
  sendReaction,
  state
}: WhoKnowsMeBestProps) {
  const [inputText, setInputText] = useState("");
  const [localReactions, setLocalReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);

  // Reset input field when moving to the next prompt
  useEffect(() => {
    setInputText("");
  }, [currentPrompt.id]);

  // Handle local floating reactions synchronized through the WS state
  useEffect(() => {
    if (state?.lastReaction) {
      const emoji = EMOJI_MAP[state.lastReaction.type] || "❤️";
      const newReaction = {
        id: state.lastReaction.timestamp + Math.random(),
        emoji,
        left: Math.random() * 60 + 20
      };
      setLocalReactions((prev) => [...prev, newReaction]);
      const timer = setTimeout(() => {
        setLocalReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state?.lastReaction?.timestamp, state?.lastReaction?.type]);

  const players = state?.players || [];
  const isPlayer1 = players[0] === userId;

  // Determine who the current question is about (odd prompts about P1, even about P2)
  const currentPromptIndex = state?.currentPromptIndex || 0;
  const isSubjectPlayer1 = currentPromptIndex % 2 === 0;
  const subjectId = isSubjectPlayer1 ? players[0] : players[1];
  const guesserId = isSubjectPlayer1 ? players[1] : players[0];

  const isMeSubject = userId === subjectId;
  const isMeGuesser = userId === guesserId;

  const myAnswer = userId ? answers[userId] : undefined;
  const partnerAnswer = partnerId ? answers[partnerId] : undefined;
  const iAnswered = !!myAnswer && myAnswer !== "SUBMITTED_PLACEHOLDER";
  const partnerAnswered = !!partnerAnswer;
  const bothAnswered = iAnswered && partnerAnswered;

  const subjectAnswer = answers[subjectId];
  const guesserAnswer = answers[guesserId];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmitAnswer(inputText.trim());
    }
  };

  // Determine header statuses
  let partnerStatus = "Waiting for partner...";
  if (!partnerId) {
    partnerStatus = "Waiting for partner to connect...";
  } else if (partnerAnswered) {
    partnerStatus = "Partner Voted ✅";
  } else {
    partnerStatus = "Partner Typing... 💬";
  }

  return (
    <div className="relative w-full max-w-3xl px-4 flex flex-col items-center justify-center gap-6 h-full min-h-[480px]">
      
      {/* Floating Emojis Overlay */}
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
      <div className="w-full flex flex-wrap justify-between items-center gap-2 px-2 text-xs font-semibold tracking-wider uppercase text-white font-extrabold font-bold">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Role: {isMeSubject ? "📝 You are the Subject" : "🤔 You are the Guesser"}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
          <div className={`w-2 h-2 rounded-full ${partnerAnswered ? "bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" : "bg-rose-400 animate-ping"}`} />
          <span className={partnerAnswered ? "text-green-400" : "text-rose-400"}>{partnerStatus}</span>
        </div>
      </div>

      {/* Main Game Stage Card */}
      <div className="relative w-full rounded-3xl p-8 bg-[#0d0d12]/40 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center">
        
        {/* Neon Border Top Highlight */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />

        {/* Question Header Card */}
        <div className="text-center w-full max-w-xl mb-8">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400 uppercase tracking-widest">
            {isMeSubject ? "This question is about YOU!" : "This question is about PARTNER"}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-white drop-shadow-md">
            {currentPrompt.text}
          </h2>
        </div>

        {/* State 1: Input Text Form (I haven't answered yet) */}
        {!iAnswered && (
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center max-w-xl"
          >
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isMeSubject ? "Write your honest answer about yourself..." : "What do you think their answer is? Guess it!"}
              className="w-full bg-[#16161c]/80 border border-white/10 rounded-2xl p-5 text-base text-white font-extrabold focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 resize-none min-h-[120px] shadow-inner transition-all placeholder:text-white/20 leading-relaxed"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className="mt-6 px-10 py-3.5 rounded-full font-black tracking-widest text-xs uppercase bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95 border border-rose-400/20"
            >
              Lock in Answer
            </button>
          </motion.form>
        )}

        {/* State 2: Answer Locked (Waiting for Partner) */}
        {iAnswered && !bothAnswered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-14 h-14 rounded-full border-4 border-rose-500 border-t-transparent animate-spin mb-6 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-rose-500/10" />
            </div>
            <h3 className="text-xl font-bold text-white bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent">Choice Securely Locked!</h3>
            <p className="text-white font-extrabold font-bold mt-2 text-sm max-w-xs">Waiting for your partner to submit their answer to reveal side-by-side.</p>
          </motion.div>
        )}

        {/* State 3: Both Answered (The Cinematic Reveal) */}
        {bothAnswered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col gap-6"
          >
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Subject's Real Answer Card */}
              <div className="flex-1 rounded-2xl p-6 border border-rose-500/30 bg-gradient-to-b from-rose-500/5 via-transparent to-transparent shadow-lg text-left">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                    {isMeSubject ? "Your Real Answer" : "Their Real Answer"}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-rose-400" />
                </div>
                <p className="text-base md:text-lg text-white font-extrabold leading-relaxed font-medium bg-white/[0.01] p-4 rounded-xl border border-white/5">
                  {subjectAnswer}
                </p>
              </div>

              {/* Guesser's Guess Answer Card */}
              <div className="flex-1 rounded-2xl p-6 border border-indigo-500/30 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent shadow-lg text-left">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    {isMeGuesser ? "Your Guess" : "Their Guess"}
                  </span>
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <p className="text-base md:text-lg text-white font-extrabold leading-relaxed font-medium bg-white/[0.01] p-4 rounded-xl border border-white/5">
                  {guesserAnswer}
                </p>
              </div>

            </div>

            {/* Match feedback banner */}
            <div className="w-full flex flex-col items-center gap-5 mt-4">
              
              <div className="relative px-8 py-3 rounded-full border bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 border-rose-400/50 text-rose-300 shadow-[0_0_35px_rgba(244,63,94,0.25)] text-center font-extrabold tracking-widest text-xs uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>How well did they know you?</span>
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              </div>

              {/* Reaction Pill selectors */}
              {sendReaction && (
                <div className="flex flex-col items-center gap-2 bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-3 shadow-inner">
                  <span className="text-[9px] font-bold text-white/70 font-semibold uppercase tracking-widest">Tap to React</span>
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
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-all cursor-pointer border border-rose-400/20"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </motion.button>

            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
}
