"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Heart, Copy, Check, AlertTriangle, Mic, Video, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import truthOrDareData from "../../data/truth_or_dare.json";
import wouldYouRatherData from "../../data/would_you_rather.json";
import conversationStartersData from "../../data/conversation_starters.json";
import deepConnectionData from "../../data/deep_connection.json";
import whoKnowsMeBestData from "../../data/who_knows_me_best.json";
import thisOrThatData from "../../data/this_or_that.json";
import questionsForBoyfriendData from "../../data/questions_for_boyfriend.json";
import speedDatingData from "../../data/speed_dating.json";
import charadesData from "../../data/charades.json";
import truthAndDareCouplesData from "../../data/truth_and_dare_couples.json";
import confessionData from "../../data/confession.json";
import { useRoom } from "../../../lib/useRoom";
import TruthOrDare from "../../components/games/TruthOrDare";
import WouldYouRather from "../../components/games/WouldYouRather";
import ConversationStarters from "../../components/games/ConversationStarters";
import DeepConnection from "../../components/games/DeepConnection";
import WhoKnowsMeBest from "../../components/games/WhoKnowsMeBest";
import ThisOrThat from "../../components/games/ThisOrThat";
import QuestionsToAskYourBoyfriend from "../../components/games/QuestionsToAskYourBoyfriend";
import SpeedDating from "../../components/games/SpeedDating";
import Charades from "../../components/games/Charades";
import Confession from "../../components/games/Confession";

const gameRegistry: Record<string, { data: any, Component: any }> = {
  truth_or_dare: { data: truthOrDareData, Component: TruthOrDare },
  would_you_rather: { data: wouldYouRatherData, Component: WouldYouRather },
  conversation_starters: { data: conversationStartersData, Component: ConversationStarters },
  deep_connection: { data: deepConnectionData, Component: DeepConnection },
  who_knows_me_best: { data: whoKnowsMeBestData, Component: WhoKnowsMeBest },
  this_or_that: { data: thisOrThatData, Component: ThisOrThat },
  boyfriend_questions: { data: questionsForBoyfriendData, Component: QuestionsToAskYourBoyfriend },
  speed_dating: { data: speedDatingData, Component: SpeedDating },
  charades: { data: charadesData, Component: Charades },
  truth_and_dare_couples: { data: truthAndDareCouplesData, Component: TruthOrDare },
  confession: { data: confessionData, Component: Confession },
};

const LOADING_TIPS = [
  "Dimming the lights...",
  "Pouring the wine...",
  "Setting the mood...",
  "Establishing a secure connection...",
  "Preparing intimate challenges...",
  "Syncing emotional states..."
];

// Mulberry32 deterministic pseudo-random number generator
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Deterministic seed-based shuffle
function deterministicShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = mulberry32(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  return shuffled;
}

