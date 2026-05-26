"use client";

import { useState } from "react";
import {
  Home, Compass, Gamepad2, Heart, Award,
  Flame, Sparkles, Image as ImageIcon,
  ChevronRight, ArrowRight
} from "lucide-react";

export default function DashboardEcosystem() {
  const [activeTab, setActiveTab] = useState("Home");

  const sidebarNav = [
    { name: "Home", icon: Home },
    { name: "Explore", icon: Compass },
    { name: "Games", icon: Gamepad2 },
    { name: "Challenges", icon: Award },
    { name: "Memories", icon: ImageIcon },
    { name: "Stats", icon: Heart },
  ];

  return (
    <div className="w-full min-h-screen pt-28 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto flex gap-8">
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className="hidden lg:flex w-64 flex-col gap-8 shrink-0 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar">
        {/* User Profile Mini */}
        <div className="flex items-center gap-4 p-4 rounded-3xl glass-panel border border-white/5 cursor-pointer group hover:bg-white/5 transition-colors cinematic-shadow">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-[#7a3fff] overflow-hidden">
              <img src="https://i.pravatar.cc/150?img=32" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#ff6be2] border-2 border-[#090514] flex items-center justify-center shadow-[0_0_10px_rgba(255,107,226,0.6)]">
              <Heart className="w-3 h-3 text-white fill-white" />
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Alex & Taylor</h3>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Level 12 Couple</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {sidebarNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${isActive
                    ? "bg-gradient-to-r from-[#7a3fff]/20 to-transparent text-white border-l-2 border-[#7a3fff]"
                    : "text-white/50 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#7a3fff]" : "text-white/40"}`} />
                {item.name}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* 2. MAIN EXPERIENCE AREA */}
      <main className="flex-1 flex flex-col gap-12 min-w-0 pb-20">

        {/* Cinematic Greeting & Emotional Prompt */}
        <section className="relative w-full rounded-[2.5rem] overflow-hidden glass-panel p-8 md:p-12 border border-white/5 cinematic-shadow group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7a3fff]/10 via-[#090514] to-[#ff6be2]/10 opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] bg-[#682c58] opacity-[0.15] blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Good evening, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6be2] to-[#c4a7b4]">Alex.</span>
              </h1>
              <p className="text-white/60 font-medium text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6be2] animate-pulse shadow-[0_0_8px_rgba(255,107,226,0.8)]" />
                Taylor is waiting in the Late Night Lounge.
              </p>
            </div>
            <button className="px-8 py-4 rounded-full bg-white text-[#090514] font-bold text-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all flex items-center gap-3 transform hover:-translate-y-1">
              Join Session <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 4. CONTINUE PLAYING SYSTEM */}
        <section className="flex flex-col gap-5">
          <h2 className="font-serif text-2xl font-bold text-white px-2">Continue Your Journey</h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Active Game Card */}
            <div className="elevated-card p-6 flex flex-col group cursor-pointer border-t-2 border-[#7a3fff]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7a3fff] animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#7a3fff]">In Progress</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">2 hrs ago</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2 group-hover:text-[#ff6be2] transition-colors">Truth or Dare: Deep Pack</h3>
              <p className="text-white/50 text-sm font-medium mb-8">You left off on a Dare for Taylor. It's your move.</p>

              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-auto">
                <div className="bg-gradient-to-r from-[#7a3fff] to-[#ff6be2] w-[60%] h-full rounded-full shadow-[0_0_10px_rgba(122,63,255,0.8)]" />
              </div>
            </div>

            {/* AI Highlight / Milestone */}
            <div className="elevated-card p-6 flex flex-col group cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6be2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <Sparkles className="w-4 h-4 text-[#ff6be2]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff6be2]">AI Relationship Insight</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3 relative z-10">You're deeply aligned.</h3>
              <p className="text-white/50 text-sm font-medium mb-6 relative z-10 leading-relaxed">
                In your last 3 games, you both consistently chose answers focusing on future goals. We recommend exploring the 'Future Us' challenge.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[#ff6be2] text-xs font-bold uppercase tracking-widest">
                View Challenge <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </section>

        {/* 5. RECOMMENDATION ENGINE (Editorial Layout) */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-serif text-2xl font-bold text-white">Tonight's Energy</h2>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Curated for you</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Large */}
            <div className="md:col-span-2 elevated-card p-8 min-h-[280px] relative flex flex-col justify-end group cursor-pointer overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-[#090514] via-[#090514]/60 to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[10s] opacity-40 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-60" />

              <div className="relative z-20">
                <div className="inline-flex px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-4 border border-white/10">
                  Recommended Experience
                </div>
                <h3 className="font-serif text-3xl font-bold text-white mb-2">The Vulnerability Challenge</h3>
                <p className="text-white/70 text-sm font-medium">10 questions designed to unlock new emotional depths.</p>
              </div>
            </div>

            {/* Feature Compact */}
            <div className="elevated-card p-6 flex flex-col justify-between group cursor-pointer bg-gradient-to-br from-[#682c58]/30 to-[#090514] border border-white/5">
              <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center mb-4 text-[#ff6be2] text-xl shadow-[0_0_15px_rgba(255,107,226,0.3)]">
                🔥
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">Spicy Roulette</h3>
                <p className="text-white/50 text-sm font-medium">High energy, high stakes. Perfect for late nights.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 3. RIGHT RETENTION PANEL */}
      <aside className="hidden xl:flex w-80 flex-col gap-6 shrink-0 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar">

        {/* Streak & Progression */}
        <div className="glass-panel p-6 rounded-[2rem] border border-white/5 cinematic-shadow relative overflow-hidden group">
          <div className="absolute top-[-50%] right-[-20%] w-[100%] h-[100%] bg-[#ff6be2] opacity-[0.05] blur-[60px] rounded-full pointer-events-none transition-opacity group-hover:opacity-[0.08]" />

          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/50">Connection Streak</h4>
            <Flame className="w-4 h-4 text-[#ff6be2]" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-serif text-6xl font-bold text-white tracking-tight drop-shadow-2xl">14</span>
            <span className="text-sm font-bold text-white/40">days</span>
          </div>
          <p className="text-xs text-white/50 font-medium mb-6">You're in the top 10% of couples this week. Keep it up!</p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map(day => (
              <div key={day} className={`flex-1 h-1.5 rounded-full ${day <= 4 ? "bg-gradient-to-r from-[#7a3fff] to-[#ff6be2] shadow-[0_0_8px_rgba(255,107,226,0.6)]" : "bg-white/5"}`} />
            ))}
          </div>
        </div>

        {/* 7. LIVE ACTIVITY SYSTEM */}
        <div className="glass-panel p-6 rounded-[2rem] border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/50">Live Ecosystem</h4>
            <div className="w-2 h-2 rounded-full bg-[#7a3fff] animate-pulse shadow-[0_0_8px_rgba(122,63,255,0.8)]" />
          </div>
          <div className="flex flex-col gap-5">
            {/* Feed Item */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0">
                <img src="https://i.pravatar.cc/150?img=44" className="w-full h-full grayscale opacity-80" />
              </div>
              <div>
                <p className="text-xs text-white/80 font-medium leading-relaxed">Sarah & Mike just completed the <span className="text-[#ff6be2]">Trust Fall</span> challenge.</p>
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1 block">2m ago</span>
              </div>
            </div>
            {/* Feed Item */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden shrink-0 flex items-center justify-center bg-[#682c58]/30">
                🏆
              </div>
              <div>
                <p className="text-xs text-white/80 font-medium leading-relaxed">Global Event: <span className="text-[#7a3fff]">Midnight Confessions</span> is now active.</p>
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1 block">15m ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* 9. MEMORY SYSTEM PROMPT */}
        <div className="elevated-card p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group cursor-pointer mt-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-[#090514] to-[#7a3fff]/20 opacity-80" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center mb-4">
              <ImageIcon className="w-5 h-5 text-[#c4a7b4]" />
            </div>
            <h4 className="font-serif text-xl font-bold text-white mb-2">1 Year Ago Today</h4>
            <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-5">Relive your first game</p>
            <button className="px-5 py-2.5 rounded-full glass-panel text-xs font-bold text-white hover:bg-white hover:text-[#090514] transition-colors w-full border border-white/10">
              View Memory
            </button>
          </div>
        </div>

      </aside>
    </div>
  );
}
