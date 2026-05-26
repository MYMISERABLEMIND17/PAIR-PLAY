"use client";

import { useState } from "react";
import { Search, Heart, Sparkles, Clock, Play, ChevronRight, Activity } from "lucide-react";
import GameCard from "../components/GameCard";
import truthOrDareData from "../data/truth_or_dare.json";
import wouldYouRatherData from "../data/would_you_rather.json";
import conversationStartersData from "../data/conversation_starters.json";
import deepConnectionData from "../data/deep_connection.json";
import whoKnowsMeBestData from "../data/who_knows_me_best.json";
import thisOrThatData from "../data/this_or_that.json";
import questionsForBoyfriendData from "../data/questions_for_boyfriend.json";
import speedDatingData from "../data/speed_dating.json";
import charadesData from "../data/charades.json";
import truthAndDareCouplesData from "../data/truth_and_dare_couples.json";
import confessionData from "../data/confession.json";

const MOODS = ["Cozy Night", "Flirty", "Deep & Emotional", "Chaotic", "Relaxed", "Vulnerable", "Spicy", "Competitive"];

export default function DiscoveryEcosystem() {
  const [activeMood, setActiveMood] = useState("Deep & Emotional");
  const [searchQuery, setSearchQuery] = useState("");

  const allGames = [
    {
      title: truthOrDareData.name,
      description: truthOrDareData.description,
      href: "/truth-or-dare",
      colorClass: truthOrDareData.color,
      iconName: truthOrDareData.icon,
    },
    {
      title: confessionData.name,
      description: confessionData.description,
      href: "/confession",
      colorClass: confessionData.color,
      iconName: confessionData.icon,
    },
    {
      title: truthAndDareCouplesData.name,
      description: truthAndDareCouplesData.description,
      href: "/truth-and-dare-couples",
      colorClass: truthAndDareCouplesData.color,
      iconName: truthAndDareCouplesData.icon,
    },
    {
      title: wouldYouRatherData.name,
      description: wouldYouRatherData.description,
      href: "/would-you-rather",
      colorClass: wouldYouRatherData.color,
      iconName: wouldYouRatherData.icon,
    },
    {
      title: conversationStartersData.name,
      description: conversationStartersData.description,
      href: "/conversation-starters",
      colorClass: conversationStartersData.color,
      iconName: conversationStartersData.icon,
    },
    {
      title: deepConnectionData.name,
      description: deepConnectionData.description,
      href: "/deep-connection",
      colorClass: deepConnectionData.color,
      iconName: deepConnectionData.icon,
    },
    {
      title: whoKnowsMeBestData.name,
      description: whoKnowsMeBestData.description,
      href: "/who-knows-me-best",
      colorClass: whoKnowsMeBestData.color,
      iconName: whoKnowsMeBestData.icon,
    },
    {
      title: thisOrThatData.name,
      description: thisOrThatData.description,
      href: "/this-or-that",
      colorClass: thisOrThatData.color,
      iconName: thisOrThatData.icon,
    },
    {
      title: questionsForBoyfriendData.name,
      description: questionsForBoyfriendData.description,
      href: "/boyfriend-questions",
      colorClass: questionsForBoyfriendData.color,
      iconName: questionsForBoyfriendData.icon,
    },
    {
      title: speedDatingData.name,
      description: speedDatingData.description,
      href: "/speed-dating",
      colorClass: speedDatingData.color,
      iconName: speedDatingData.icon,
    },
    {
      title: charadesData.name,
      description: charadesData.description,
      href: "/charades",
      colorClass: charadesData.color,
      iconName: charadesData.icon,
    }
  ];

  // Split games to simulate categorization
  const trendingGames = allGames.slice(0, 3);
  const deepGames = allGames.filter(g => g.href.includes("deep") || g.href.includes("conversation") || g.href.includes("confession") || g.href.includes("boyfriend"));
  const funGames = allGames.filter(g => !deepGames.includes(g) && !trendingGames.includes(g));

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-32">
      
      {/* 1. DISCOVERY HERO & 8. SEARCH EXPERIENCE */}
      <section className="w-full pt-32 pb-20 px-6 relative flex flex-col items-center justify-center border-b border-white/[0.02]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7a3fff]/10 via-[#090514] to-[#090514] blur-3xl -z-10 pointer-events-none" />
        
        <div className="w-full max-w-4xl flex flex-col items-center text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            What are you in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6be2] to-[#c4a7b4] text-glow">mood for?</span>
          </h1>
          
          <div className="relative w-full max-w-2xl mt-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7a3fff]/20 to-[#ff6be2]/20 rounded-full blur-2xl opacity-40 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="glass-panel relative flex items-center h-16 rounded-full px-6 border border-white/10 group-focus-within:border-[#ff6be2]/50 transition-colors shadow-2xl">
              <Search className="w-6 h-6 text-white/40 group-focus-within:text-[#ff6be2] transition-colors" />
              <input 
                type="text"
                placeholder="e.g. 'deep conversations' or 'something fun tonight'"
                className="w-full bg-transparent border-none outline-none text-white px-4 placeholder:text-white/30 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="hidden md:flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Press</span>
                <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/50 text-xs font-mono">⌘K</kbd>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MOOD-BASED EXPLORATION (Filters) */}
      <section className="w-full max-w-7xl px-6 -mt-8 relative z-20 mb-24">
        <div className="flex items-center justify-start md:justify-center gap-3 overflow-x-auto pb-6 scrollbar-hide mask-edges">
          {MOODS.map(mood => (
            <button
              key={mood}
              onClick={() => setActiveMood(mood)}
              className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-semibold transition-all duration-500 border ${
                activeMood === mood 
                  ? "bg-white text-[#090514] border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "glass-panel text-white/60 hover:text-white hover:bg-white/10 border-white/5"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </section>

      {/* 7. CONTINUE PLAYING & 4. PERSONALIZED RECOMMENDATIONS */}
      <section className="w-full max-w-7xl px-6 mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-[#7a3fff]/10 border border-[#7a3fff]/30 flex items-center justify-center cinematic-shadow">
                <Clock className="w-5 h-5 text-[#7a3fff]" />
             </div>
             <div>
               <h2 className="font-serif text-3xl font-bold text-white mb-1">Continue Your Streak</h2>
               <p className="text-sm text-white/50 font-medium">Pick up right where you left off.</p>
             </div>
          </div>
          <button className="text-[10px] font-bold text-white/40 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest border border-white/5 rounded-full px-4 py-2 glass-panel">
            View History <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Active Session Card */}
           <div className="elevated-card p-8 flex flex-col sm:flex-row items-center gap-8 group cursor-pointer border-l-4 border-l-[#7a3fff]">
             <div className="w-full sm:w-32 h-32 rounded-2xl bg-[#090514] border border-white/5 flex items-center justify-center relative overflow-hidden shrink-0">
               <div className="absolute inset-0 bg-gradient-to-br from-[#7a3fff]/20 to-transparent" />
               <Heart className="w-10 h-10 text-[#7a3fff] opacity-80 group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white">75%</div>
             </div>
             <div className="flex-1 flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-3">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-[#7a3fff] bg-[#7a3fff]/10 px-2 py-0.5 rounded-full">In Progress</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Last played 2h ago</span>
               </div>
               <h3 className="font-serif text-2xl font-bold text-white mb-2">Deep Connection Pack</h3>
               <p className="text-sm font-medium text-white/50 mb-5 leading-relaxed">You and Alex are 15 questions deep. Ready to continue?</p>
               <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                 <div className="h-full w-[75%] bg-gradient-to-r from-[#7a3fff] to-[#ff6be2] rounded-full shadow-[0_0_15px_rgba(255,107,226,0.6)]" />
               </div>
             </div>
           </div>
           
           {/* AI Recommendation */}
           <div className="elevated-card p-8 flex flex-col justify-between group cursor-pointer relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-bl from-[#ff6be2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-5">
                 <Sparkles className="w-4 h-4 text-[#ff6be2]" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff6be2]">AI Insight Suggestion</span>
               </div>
               <h3 className="font-serif text-2xl font-bold text-white mb-3">Because you loved 'Confessions'</h3>
               <p className="text-sm font-medium text-white/50 leading-relaxed max-w-sm">
                 Based on the emotional depth of your last session, we think you'll enjoy exploring vulnerabilities in this curated experience.
               </p>
             </div>
             <div className="flex items-center justify-between mt-8 relative z-10 border-t border-white/5 pt-6">
                <span className="text-white font-bold text-sm">Truth & Dare (Couples Edition)</span>
                <button className="w-12 h-12 rounded-full glass-panel flex items-center justify-center group-hover:bg-white group-hover:text-[#090514] transition-colors duration-500 shadow-lg border-white/20">
                  <Play className="w-5 h-5 ml-1" />
                </button>
             </div>
           </div>
        </div>
      </section>

      {/* 6. TRENDING & LIVE ACTIVITY */}
      <section className="w-full max-w-7xl px-6 mb-32 relative">
        <div className="absolute -left-[20%] top-1/2 w-[60%] h-[150%] bg-[#ff6be2] opacity-[0.04] blur-[150px] rounded-full -z-10 pointer-events-none transform -translate-y-1/2" />
        
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-[#ff6be2]/10 border border-[#ff6be2]/30 flex items-center justify-center cinematic-shadow">
                <Activity className="w-5 h-5 text-[#ff6be2] animate-pulse" />
             </div>
             <div>
               <h2 className="font-serif text-3xl font-bold text-white mb-1">Live & Trending Now</h2>
               <p className="text-sm text-white/50 font-medium">Join thousands of couples playing right now.</p>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {trendingGames.map((game, i) => (
             <div key={game.title} className="relative group">
                <GameCard {...game} />
                {/* Live Social Proof Inject */}
                <div className="absolute top-4 right-4 z-20 glass-panel px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                  <div className="w-2 h-2 rounded-full bg-[#ff6be2] animate-pulse shadow-[0_0_8px_rgba(255,107,226,0.8)]" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">{1250 - i*340} Playing</span>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 2. CATEGORY SYSTEM & GAME CARDS */}
      <section className="w-full max-w-7xl px-6 relative z-10">
        <div className="flex flex-col mb-10">
           <h2 className="font-serif text-3xl font-bold text-white mb-2">Deep Emotional Explorations</h2>
           <p className="text-sm text-white/50 font-medium">Games designed to spark vulnerability and profound connection.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {deepGames.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>

        <div className="flex flex-col mb-10">
           <h2 className="font-serif text-3xl font-bold text-white mb-2">Playful & Chaotic</h2>
           <p className="text-sm text-white/50 font-medium">High-energy fun for when you just want to laugh.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {funGames.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>
      </section>

    </div>
  );
}