export default function CoupleRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { 
    state, userId, loading, error, isOfflineMode, 
    flipCard, nextPrompt, sendReaction, submitAnswer,
    enableOfflineMode, simulatePartnerJoin
  } = useRoom(roomId);
  const [reactions, setReactions] = useState<{ id: number; left: number; type: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [tipIndex, setTipIndex] = useState(0);
  const [showReactionMenu, setShowReactionMenu] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  // Rotating tips effect
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  // Listen for new reactions
  useEffect(() => {
    if (state?.lastReaction) {
      const newReaction = { 
        id: state.lastReaction.timestamp, 
        left: Math.random() * 80 + 10,
        type: state.lastReaction.type
      };
      setReactions((prev) => [...prev, newReaction]);
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
      }, 3000);
    }
  }, [state?.lastReaction?.timestamp]);

  useEffect(() => {
    if (roomId.startsWith('offline-demo-')) {
      const gameId = roomId.replace('offline-demo-', '');
      enableOfflineMode(gameId);
    }
  }, [roomId]);

  const isOfflineDemo = roomId.startsWith('offline-demo-');

  // Loading States
  if (isOfflineDemo && (loading || !state || !userId)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090514]">
        <div className="w-10 h-10 rounded-full border-4 border-white/5 border-t-[#ff6be2] animate-spin shadow-[0_0_20px_rgba(255,107,226,0.5)]" />
      </div>
    );
  }

  if (!isOfflineDemo && (loading || (!state && !error) || !userId)) {
    const progressWidth = `${(countdown / 45) * 100}%`;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#090514] relative overflow-hidden">
        {/* Cinematic Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7a3fff]/10 via-[#090514] to-[#ff6be2]/5 opacity-80 blur-3xl pointer-events-none" />
        
        <div className="relative w-full max-w-lg rounded-[2.5rem] p-10 bg-[#110b1c]/80 border border-white/5 backdrop-blur-3xl cinematic-shadow text-center flex flex-col items-center">
          
          <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#ff6be2]/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-[#7a3fff]/30 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[#ff6be2] animate-spin shadow-[0_0_15px_rgba(255,107,226,0.6)]" />
            <span className="text-3xl font-black text-white font-mono">{countdown}</span>
          </div>

          <h2 className="font-serif text-3xl font-bold bg-gradient-to-r from-[#ff6be2] to-[#c4a7b4] bg-clip-text text-transparent mb-3">
            Preparing Lounge
          </h2>
          
          <div className="w-full h-8 flex items-center justify-center mb-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-medium text-white/50 uppercase tracking-widest"
              >
                {LOADING_TIPS[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="relative w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-10">
            <div
              style={{ width: progressWidth }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#7a3fff] to-[#ff6be2] shadow-[0_0_15px_rgba(255,107,226,0.8)] transition-all duration-1000"
            />
          </div>

          <div className="flex flex-col gap-4 w-full border-t border-white/5 pt-6">
            <button
              onClick={() => enableOfflineMode('truth_or_dare')}
              className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-widest glass-panel hover:bg-white hover:text-[#090514] text-white transition-colors duration-500 border border-white/10"
            >
              Skip to Offline Mode
            </button>
            <Link
              href="/dashboard"
              className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error States (Network Blocked, Full, Not Found)
  if (error === 'not_found' || error === 'full' || error === 'network_blocked') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#090514] relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-500 opacity-[0.05] blur-[120px] mix-blend-screen" />
        <div className="w-24 h-24 rounded-full glass-panel flex items-center justify-center mb-6 border border-white/10 cinematic-shadow">
          <AlertTriangle className="w-10 h-10 text-white/80" />
        </div>
        <h1 className="font-serif text-4xl font-bold mb-4 text-white">Connection Interrupted</h1>
        <p className="text-white/50 mb-10 max-w-md text-sm font-medium leading-relaxed">
          {error === 'network_blocked' ? "Your network or adblocker is blocking the real-time server connection. Disable them to play online." : 
           error === 'full' ? "This room is currently full. Winkd rooms are strictly private for two people." :
           "We couldn't find a room with this code. Please verify your link."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
           {error === 'network_blocked' && (
             <button onClick={() => enableOfflineMode('truth_or_dare')} className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7a3fff] to-[#682c58] text-white font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(122,63,255,0.4)] transition-all">
               Play Offline Demo
             </button>
           )}
           <Link href="/dashboard" className="px-8 py-3.5 rounded-full glass-panel text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-[#090514] transition-all">
             Back to Lounge
           </Link>
        </div>
      </div>
    );
  }

  const partnerId = state!.players.find(id => id !== userId);
  const partnerPresence = partnerId ? state!.presences?.[partnerId] : null;
  const isPartnerOnline = !!partnerId && partnerPresence?.state === 'connected';
  const isPartnerReconnecting = partnerPresence?.state === 'reconnecting' || partnerPresence?.state === 'stale'; 

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const activeGame = gameRegistry[state!.gameId] || gameRegistry['truth_or_dare'];
  const rawPrompts = activeGame.data.prompts;
  const prompts = state!.seed ? deterministicShuffle(rawPrompts, state!.seed) : rawPrompts;
  const currentPrompt = prompts[state!.currentPromptIndex];
  const GameComponent = activeGame.Component;

  const reactionEmojis = [
    { type: 'heart', emoji: '❤️' },
    { type: 'fire', emoji: '🔥' },
    { type: 'laugh', emoji: '😂' },
    { type: 'spicy', emoji: '🌶️' },
    { type: 'wow', emoji: '✨' }
  ];

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen pt-4 pb-10 max-w-7xl mx-auto w-full overflow-hidden bg-[#090514]">
      
      {/* Cinematic Ambient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#7a3fff]/5 via-[#090514] to-[#ff6be2]/5 pointer-events-none -z-20" />
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80%] h-[50%] bg-[#682c58] opacity-[0.08] blur-[150px] rounded-full mix-blend-screen pointer-events-none -z-10" />

      {/* Floating Reactions Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute bottom-28 animate-float-up opacity-0 text-4xl drop-shadow-[0_0_15px_rgba(255,107,226,0.6)]"
            style={{ left: `${reaction.left}%` }}
          >
            {reactionEmojis.find(r => r.type === reaction.type)?.emoji || '❤️'}
          </div>
        ))}
      </div>

      {/* 2. VOICE & VIDEO INTERACTION UI (Floating Top Header) */}
      <header className="w-full px-6 flex justify-between items-start mb-8 relative z-30">
        
        {/* Self Presence Widget */}
        <div className="glass-panel p-2 rounded-2xl flex flex-col items-center gap-2 border border-white/5 cinematic-shadow w-24 relative overflow-hidden group">
          <div className="absolute inset-0 border-2 border-[#7a3fff] rounded-2xl opacity-50 shadow-[inset_0_0_15px_rgba(122,63,255,0.4)] pointer-events-none" />
          <div className="w-20 h-24 rounded-xl bg-[#090514] overflow-hidden relative">
             <img src="https://i.pravatar.cc/150?img=32" alt="You" className="w-full h-full object-cover opacity-80" />
             <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10">
               <Mic className="w-3 h-3 text-[#ff6be2]" />
             </div>
          </div>
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">You</span>
        </div>

        {/* Room Atmosphere & Status */}
        <div className="flex flex-col items-center mt-2">
          <div className="glass-panel px-6 py-2.5 rounded-full border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 backdrop-blur-3xl">
            <div className="w-2 h-2 rounded-full bg-[#ff6be2] animate-pulse shadow-[0_0_8px_rgba(255,107,226,0.8)]" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{activeGame.data.name}</span>
            <span className="text-white/20">|</span>
            <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Room {roomId.substring(0,6)}</span>
          </div>
          {!isPartnerOnline && !isOfflineMode && (
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-4 animate-pulse">
              {isPartnerReconnecting ? 'Partner is reconnecting...' : 'Waiting for partner to connect...'}
            </span>
          )}
        </div>

        {/* Partner Presence Widget */}
        <div className={`glass-panel p-2 rounded-2xl flex flex-col items-center gap-2 border border-white/5 cinematic-shadow w-24 relative overflow-hidden transition-all duration-700 ${!isPartnerOnline ? 'opacity-40 grayscale' : 'opacity-100 grayscale-0'}`}>
          {isPartnerOnline && <div className="absolute inset-0 border-2 border-[#ff6be2] rounded-2xl opacity-50 shadow-[inset_0_0_15px_rgba(255,107,226,0.4)] pointer-events-none" />}
          <div className="w-20 h-24 rounded-xl bg-[#090514] overflow-hidden relative">
             {isPartnerOnline ? (
               <img src="https://i.pravatar.cc/150?img=44" alt="Partner" className="w-full h-full object-cover opacity-80" />
             ) : (
               <div className="w-full h-full flex items-center justify-center bg-white/5">
                 <Video className="w-6 h-6 text-white/20" />
               </div>
             )}
             {isPartnerOnline && (
               <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10">
                 <Mic className="w-3 h-3 text-[#7a3fff]" />
               </div>
             )}
          </div>
          <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
            {isPartnerOnline ? 'Taylor' : 'Waiting'}
          </span>
        </div>
      </header>

      {/* Waiting Overlay / Invite Flow */}
      {!isPartnerOnline && !isOfflineMode && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#090514]/60 backdrop-blur-md" />
          <div className="elevated-card p-10 max-w-md w-full text-center flex flex-col items-center relative z-10 border border-[#ff6be2]/20">
            <div className="w-16 h-16 mb-6 rounded-full glass-panel flex items-center justify-center shadow-[0_0_20px_rgba(255,107,226,0.3)]">
               <Sparkles className="w-8 h-8 text-[#ff6be2] animate-pulse" />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-3 text-white">Your Room is Ready</h2>
            <p className="text-white/50 text-sm font-medium mb-8 leading-relaxed">
              Share this secure link with your partner. The experience begins as soon as they arrive.
            </p>
            
            <div className="flex w-full items-center bg-[#090514] rounded-full p-1.5 border border-white/10 mb-6">
              <input 
                type="text" 
                readOnly 
                value={`winkd.app/room/${roomId}`} 
                className="bg-transparent flex-grow text-center text-xs font-mono text-white/60 outline-none ml-4"
              />
              <button 
                onClick={handleCopyLink}
                className="bg-gradient-to-r from-[#7a3fff] to-[#682c58] hover:shadow-[0_0_15px_rgba(122,63,255,0.4)] transition-all text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            
            {isOfflineMode && (
              <button onClick={simulatePartnerJoin} className="text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors mt-2">
                Simulate Partner Connection
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. LIVE GAMEPLAY INTERFACE */}
      <div className="flex-1 w-full flex items-center justify-center relative z-20">
         <GameComponent 
           currentPrompt={currentPrompt} 
           isFlipped={state!.isFlipped} 
           onFlip={flipCard} 
           onNext={() => nextPrompt(prompts.length)}
           answers={state!.answers || {}}
           userId={userId}
           partnerId={partnerId}
           onSubmitAnswer={submitAnswer}
           sendReaction={sendReaction}
           state={state}
         />
      </div>

      {/* 7. LIVE REACTION SYSTEM & BOTTOM CONTROLS */}
      <div className="w-full flex justify-center items-center gap-6 mt-8 px-6 relative z-30">
        
        {/* Interaction Modifiers */}
        <div className="flex items-center gap-4">
           <button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5 group relative">
             <Mic className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
           </button>
           <button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-white/10 transition-colors border border-white/5 group">
             <Video className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
           </button>
        </div>

        {/* Primary Action */}
        <button 
          onClick={() => nextPrompt(prompts.length)}
          className="px-10 py-5 rounded-full font-bold tracking-widest text-xs uppercase transition-all bg-gradient-to-r from-[#7a3fff] to-[#682c58] text-white hover:shadow-[0_10px_30px_rgba(122,63,255,0.4)] border border-white/10 transform hover:-translate-y-1 active:translate-y-0"
        >
          Next Moment
        </button>

        {/* Emotional Reaction Hub */}
        <div className="relative">
           <AnimatePresence>
             {showReactionMenu && (
               <motion.div 
                 initial={{ opacity: 0, y: 20, scale: 0.9 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 10, scale: 0.9 }}
                 className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 glass-panel p-3 rounded-full flex gap-2 border border-white/10 cinematic-shadow"
               >
                 {reactionEmojis.map(reaction => (
                   <button 
                     key={reaction.type}
                     onClick={() => {
                       sendReaction(reaction.type);
                       setShowReactionMenu(false);
                     }}
                     className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-90"
                   >
                     {reaction.emoji}
                   </button>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
           
           <button 
             onClick={() => setShowReactionMenu(!showReactionMenu)}
             className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border group ${showReactionMenu ? 'bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'glass-panel border-white/5 hover:bg-white/5'}`}
           >
             <Heart className={`w-6 h-6 transition-colors ${showReactionMenu ? 'text-[#ff6be2] fill-[#ff6be2]' : 'text-white/60 group-hover:text-white'}`} />
           </button>
        </div>
        
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1) rotate(-5deg); opacity: 0; }
          20% { opacity: 1; transform: translateY(-30px) scale(1.2) rotate(5deg); }
          80% { opacity: 0.8; transform: translateY(-150px) scale(1.5) rotate(-5deg); }
          100% { transform: translateY(-200px) scale(1.6) rotate(5deg); opacity: 0; }
        }
        .animate-float-up {
          animation: floatUp 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
}
