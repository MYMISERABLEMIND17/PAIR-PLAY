"use client";

import { useState } from "react";
import { Sparkles, Moon, Wind, Heart, Activity, ChevronRight, MessageCircle } from "lucide-react";
import GameCard from "../components/GameCard";
import deepConnectionData from "../data/deep_connection.json";
import conversationStartersData from "../data/conversation_starters.json";

export default function ExploreEcosystem() {
  const [currentMood, setCurrentMood] = useState<"quiet" | "playful" | "deep">("quiet");

  // Dynamic styling based on AI's 'read' of the room
  const moodConfig = {
    quiet: {
      gradient: "from-[#110b1c] via-[#090514] to-[#0f172a]",
      accent: "text-blue-300",
      glow: "bg-blue-500",
      title: "The energy feels quiet tonight.",
      subtitle: "We've curated a low-pressure, cozy experience to help you softly reconnect.",
      icon: Moon
    },
    playful: {
      gradient: "from-[#682c58]/40 via-[#090514] to-[#7a3fff]/20",
      accent: "text-[#ff6be2]",
      glow: "bg-[#ff6be2]",
      title: "You're both bringing high energy.",
      subtitle: "Perfect timing for something chaotic, spicy, and unpredictable.",
      icon: Activity
    },
    deep: {
      gradient: "from-[#7a3fff]/30 via-[#090514] to-[#090514]",
      accent: "text-[#7a3fff]",
      glow: "bg-[#7a3fff]",
      title: "Ready to go a little deeper?",
      subtitle: "Your recent conversations suggest you're in a highly vulnerable space.",
      icon: Sparkles
    }
  };

  const active = moodConfig[currentMood];
  const ActiveIcon = active.icon;

  return (
    <div className={`relative w-full min-h-screen pt-28 pb-32 px-4 md:px-8 max-w-[1400px] mx-auto flex flex-col gap-12 transition-colors duration-[2000ms] bg-gradient-to-br ${active.gradient}`}>
      
      {/* 8. AI ROOM & AMBIANCE ADAPTATION */}
      <div className={`absolute top-[10%] left-[20%] w-[50%] h-[50%] ${active.glow} opacity-[0.03] blur-[150px] rounded-full mix-blend-screen pointer-events-none transition-all duration-[3000ms]`} />

      {/* 1. EMOTIONAL PERSONALIZATION HERO */}
      <section className="relative w-full rounded-[3rem] p-10 md:p-16 overflow-hidden glass-panel border border-white/5 cinematic-shadow">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
           <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-transform hover:scale-105">
             <ActiveIcon className={`w-8 h-8 ${active.accent}`} />
           </div>
           
           <h1 className="font-serif text-5xl md:text-7xl font-bold text-white tracking-tight mb-4 transition-all duration-1000">
             {active.title}
           </h1>
           <p className="text-lg md:text-xl text-white/50 font-medium leading-relaxed mb-10 transition-all duration-1000">
             {active.subtitle}
           </p>

           {/* Manual Mood Override (Testing purposes, normally invisible AI layer) */}
           <div className="flex items-center gap-4 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
             {(["quiet", "playful", "deep"] as const).map(mood => (
               <button 
                 key={mood}
                 onClick={() => setCurrentMood(mood)}
                 className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 ${currentMood === mood ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
               >
                 {mood}
               </button>
             ))}
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column: Adaptive Content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
           
           {/* 2. AI GAME RECOMMENDATIONS */}
           <div className="flex items-center justify-between px-2 mb-2">
             <h2 className="font-serif text-3xl font-bold text-white">Curated for Tonight</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             {currentMood === "quiet" && (
               <>
                 <div className="elevated-card p-0 rounded-[2rem] overflow-hidden group cursor-pointer border border-white/5">
                   <div className="p-8 pb-10 bg-gradient-to-b from-[#110b1c] to-[#090514]">
                     <div className="flex items-center gap-2 mb-4">
                       <Sparkles className={`w-4 h-4 ${active.accent}`} />
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${active.accent}`}>AI Suggestion</span>
                     </div>
                     <h3 className="font-serif text-2xl font-bold text-white mb-2">Pillow Talk</h3>
                     <p className="text-sm text-white/50 font-medium">Soft, slow conversation starters. Perfect for winding down.</p>
                   </div>
                 </div>
                 <GameCard 
                   title="Deep Connection" 
                   description="Explore vulnerabilities and future dreams." 
                   colorClass="from-blue-900 to-[#090514]" 
                   iconName="Heart" 
                   href="/deep-connection" 
                 />
               </>
             )}

             {currentMood === "deep" && (
               <>
                 <GameCard 
                   title={deepConnectionData.name} 
                   description={deepConnectionData.description} 
                   colorClass={deepConnectionData.color} 
                   iconName={deepConnectionData.icon} 
                   href="/deep-connection" 
                 />
                 <div className="elevated-card p-0 rounded-[2rem] overflow-hidden group cursor-pointer border border-white/5 relative">
                   <img src="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:opacity-50 transition-all duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#090514] via-[#090514]/80 to-transparent" />
                   <div className="relative z-10 p-8 pt-32">
                     <div className="flex items-center gap-2 mb-2">
                       <Sparkles className="w-4 h-4 text-[#ff6be2]" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff6be2]">Generated Event</span>
                     </div>
                     <h3 className="font-serif text-2xl font-bold text-white mb-2">The 'Future Us' Simulation</h3>
                     <p className="text-sm text-white/50 font-medium">An AI-crafted scenario exploring where you'll be in 5 years.</p>
                   </div>
                 </div>
               </>
             )}

             {currentMood === "playful" && (
               <>
                 <GameCard 
                   title="Spicy Roulette" 
                   description="High stakes, fast paced, entirely unpredictable." 
                   colorClass="from-rose-500 to-purple-600" 
                   iconName="Flame" 
                   href="#" 
                 />
                 <GameCard 
                   title="Truth or Dare" 
                   description="The classic, remixed for maximum chaos." 
                   colorClass="from-[#ff6be2] to-[#7a3fff]" 
                   iconName="Activity" 
                   href="/truth-or-dare" 
                 />
               </>
             )}
           </div>

           {/* 9. CONFLICT-SOFTENING & RECONNECTION */}
           {currentMood === "quiet" && (
             <div className="glass-panel p-8 rounded-[2rem] border border-blue-500/20 cinematic-shadow relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50" />
               <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center shrink-0 relative z-10">
                 <Wind className="w-6 h-6 text-blue-400" />
               </div>
               <div className="relative z-10 flex-1">
                 <h3 className="font-serif text-xl font-bold text-white mb-2">The Reset Moment</h3>
                 <p className="text-sm text-white/50 font-medium mb-4">It's been a long week. Before jumping into a game, try a 2-minute shared breathing exercise to synchronize your energy.</p>
                 <button className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white hover:text-black transition-colors text-xs font-bold uppercase tracking-widest text-white border border-white/20">
                   Start Reset
                 </button>
               </div>
             </div>
           )}

        </div>

        {/* Right Column: AI Insights & Memory */}
        <div className="flex flex-col gap-6">
           
           {/* 7. EMOTIONAL INSIGHT SYSTEM */}
           <div className="elevated-card p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-b from-[#7a3fff]/5 to-transparent" />
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-6">
                 <Heart className={`w-4 h-4 ${active.accent}`} />
                 <span className={`text-[10px] uppercase tracking-widest font-bold ${active.accent}`}>Relationship Pattern</span>
               </div>
               
               <h3 className="font-serif text-2xl font-bold text-white mb-4">Communication Flow</h3>
               <p className="text-sm text-white/60 font-medium leading-relaxed mb-6">
                 You and Taylor have a beautiful rhythm. When Taylor answers deeply, you naturally match their vulnerability 85% of the time. 
               </p>
               
               <div className="w-full h-12 flex items-center gap-1 opacity-70">
                 {[40, 60, 80, 100, 85, 90, 70, 50].map((h, i) => (
                   <div key={i} className="flex-1 bg-[#7a3fff]/30 rounded-t-sm" style={{ height: `${h}%` }} />
                 ))}
               </div>
             </div>
           </div>

           {/* 4. AI CONVERSATION PROMPTS */}
           <div className="glass-panel p-8 rounded-[2rem] border border-white/5 relative cursor-pointer group hover:border-white/20 transition-colors">
             <div className="absolute inset-0 bg-black/20 rounded-[2rem]" />
             <div className="relative z-10 flex flex-col items-center text-center">
               <MessageCircle className="w-6 h-6 text-white/40 mb-4 group-hover:text-white transition-colors" />
               <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3">Instant Icebreaker</h4>
               <p className="font-serif text-xl font-bold text-white mb-6">"What's one small thing I did this week that made you smile?"</p>
               <button className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                 Send to Taylor <ChevronRight className="w-3 h-3" />
               </button>
             </div>
           </div>

        </div>

      </div>
    </div>
  );
}
