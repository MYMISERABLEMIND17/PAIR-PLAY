"use client";

import { Flame, Sparkles, Heart, MessageCircle, Play, ChevronRight, User } from "lucide-react";
import GameCard from "../components/GameCard";

export default function DesignSystemLivingGuide() {
  return (
    <div className="w-full min-h-screen pt-28 pb-32 px-4 md:px-8 max-w-[1400px] mx-auto flex flex-col gap-16">
      
      {/* HEADER */}
      <div className="border-b border-white/10 pb-8 mb-8">
        <div className="inline-flex px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#ff6be2] mb-4 border border-[#ff6be2]/20">
          Phase 10 Architecture
        </div>
        <h1 className="font-serif text-5xl font-bold text-white mb-4">Living Design System</h1>
        <p className="text-xl text-white/50 max-w-2xl">
          The production-ready UI foundation. This catalog proves the scalability of our emotional design language.
        </p>
      </div>

      {/* 1. COLOR & LIGHTING TOKENS */}
      <section>
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-6 border-b border-white/5 pb-2">1. Color & Lighting Tokens</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          
          <div className="flex flex-col gap-2">
            <div className="h-24 rounded-2xl bg-[#090514] border border-white/10 shadow-lg" />
            <span className="text-xs font-bold text-white mt-2">Background Base</span>
            <span className="text-[10px] font-mono text-white/40">#090514</span>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="h-24 rounded-2xl bg-[#110b1c] border border-white/10 shadow-lg" />
            <span className="text-xs font-bold text-white mt-2">Dark Surface</span>
            <span className="text-[10px] font-mono text-white/40">#110b1c</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-24 rounded-2xl bg-[#7a3fff] shadow-[0_0_30px_rgba(122,63,255,0.4)]" />
            <span className="text-xs font-bold text-white mt-2">Primary Purple</span>
            <span className="text-[10px] font-mono text-white/40">#7a3fff</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-24 rounded-2xl bg-[#ff6be2] shadow-[0_0_30px_rgba(255,107,226,0.4)]" />
            <span className="text-xs font-bold text-white mt-2">Romantic Pink</span>
            <span className="text-[10px] font-mono text-white/40">#ff6be2</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="h-24 rounded-2xl bg-gradient-to-br from-[#7a3fff] to-[#ff6be2] shadow-xl" />
            <span className="text-xs font-bold text-white mt-2">Brand Gradient</span>
            <span className="text-[10px] font-mono text-white/40">Primary Action</span>
          </div>

        </div>
      </section>

      {/* 2. TYPOGRAPHY ARCHITECTURE */}
      <section>
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-6 border-b border-white/5 pb-2">2. Typography Architecture</h2>
        <div className="flex flex-col gap-8 glass-panel p-8 rounded-3xl">
          
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#ff6be2] font-bold mb-2 block">Display / Emotional (Serif)</span>
            <h1 className="font-serif text-6xl font-bold text-white">The Vulnerability Master</h1>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#7a3fff] font-bold mb-2 block">Section Header (Sans)</span>
            <h2 className="text-2xl font-bold text-white">Relationship Timeline</h2>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2 block">Body / Description (Sans)</span>
            <p className="text-sm text-white/60 font-medium leading-relaxed max-w-xl">
              You both shared your biggest dreams for the future. A foundational moment for your relationship. Perfect timing for something chaotic, spicy, and unpredictable.
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-2 block">Metadata / Utility (Caps)</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">14 Day Streak 🔥</span>
          </div>

        </div>
      </section>

      {/* 3. BUTTON SYSTEM */}
      <section>
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-6 border-b border-white/5 pb-2">3. Button & Action System</h2>
        <div className="flex flex-wrap gap-8 items-center">
          
          <button className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7a3fff] to-[#ff6be2] text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(255,107,226,0.4)] transition-all transform hover:scale-105 active:scale-95">
            Primary Action
          </button>

          <button className="px-8 py-3.5 rounded-full bg-white text-[#090514] font-bold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-95">
            Secondary Solid
          </button>

          <button className="px-6 py-2.5 rounded-full glass-panel text-white/60 text-xs font-bold uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all active:scale-95 border border-white/10">
            Ghost Filter
          </button>

          <button className="w-16 h-16 rounded-full bg-gradient-to-r from-[#7a3fff] to-[#682c58] flex items-center justify-center shadow-[0_10px_20px_rgba(122,63,255,0.4)] hover:scale-105 active:scale-95 transition-all border border-white/10">
            <Play className="w-6 h-6 text-white ml-1" />
          </button>

          <button className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            Inline Link <ChevronRight className="w-3 h-3" />
          </button>

        </div>
      </section>

      {/* 4. SURFACE & COMPONENT ARCHITECTURE */}
      <section>
        <h2 className="text-[12px] font-bold uppercase tracking-widest text-white/40 mb-6 border-b border-white/5 pb-2">4. Core Surfaces & UI Modules</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* AI Insight Card */}
          <div className="glass-panel p-8 rounded-[2rem] border border-[#ff6be2]/20 cinematic-shadow relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-[#ff6be2]/10 to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[#ff6be2]" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#ff6be2]">AI Module</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-3">Time to Reconnect</h3>
              <p className="text-sm text-white/60 font-medium mb-6">Standard structural insight card logic for notifications or AI prompts.</p>
              <button className="w-full py-3 rounded-full bg-white text-[#090514] font-bold text-xs uppercase tracking-widest">
                Action
              </button>
            </div>
          </div>

          {/* Multiplayer Presence Indicator */}
          <div className="elevated-card p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-r from-[#7a3fff] to-[#ff6be2]">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#090514]">
                  <img src="https://i.pravatar.cc/150?img=32" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Partner UI</h4>
                <p className="text-[10px] text-[#ff6be2] uppercase tracking-widest font-bold">Online</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Core Game Card */}
          <GameCard 
            title="The Component" 
            description="Our primary visual structural unit for the discovery engine." 
            colorClass="from-[#7a3fff] to-[#ff6be2]" 
            iconName="Heart" 
            href="#" 
          />

        </div>
      </section>

    </div>
  );
}
