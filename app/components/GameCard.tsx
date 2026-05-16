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
  type LucideIcon 
} from "lucide-react";
import { createNewRoom } from "../../lib/roomUtils";

interface GameCardProps {
  title: string;
  description: string;
  href: string; // The gameId is derived from this href, e.g., /truth-or-dare -> truth_or_dare
  colorClass: string;
  iconName: string;
}

const iconMap: Record<string, LucideIcon> = {
  Flame,
  HelpCircle,
  MessageCircleHeart,
  Users,
  AlertTriangle,
  Heart,
  Smile,
  MicOff,
  RefreshCw,
};

export default function GameCard({ title, description, href, colorClass, iconName }: GameCardProps) {
  const Icon = iconMap[iconName] || Flame;
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleClick = async () => {
    // Determine the gameId from the href
    // e.g. /truth-or-dare -> truth_or_dare
    const rawGameId = href.startsWith('/') ? href.slice(1) : href;
    const gameId = rawGameId.replace(/-/g, '_');

    // If it's a dummy link, do nothing for now
    if (gameId === '#' || gameId === '') return;

    setIsCreating(true);
    try {
      const roomId = await createNewRoom(gameId);
      router.push(`/room/${roomId}`);
    } catch (err) {
      console.error("Failed to create room", err);
      setIsCreating(false);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`elevated-card rounded-2xl p-6 h-full flex flex-col relative overflow-hidden group cursor-pointer block ${isCreating ? 'opacity-50 pointer-events-none' : ''}`}
    >
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
      
      <div className={`mt-6 flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-transparent bg-clip-text bg-gradient-to-r ${colorClass}`}>
        {isCreating ? "Creating Room..." : "Create Room"}
        <svg className="w-4 h-4 ml-1 text-white/50 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
