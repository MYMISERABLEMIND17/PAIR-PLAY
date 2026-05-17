"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Flame, 
  HelpCircle, 
  MessageCircleHeart, 
  Users, 
  AlertTriangle, 
  Heart, 
  Smile, 
  MicOff, 
  RefreshCw,
  Plus,
  ArrowRight,
  type LucideIcon 
} from "lucide-react";
import { createNewRoom } from "../../lib/roomUtils";

interface GameCardProps {
  title: string;
  description: string;
  href: string; // e.g., /truth-or-dare
  colorClass: string;
  iconName: string;
}

const iconMap: Record<string, LucideIcon> = {
  Flame, HelpCircle, MessageCircleHeart, Users, AlertTriangle, Heart, Smile, MicOff, RefreshCw,
};

export default function GameCard({ title, description, href, colorClass, iconName }: GameCardProps) {
  const Icon = iconMap[iconName] || Flame;
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState("Create Room");
  const [isJoining, setIsJoining] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);

  const handleCreate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const rawGameId = href.startsWith('/') ? href.slice(1) : href;
    const gameId = rawGameId.replace(/-/g, '_');

    if (gameId === '#' || gameId === '') {
      setError("Invalid game ID");
      setShowError(true);
      return;
    }

    setIsCreating(true);
    setCreationStatus("Creating Room...");
    setError("");

    const statusTimer = setTimeout(() => {
      setCreationStatus("Waking up server... 🚀");
    }, 3000);

    try {
      const roomId = await createNewRoom(gameId);
      clearTimeout(statusTimer);
      if (!roomId) {
        throw new Error("Failed to generate room ID");
      }
      router.push(`/room/${roomId}`);
    } catch (err) {
      clearTimeout(statusTimer);
      const errorMsg = err instanceof Error ? err.message : "Failed to create room. Check your internet connection and Firebase configuration.";
      console.error("Failed to create room:", err);
      setError(errorMsg);
      setShowError(true);
      setIsCreating(false);
      setCreationStatus("Create Room");
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (joinCode.trim().length > 0) {
      router.push(`/room/${joinCode.trim()}`);
    }
  };

  return (
    <>
      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/50">
          <div className="bg-[#0a0a0a] border border-red-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
              <h3 className="font-bold text-white text-lg">Error Creating Room</h3>
            </div>
            <p className="text-white/70 text-sm mb-6 whitespace-pre-wrap font-mono text-xs leading-relaxed">
              {error}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowError(false)}
                className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-bold text-sm"
              >
                Dismiss
              </button>
              <button
                onClick={() => router.push(`/room/offline-demo-${href.replace('/', '').replace(/-/g, '_')}`)}
                className="flex-1 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors font-bold text-sm"
              >
                Play Offline
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={`elevated-card rounded-2xl p-6 h-full flex flex-col relative overflow-hidden group block ${isCreating ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Subtle top border highlight for depth */}
        <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${colorClass} opacity-50 group-hover:opacity-100 transition-opacity`} />
      
      <div className={`w-12 h-12 rounded-xl bg-[#1a1a1e] border border-white/5 shadow-inner mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        {isCreating ? (
          <div className="w-5 h-5 rounded-full border-2 border-white/50 border-t-transparent animate-spin" />
        ) : (
          <Icon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
        )}
      </div>

      <h3 className="text-xl font-bold mb-2 text-white/90 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed flex-grow">
        {description}
      </p>
      
      {/* Hover Actions Overlay */}
      <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 translate-y-4 group-hover:translate-y-0">
        
        {!isJoining ? (
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={handleCreate}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-gradient-to-r ${colorClass} hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg`}
            >
              {!isCreating && <Plus className="w-4 h-4" />}
              <span>{creationStatus}</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsJoining(true); }}
              className="w-full py-3 rounded-xl font-bold text-sm text-white/80 bg-[#1a1a1e] border border-white/10 hover:bg-[#2a2a2e] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Join Room
            </button>
          </div>
        ) : (
          <form onSubmit={handleJoinSubmit} className="flex flex-col gap-3 w-full animate-in fade-in zoom-in duration-200">
            <p className="text-xs font-bold text-white/50 uppercase tracking-widest text-center mb-1">Enter Room Code</p>
            <div className="flex items-center bg-[#1a1a1e] border border-white/20 rounded-xl overflow-hidden focus-within:border-white/50 transition-colors">
              <input 
                type="text" 
                autoFocus
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g. XJ9P2"
                className="w-full bg-transparent p-3 text-center font-mono text-white outline-none placeholder:text-white/20"
                maxLength={6}
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsJoining(false); }}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!joinCode.trim()}
                className={`flex-1 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${colorClass} hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1`}
              >
                Join <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </>
  );
}

