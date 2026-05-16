"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Copy, Check, AlertTriangle, XCircle, WifiOff, Activity } from "lucide-react";
import truthOrDareData from "../../data/truth_or_dare.json";
import wouldYouRatherData from "../../data/would_you_rather.json";
import conversationStartersData from "../../data/conversation_starters.json";
import deepConnectionData from "../../data/deep_connection.json";
import { useRoom } from "../../../lib/useRoom";
import TruthOrDare from "../../components/games/TruthOrDare";
import WouldYouRather from "../../components/games/WouldYouRather";
import ConversationStarters from "../../components/games/ConversationStarters";
import DeepConnection from "../../components/games/DeepConnection";

const gameRegistry: Record<string, { data: any, Component: any }> = {
  truth_or_dare: { data: truthOrDareData, Component: TruthOrDare },
  would_you_rather: { data: wouldYouRatherData, Component: WouldYouRather },
  conversation_starters: { data: conversationStartersData, Component: ConversationStarters },
  deep_connection: { data: deepConnectionData, Component: DeepConnection },
};

export default function CoupleRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { 
    state, userId, loading, error, isOfflineMode, 
    flipCard, nextPrompt, sendReaction, submitAnswer,
    enableOfflineMode, simulatePartnerJoin
  } = useRoom(roomId);
  const [reactions, setReactions] = useState<{ id: number; left: number }[]>([]);
  const [copied, setCopied] = useState(false);

  // Listen for new reactions from Firebase
  useEffect(() => {
    if (state?.lastReaction) {
      const newReaction = { id: state.lastReaction.timestamp, left: Math.random() * 80 + 10 };
      setReactions((prev) => [...prev, newReaction]);
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
      }, 2000);
    }
  }, [state?.lastReaction?.timestamp]);

  if (loading || (!state && !error) || !userId) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error === 'not_found') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">Room Not Found</h1>
        <p className="text-white/60 mb-8 max-w-md">We couldn't find a room with the code <strong>{roomId}</strong>. Please check your link or enter the correct code.</p>
        <Link href="/games" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
          Back to Games
        </Link>
      </div>
    );
  }

  if (error === 'full') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6 border border-yellow-500/20">
          <XCircle className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">Room is Full</h1>
        <p className="text-white/60 mb-8 max-w-md">This room already has two players in it! PairPlay rooms are strictly private for two people.</p>
        <Link href="/games" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
          Create Your Own Room
        </Link>
      </div>
    );
  }

  if (error === 'network_blocked') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
          <WifiOff className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-white">🔒 Connection Blocked</h1>
        <div className="text-white/60 mb-8 max-w-md text-left space-y-3 bg-white/5 p-6 rounded-xl border border-white/10">
          <p className="font-semibold text-white text-center">Your browser or network is blocking Firebase</p>
          <p className="text-sm text-center mb-4">This is usually caused by:</p>
          <ul className="text-sm space-y-2 ml-4 text-left">
            <li className="flex items-start gap-2"><span>✓</span> <span>Adblocker (uBlock Origin, Adblock Plus, etc.)</span></li>
            <li className="flex items-start gap-2"><span>✓</span> <span>VPN or Proxy Service</span></li>
            <li className="flex items-start gap-2"><span>✓</span> <span>School/Work Network Firewall</span></li>
            <li className="flex items-start gap-2"><span>✓</span> <span>Browser Privacy Settings (Firefox Enhanced Tracking)</span></li>
          </ul>
          <div className="pt-4 border-t border-white/10">
            <p className="font-semibold text-amber-300 text-center mb-3">Quick Fix:</p>
            <ol className="text-sm space-y-2 ml-4 text-left">
              <li className="flex items-start gap-2"><span>1.</span> <span>Disable your adblocker/VPN</span></li>
              <li className="flex items-start gap-2"><span>2.</span> <span>Refresh this page (F5 or Cmd+R)</span></li>
              <li className="flex items-start gap-2"><span>3.</span> <span>Try creating the room again</span></li>
            </ol>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-md">
          <button 
            onClick={() => window.location.reload()}
            className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors"
          >
            🔄 Refresh Page
          </button>
          <button 
            onClick={() => enableOfflineMode('truth_or_dare')}
            className="bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-colors"
          >
            Or Play in Demo Mode (Offline)
          </button>
          <Link href="/games" className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors">
            Back to Lobby
          </Link>
        </div>
      </div>
    );
  }

  const isPlayer1 = state!.players[0] === userId;
  const partnerId = state!.players.find(id => id !== userId);
  const isPartnerOnline = !!partnerId; 

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine the active game (state is guaranteed non-null at this point due to early returns above)
  const activeGame = gameRegistry[state!.gameId] || gameRegistry['truth_or_dare'];
  const prompts = activeGame.data.prompts;
  const currentPrompt = prompts[state!.currentPromptIndex];
  const GameComponent = activeGame.Component;

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[calc(100vh-64px)] py-8 max-w-4xl mx-auto w-full">
      
      {/* Waiting Overlay */}
      {!isPartnerOnline && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40 rounded-3xl m-4">
          <div className="elevated-card p-10 max-w-md w-full text-center flex flex-col items-center border border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.15)]">
            <div className="w-20 h-20 mb-6 rounded-full border-4 border-pink-500 border-t-transparent animate-spin flex items-center justify-center">
               <div className="w-12 h-12 rounded-full bg-pink-500/20" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Waiting for Partner...</h2>
            <p className="text-white/60 mb-8">Share this unique link with them so they can join your private room.</p>
            
            <div className="flex w-full items-center bg-[#0a0a0a] rounded-lg p-1 border border-white/10 mb-4">
              <input 
                type="text" 
                readOnly 
                value={`pairplay.app/room/${roomId}`} 
                className="bg-transparent flex-grow text-center text-sm font-mono text-white/50 outline-none"
              />
              <button 
                onClick={handleCopyLink}
                className="bg-pink-500 hover:bg-pink-600 transition-colors text-white px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Reactions Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute bottom-20 animate-float-up opacity-0"
            style={{ left: `${reaction.left}%` }}
          >
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
          </div>
        ))}
      </div>

      {/* Top Bar: Player Avatars & Status */}
      <div className="w-full flex justify-between items-center px-8 mb-4">
        {isOfflineMode && !isPartnerOnline && (
          <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={simulatePartnerJoin}
              className="text-xs font-bold px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/30 transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Simulate Partner
            </button>
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${isPlayer1 ? 'from-purple-500 to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'from-pink-500 to-rose-500 shadow-[0_0_20px_rgba(236,72,153,0.4)]'} border-2 border-white/20 flex items-center justify-center text-lg font-bold`}>
              {isPlayer1 ? 'P1' : 'P2'}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
          </div>
          <span className="text-xs font-medium text-white/70">You</span>
        </div>

        <div className="text-center">
           <h1 className="text-lg font-bold text-white/80 uppercase tracking-widest">{activeGame.data.name}</h1>
           <p className="text-xs text-white/40">Room: {roomId}</p>
        </div>

        <div className="flex flex-col items-center gap-2 opacity-50 transition-opacity duration-500" style={{ opacity: isPartnerOnline ? 1 : 0.4 }}>
           <div className="relative">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${!isPlayer1 ? 'from-purple-500 to-indigo-500' : 'from-pink-500 to-rose-500'} border-2 border-white/20 flex items-center justify-center text-lg font-bold`}>
              {!isPlayer1 ? 'P1' : 'P2'}
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${isPartnerOnline ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gray-500'} border-2 border-[#0a0a0a]`} />
          </div>
          <span className="text-xs font-medium text-white/70">
            {isPartnerOnline ? 'Partner' : 'Waiting'}
          </span>
        </div>
      </div>

      {/* Dynamic Center Stage */}
      <GameComponent 
        currentPrompt={currentPrompt} 
        isFlipped={state!.isFlipped} 
        onFlip={flipCard} 
        onNext={() => nextPrompt(prompts.length)}
        answers={state!.answers || {}}
        userId={userId}
        partnerId={partnerId}
        onSubmitAnswer={submitAnswer}
      />

      {/* Bottom Controls */}
      <div className="w-full flex justify-center items-center gap-6 mt-8 px-4 relative z-30">
        <button 
          onClick={() => sendReaction("heart")}
          className="w-14 h-14 rounded-full elevated-card flex items-center justify-center hover:bg-pink-500/10 hover:border-pink-500/50 transition-colors group"
        >
          <Heart className="w-6 h-6 text-pink-500 group-hover:fill-pink-500 transition-all group-active:scale-90" />
        </button>

        <button 
          onClick={() => nextPrompt(prompts.length)}
          className={`px-8 py-4 rounded-full font-bold tracking-wide transition-all bg-[#1a1a1e] text-white hover:bg-[#2a2a2e] active:scale-95 border border-white/10`}
        >
          Next Prompt
        </button>

        <button className="w-14 h-14 rounded-full elevated-card flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/50 transition-colors group">
          <MessageCircle className="w-6 h-6 text-blue-400 transition-all group-active:scale-90" />
        </button>
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
          0% { transform: translateY(0) scale(1) rotate(-10deg); opacity: 1; }
          50% { transform: translateY(-100px) scale(1.2) rotate(10deg); opacity: 0.8; }
          100% { transform: translateY(-250px) scale(1.5) rotate(-5deg); opacity: 0; }
        }
        .animate-float-up {
          animation: floatUp 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
}
