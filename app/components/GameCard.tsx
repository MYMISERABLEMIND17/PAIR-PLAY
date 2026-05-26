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
  Sparkles,
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
  Flame, HelpCircle, MessageCircleHeart, Users, AlertTriangle, Heart, Smile, MicOff, RefreshCw, Sparkles,
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md bg-black/60">
          <div className="bg-[#272136] border border-red-500/30 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
              <h3 className="font-bold text-white text-lg">Error Creating Room</h3>
            </div>
            <p className="text-white/70 text-sm mb-6 whitespace-pre-wrap font-mono text-xs leading-relaxed">
              {error}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowError(false)}
                className="flex-1 py-3 rounded-2xl bg-white/5 text-white/80 hover:bg-white/10 transition-colors font-medium text-sm"
              >
                Dismiss
              </button>
              <button
                onClick={() => router.push(`/room/offline-demo-${href.replace('/', '').replace(/-/g, '_')}`)}
                className="flex-1 py-3 rounded-2xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-semibold text-sm"
              >
                Play Offline
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`elevated-card rounded-3xl p-8 h-full flex flex-col relative group block ${isCreating ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Subtle top border highlight for depth */}
        <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#f185d3]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
        <div className={`w-14 h-14 rounded-2xl glass-panel shadow-inner mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
          {isCreating ? (
            <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : (
            <Icon className="w-7 h-7 text-[#f185d3] drop-shadow-[0_0_10px_rgba(241,133,211,0.5)] transition-colors" />
          )}
        </div>

        <h3 className="font-serif text-2xl font-bold mb-3 text-white transition-colors">{title}</h3>
        <p className="text-white/60 text-sm leading-relaxed flex-grow font-medium">
          {description}
        </p>
      
        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-[#272136]/95 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 translate-y-4 group-hover:translate-y-0 rounded-3xl z-10">
          
          {!isJoining ? (
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={handleCreate}
                className={`w-full py-3.5 rounded-full font-bold text-sm text-white bg-[#501fda] hover:bg-[#501fda]/90 hover:shadow-[0_0_20px_rgba(80,31,218,0.4)] transition-all flex items-center justify-center gap-2`}
              >
                {!isCreating && <Plus className="w-4 h-4" />}
                <span>{creationStatus}</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsJoining(true); }}
                className="w-full py-3.5 rounded-full font-semibold text-sm text-white glass-panel hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Join Room
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  router.push(`/room/offline-demo-${href.replace('/', '').replace(/-/g, '_')}`); 
                }}
                className="w-full py-3 rounded-full font-medium text-xs text-[#c4a7b4] hover:text-white transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Play Offline / Explore</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleJoinSubmit} className="flex flex-col gap-4 w-full animate-in fade-in zoom-in duration-300">
              <p className="text-xs font-semibold text-white/80 uppercase tracking-widest text-center mb-1">Enter Room Code</p>
              <div className="flex items-center glass-panel rounded-full overflow-hidden focus-within:border-[#f185d3]/50 transition-colors">
                <input 
                  type="text" 
                  autoFocus
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. XJ9P2"
                  className="w-full bg-transparent p-4 text-center font-mono text-white outline-none placeholder:text-white/30 font-bold"
                  maxLength={6}
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsJoining(false); }}
                  className="flex-1 py-3.5 rounded-full text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!joinCode.trim()}
                  className={`flex-1 py-3.5 rounded-full text-xs font-bold text-white bg-[#501fda] hover:shadow-[0_0_15px_rgba(80,31,218,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

