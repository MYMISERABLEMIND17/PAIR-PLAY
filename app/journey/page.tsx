"use client";

import { useState } from "react";
import { 
  Flame, Star, Award, Heart, Lock,
  ChevronRight, Image as ImageIcon, Sparkles, Play
} from "lucide-react";

export default function JourneyEcosystem() {
  const [activeTab, setActiveTab] = useState("Milestones");

  return (
    <div className="w-full min-h-screen pt-28 pb-32 px-4 md:px-8 max-w-[1400px] mx-auto flex flex-col gap-12 relative">
      
      {/* Ambient Backgrounds */}
      <div className="absolute top-[10%] left-[10%] w-[40%] h-[30%] bg-[#7a3fff] opacity-[0.08] blur-[150px] rounded-full mix-blend-screen pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[10%] w-[30%] h-[40%] bg-[#ff6be2] opacity-[0.05] blur-[150px] rounded-full mix-blend-screen pointer-events-none -z-10" />

      {/* 1. COUPLE STREAK & LEVELING HERO */}
      <section className="relative w-full rounded-[3rem] p-8 md:p-14 overflow-hidden glass-panel border border-white/5 cinematic-shadow group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#090514] via-[#090514]/80 to-[#7a3fff]/10 z-0" />
        <img 
          src="https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=1200&auto=format&fit=crop" 
          alt="Couple Journey" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[15s]"
        />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
           
           <div>
             <div className="flex items-center gap-3 mb-4">
               <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-[0_0_20px_rgba(255,107,226,0.3)]">
                 <Flame className="w-4 h-4 text-[#ff6be2]" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-widest">14 Day Streak</span>
               </div>
               <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                 <Star className="w-4 h-4 text-[#7a3fff]" />
                 <span className="text-[10px] font-bold text-white uppercase tracking-widest">Level 12 Connection</span>
               </div>
             </div>
             
             <h1 className="font-serif text-5xl md:text-7xl font-bold text-white tracking-tight mb-2">
               Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6be2] to-[#c4a7b4]">Journey</span>
             </h1>
             <p className="text-lg text-white/60 font-medium">Building memories and deepening connection, one moment at a time.</p>
           </div>

           <div className="glass-panel p-6 rounded-3xl border border-white/10 w-full md:w-80 backdrop-blur-xl">
             <div className="flex justify-between items-center mb-4">
               <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">Next Milestone</span>
               <span className="text-xs font-bold text-[#ff6be2]">80%</span>
             </div>
             <h3 className="font-serif text-xl font-bold text-white mb-2">The Vulnerability Master</h3>
             <p className="text-xs text-white/40 mb-6 font-medium">Complete 2 more Deep Connection games to unlock this memory badge.</p>
             <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#7a3fff] to-[#ff6be2] w-[80%] rounded-full shadow-[0_0_15px_rgba(255,107,226,0.6)]" />
             </div>
           </div>

        </div>
      </section>

      {/* SUB-NAVIGATION */}
      <nav className="flex items-center gap-4 overflow-x-auto hide-scrollbar border-b border-white/5 pb-4 mask-edges">
         {["Milestones", "Memories", "Achievements", "Seasonal"].map((tab) => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-500 whitespace-nowrap border ${
               activeTab === tab 
                 ? "bg-white text-[#090514] border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                 : "glass-panel text-white/50 hover:text-white hover:bg-white/5 border-transparent"
             }`}
           >
             {tab}
           </button>
         ))}
      </nav>

      {/* 5. MILESTONE PROGRESSION & 7. MEMORY REWARD SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 flex flex-col gap-8">
           <div className="flex items-center justify-between">
             <h2 className="font-serif text-3xl font-bold text-white">Relationship Timeline</h2>
             <button className="text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-white transition-colors flex items-center gap-1">
               Filter by year <ChevronRight className="w-3 h-3" />
             </button>
           </div>

           <div className="relative pl-8 md:pl-0 border-l-2 md:border-l-0 border-white/10 space-y-12">
             
             {/* Timeline Item 1: Memory */}
             <div className="relative md:grid md:grid-cols-5 gap-8 items-center group">
               <div className="hidden md:flex flex-col items-end text-right pr-8 col-span-1">
                 <span className="text-xl font-bold text-white">Oct 14</span>
                 <span className="text-xs text-white/40 uppercase tracking-widest font-bold">2026</span>
               </div>
               
               <div className="absolute left-[-41px] md:left-1/5 md:-translate-x-1/2 w-5 h-5 rounded-full bg-[#090514] border-2 border-[#ff6be2] flex items-center justify-center shadow-[0_0_10px_rgba(255,107,226,0.5)] z-10">
                 <div className="w-2 h-2 rounded-full bg-[#ff6be2]" />
               </div>

               <div className="md:col-span-4 elevated-card p-6 rounded-[2rem] border border-white/5 flex flex-col sm:flex-row gap-6 items-center cursor-pointer overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#ff6be2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="w-full sm:w-40 h-28 rounded-xl bg-[#110b1c] overflow-hidden shrink-0 relative border border-white/10">
                   <img src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=400&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Play className="w-8 h-8 text-white drop-shadow-lg" />
                   </div>
                 </div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-2">
                     <ImageIcon className="w-3 h-3 text-[#ff6be2]" />
                     <span className="text-[10px] uppercase tracking-widest font-bold text-[#ff6be2]">Saved Memory</span>
                   </div>
                   <h3 className="font-serif text-2xl font-bold text-white mb-2">First Deep Confession</h3>
                   <p className="text-sm text-white/60 font-medium leading-relaxed">You both shared your biggest dreams for the future. A foundational moment for your relationship.</p>
                 </div>
               </div>
             </div>

             {/* Timeline Item 2: Achievement */}
             <div className="relative md:grid md:grid-cols-5 gap-8 items-center group">
               <div className="hidden md:flex flex-col items-end text-right pr-8 col-span-1">
                 <span className="text-xl font-bold text-white">Sep 28</span>
                 <span className="text-xs text-white/40 uppercase tracking-widest font-bold">2026</span>
               </div>
               
               <div className="absolute left-[-41px] md:left-1/5 md:-translate-x-1/2 w-5 h-5 rounded-full bg-[#090514] border-2 border-[#7a3fff] flex items-center justify-center shadow-[0_0_10px_rgba(122,63,255,0.5)] z-10">
                 <div className="w-2 h-2 rounded-full bg-[#7a3fff]" />
               </div>

               <div className="md:col-span-4 elevated-card p-6 rounded-[2rem] border border-[#7a3fff]/20 bg-[#7a3fff]/5 flex gap-6 items-center cursor-pointer">
                 <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center shrink-0 border border-[#7a3fff]/30 shadow-[0_0_20px_rgba(122,63,255,0.3)]">
                   <Award className="w-8 h-8 text-[#7a3fff]" />
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-[10px] uppercase tracking-widest font-bold text-[#7a3fff]">Milestone Unlocked</span>
                   </div>
                   <h3 className="font-serif text-xl font-bold text-white mb-1">Late Night Legends</h3>
                   <p className="text-sm text-white/60 font-medium">Played 10 games past midnight together.</p>
                 </div>
               </div>
             </div>

             {/* Timeline Item 3: Future Challenge */}
             <div className="relative md:grid md:grid-cols-5 gap-8 items-center opacity-60">
               <div className="hidden md:flex flex-col items-end text-right pr-8 col-span-1">
                 <span className="text-sm font-bold text-white/50">Upcoming</span>
               </div>
               
               <div className="absolute left-[-41px] md:left-1/5 md:-translate-x-1/2 w-5 h-5 rounded-full bg-[#090514] border-2 border-white/10 flex items-center justify-center z-10">
                 <Lock className="w-2 h-2 text-white/30" />
               </div>

               <div className="md:col-span-4 border border-white/5 border-dashed rounded-[2rem] p-6 flex items-center justify-center bg-white/[0.01]">
                 <div className="text-center">
                   <Lock className="w-6 h-6 text-white/30 mx-auto mb-3" />
                   <h3 className="font-serif text-lg font-bold text-white/50 mb-1">The 30-Day Connection</h3>
                   <p className="text-xs text-white/30 font-medium">Keep your streak alive to unlock this exclusive challenge.</p>
                 </div>
               </div>
             </div>

           </div>
        </div>

        {/* Right Column: AI Retention & Badges */}
        <div className="flex flex-col gap-8">
           
           {/* 11. AI-POWERED RETENTION CARD */}
           <div className="glass-panel p-8 rounded-[2rem] border border-[#ff6be2]/20 cinematic-shadow relative overflow-hidden group cursor-pointer">
             <div className="absolute inset-0 bg-gradient-to-b from-[#ff6be2]/10 to-transparent opacity-50" />
             <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#ff6be2] opacity-10 blur-[40px] rounded-full group-hover:opacity-20 transition-opacity" />
             
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                 <Sparkles className="w-4 h-4 text-[#ff6be2]" />
                 <span className="text-[10px] uppercase tracking-widest font-bold text-[#ff6be2]">AI Relationship Insight</span>
               </div>
               <h3 className="font-serif text-2xl font-bold text-white mb-3">Time to Reconnect</h3>
               <p className="text-sm text-white/60 font-medium leading-relaxed mb-6">
                 It's been a few days since your last 'Deep Conversation'. Studies show couples who check in deeply once a week maintain 40% higher intimacy levels.
               </p>
               <button className="w-full py-3 rounded-full bg-white text-[#090514] font-bold text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                 Start a Session
               </button>
             </div>
           </div>

           {/* 4. ACHIEVEMENT & BADGE GALLERY */}
           <div className="elevated-card p-8 rounded-[2rem] border border-white/5">
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-serif text-xl font-bold text-white">Your Badges</h3>
               <span className="text-xs font-bold text-white/30">4 / 24 Unlocked</span>
             </div>
             
             <div className="grid grid-cols-3 gap-4">
               {/* Unlocked Badges */}
               <div className="flex flex-col items-center gap-2 cursor-pointer group">
                 <div className="w-16 h-16 rounded-2xl glass-panel border border-[#ff6be2]/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,107,226,0.2)] group-hover:scale-110 transition-transform">
                   <Flame className="w-6 h-6 text-[#ff6be2]" />
                 </div>
                 <span className="text-[9px] text-center font-bold text-white/60 uppercase tracking-widest">Ignition</span>
               </div>
               
               <div className="flex flex-col items-center gap-2 cursor-pointer group">
                 <div className="w-16 h-16 rounded-2xl glass-panel border border-[#7a3fff]/30 flex items-center justify-center shadow-[0_0_15px_rgba(122,63,255,0.2)] group-hover:scale-110 transition-transform">
                   <Heart className="w-6 h-6 text-[#7a3fff]" />
                 </div>
                 <span className="text-[9px] text-center font-bold text-white/60 uppercase tracking-widest">Soulmate</span>
               </div>
               
               <div className="flex flex-col items-center gap-2 cursor-pointer group">
                 <div className="w-16 h-16 rounded-2xl glass-panel border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">
                   <Star className="w-6 h-6 text-amber-500" />
                 </div>
                 <span className="text-[9px] text-center font-bold text-white/60 uppercase tracking-widest">Pioneer</span>
               </div>

               {/* Locked Badges */}
               {[1,2,3].map(i => (
                 <div key={i} className="flex flex-col items-center gap-2 opacity-30 cursor-not-allowed">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                     <Lock className="w-5 h-5 text-white/20" />
                   </div>
                   <span className="text-[9px] text-center font-bold text-white/20 uppercase tracking-widest">Locked</span>
                 </div>
               ))}
             </div>
             
             <button className="w-full mt-6 py-2 border border-white/10 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest hover:bg-white/5 transition-colors">
               View All Achievements
             </button>
           </div>

        </div>

      </div>
    </div>
  );
}
