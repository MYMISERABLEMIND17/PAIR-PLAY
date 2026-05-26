"use client";

import { useState } from "react";
import { 
  Home, Compass, MessageCircle, Heart, Plus, 
  Sparkles, Play, X, User, Zap
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

// Mock Discovery Cards for Swipe System
const DISCOVERY_CARDS = [
  {
    id: 1,
    title: "Truth or Dare: Deep Pack",
    subtitle: "Because it's past midnight.",
    image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?auto=format&fit=crop&q=80&w=800",
    color: "from-[#ff6be2] to-[#7a3fff]",
    type: "AI Suggestion"
  },
  {
    id: 2,
    title: "Spicy Roulette",
    subtitle: "High energy. Unpredictable.",
    image: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80&w=800",
    color: "from-rose-500 to-[#090514]",
    type: "Trending"
  },
  {
    id: 3,
    title: "The Future Us",
    subtitle: "Where will you be in 5 years?",
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=800",
    color: "from-blue-600 to-indigo-900",
    type: "Deep Connection"
  }
];

export default function MobileEcosystemDemo() {
  const [activeTab, setActiveTab] = useState("explore");
  const [cards, setCards] = useState(DISCOVERY_CARDS);
  
  // Swipe mechanics
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) {
      // Swiped right (Play/Like)
      setCards(prev => prev.slice(1));
    } else if (info.offset.x < -100) {
      // Swiped left (Skip)
      setCards(prev => prev.slice(1));
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#050508] flex items-center justify-center p-4">
      {/* Mobile Device Simulator Frame */}
      <div className="relative w-full max-w-[400px] h-[850px] bg-[#090514] rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(122,63,255,0.15)] border-4 border-[#110b1c] flex flex-col">
        
        {/* Device Notch/StatusBar Simulation */}
        <div className="absolute top-0 w-full h-8 flex justify-center z-50">
           <div className="w-32 h-6 bg-[#110b1c] rounded-b-3xl" />
        </div>

        {/* Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7a3fff]/10 via-[#090514] to-[#ff6be2]/5 pointer-events-none" />

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 w-full relative z-10 overflow-y-auto hide-scrollbar pt-12 pb-24">
           
           {/* HEADER */}
           <header className="px-6 flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden relative">
                 <img src="https://i.pravatar.cc/150?img=32" className="w-full h-full object-cover" />
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#090514]" />
               </div>
               <div>
                 <h2 className="text-white font-bold text-sm">Hey, Alex</h2>
                 <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">14 Day Streak 🔥</p>
               </div>
             </div>
             <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center relative">
               <MessageCircle className="w-5 h-5 text-white/80" />
               <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ff6be2] rounded-full border-2 border-[#090514]" />
             </button>
           </header>

           {/* AI MOOD CHIPS */}
           <div className="px-6 flex gap-3 overflow-x-auto hide-scrollbar mb-8">
             <button className="px-5 py-2 rounded-full bg-white text-[#090514] text-xs font-bold whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.3)]">
               Late Night Vibes
             </button>
             <button className="px-5 py-2 rounded-full glass-panel text-white/60 text-xs font-bold whitespace-nowrap border border-white/5">
               Deep Convo
             </button>
             <button className="px-5 py-2 rounded-full glass-panel text-white/60 text-xs font-bold whitespace-nowrap border border-white/5">
               Spicy
             </button>
           </div>

           {/* SWIPEABLE DISCOVERY CARDS */}
           <div className="relative w-full h-[450px] flex items-center justify-center px-6">
             <AnimatePresence>
               {cards.length > 0 ? (
                 <motion.div
                   key={cards[0].id}
                   style={{ x, rotate, opacity }}
                   drag="x"
                   dragConstraints={{ left: 0, right: 0 }}
                   onDragEnd={handleDragEnd}
                   className="absolute w-[calc(100%-3rem)] h-[420px] rounded-[2rem] overflow-hidden cursor-grab active:cursor-grabbing border border-white/10 cinematic-shadow"
                   initial={{ scale: 0.95, y: 20, opacity: 0 }}
                   animate={{ scale: 1, y: 0, opacity: 1 }}
                   exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
                 >
                   <div className="absolute inset-0 bg-gradient-to-t from-[#090514] via-[#090514]/40 to-transparent z-10 pointer-events-none" />
                   <img src={cards[0].image} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                   
                   {/* Card Content */}
                   <div className="absolute bottom-0 w-full p-6 z-20 flex flex-col justify-end h-full">
                     <div className="inline-flex px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-white mb-3 self-start border border-white/10 flex items-center gap-1">
                       <Sparkles className="w-3 h-3 text-[#ff6be2]" /> {cards[0].type}
                     </div>
                     <h3 className="font-serif text-4xl font-bold text-white mb-1 leading-tight">{cards[0].title}</h3>
                     <p className="text-white/60 text-sm font-medium">{cards[0].subtitle}</p>
                   </div>
                 </motion.div>
               ) : (
                 <div className="text-center">
                   <div className="w-16 h-16 rounded-full glass-panel mx-auto flex items-center justify-center mb-4">
                     <Zap className="w-8 h-8 text-[#ff6be2]" />
                   </div>
                   <h3 className="text-white font-bold text-xl mb-2">You're caught up!</h3>
                   <p className="text-white/50 text-xs">More experiences generating...</p>
                 </div>
               )}
             </AnimatePresence>

             {/* Stack effect card behind */}
             {cards.length > 1 && (
               <div className="absolute w-[calc(100%-4rem)] h-[400px] rounded-[2rem] bg-white/5 border border-white/5 -z-10 translate-y-6 opacity-50" />
             )}
           </div>

           {/* QUICK ACTIONS OVERLAY */}
           {cards.length > 0 && (
             <div className="flex justify-center gap-6 mt-6">
               <button 
                 onClick={() => setCards(prev => prev.slice(1))}
                 className="w-14 h-14 rounded-full glass-panel border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all text-white/50"
               >
                 <X className="w-6 h-6" />
               </button>
               <button 
                 onClick={() => setCards(prev => prev.slice(1))}
                 className="w-16 h-16 rounded-full bg-gradient-to-r from-[#7a3fff] to-[#ff6be2] flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,107,226,0.5)] active:scale-90 transition-all text-white shadow-xl"
               >
                 <Play className="w-7 h-7 ml-1" />
               </button>
             </div>
           )}

        </main>

        {/* --- BOTTOM NAVIGATION SYSTEM --- */}
        <nav className="absolute bottom-0 w-full h-24 bg-[#090514]/90 backdrop-blur-xl border-t border-white/5 z-50 px-6 pb-6 pt-4 flex justify-between items-center">
           
           <button onClick={() => setActiveTab('home')} className="flex flex-col items-center gap-1 group">
             <Home className={`w-6 h-6 transition-colors ${activeTab === 'home' ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`} />
             {activeTab === 'home' && <span className="w-1 h-1 rounded-full bg-[#ff6be2] mt-1" />}
           </button>

           <button onClick={() => setActiveTab('explore')} className="flex flex-col items-center gap-1 group">
             <Compass className={`w-6 h-6 transition-colors ${activeTab === 'explore' ? 'text-[#ff6be2]' : 'text-white/30 group-hover:text-white/60'}`} />
             {activeTab === 'explore' && <span className="w-1 h-1 rounded-full bg-[#ff6be2] mt-1 shadow-[0_0_8px_rgba(255,107,226,0.8)]" />}
           </button>

           {/* Floating Action Button */}
           <div className="relative -top-6">
             <button className="w-14 h-14 rounded-full bg-gradient-to-r from-[#7a3fff] to-[#682c58] flex items-center justify-center shadow-[0_10px_20px_rgba(122,63,255,0.4)] hover:scale-105 active:scale-95 transition-all border border-white/10">
               <Plus className="w-6 h-6 text-white" />
             </button>
           </div>

           <button onClick={() => setActiveTab('memories')} className="flex flex-col items-center gap-1 group">
             <Heart className={`w-6 h-6 transition-colors ${activeTab === 'memories' ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`} />
             {activeTab === 'memories' && <span className="w-1 h-1 rounded-full bg-[#ff6be2] mt-1" />}
           </button>

           <button onClick={() => setActiveTab('profile')} className="flex flex-col items-center gap-1 group">
             <User className={`w-6 h-6 transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`} />
             {activeTab === 'profile' && <span className="w-1 h-1 rounded-full bg-[#ff6be2] mt-1" />}
           </button>

        </nav>

        {/* Home Indicator line (iOS) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50" />
      </div>
    </div>
  );
}
