"use client";

import GameCard from "./components/GameCard";
import truthOrDareData from "./data/truth_or_dare.json";
import wouldYouRatherData from "./data/would_you_rather.json";
import conversationStartersData from "./data/conversation_starters.json";
import deepConnectionData from "./data/deep_connection.json";
import whoKnowsMeBestData from "./data/who_knows_me_best.json";
import thisOrThatData from "./data/this_or_that.json";
import questionsForBoyfriendData from "./data/questions_for_boyfriend.json";
import speedDatingData from "./data/speed_dating.json";
import charadesData from "./data/charades.json";
import truthAndDareCouplesData from "./data/truth_and_dare_couples.json";
import confessionData from "./data/confession.json";

export default function Home() {
  const games = [
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
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Editorial Hero Section */}
      <section className="w-full pt-32 pb-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 lg:gap-12 max-w-7xl mx-auto z-10 px-4 md:px-0">
        
        {/* Left Column: Emotion & Typographic Hierarchy */}
        <div className="flex-1 flex flex-col items-start text-left max-w-2xl relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#c4a7b4] text-[10px] font-bold uppercase tracking-widest mb-10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6be2] animate-pulse shadow-[0_0_8px_rgba(255,107,226,0.8)]"></span>
            Now Live: Deep Connection Mode
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tight text-white leading-[1.05] mb-6">
            Play <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6be2] to-[#c4a7b4] text-glow">closer.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 font-medium leading-relaxed max-w-lg mb-12">
            A premium digital lounge for modern relationships. Discover intimate challenges, deep conversation starters, and shared moments designed exclusively for two.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto mb-16">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#7a3fff] to-[#682c58] text-white font-semibold text-sm tracking-wide shadow-[0_10px_30px_rgba(122,63,255,0.3)] hover:shadow-[0_15px_40px_rgba(122,63,255,0.5)] transition-all duration-500 transform hover:-translate-y-0.5">
              Start Your Night
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel text-white/80 font-semibold text-sm tracking-wide hover:bg-white/10 transition-all duration-500">
              Explore Experiences
            </button>
          </div>

          {/* Integrated Social Proof */}
          <div className="flex items-center gap-5">
             <div className="flex -space-x-3">
               <img src="https://i.pravatar.cc/100?img=47" alt="User" className="w-10 h-10 rounded-full border-2 border-[#090514] grayscale opacity-80" />
               <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-10 h-10 rounded-full border-2 border-[#090514] grayscale opacity-80" />
               <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-10 h-10 rounded-full border-2 border-[#090514] grayscale opacity-80" />
             </div>
             <div className="text-xs font-semibold text-white/40 uppercase tracking-widest leading-tight">
               Loved by 50,000+ <br/> <span className="text-white/70">couples worldwide</span>
             </div>
          </div>
        </div>

        {/* Right Column: Cinematic Imagery & Floating Widgets */}
        <div className="flex-1 relative w-full lg:w-auto mt-12 lg:mt-0 flex justify-center lg:justify-end">
           <div className="relative w-full max-w-[500px] aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/5 cinematic-shadow group">
             {/* The Image */}
             <img 
                src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1200&auto=format&fit=crop" 
                alt="Couple playing game on couch" 
                className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[10s] ease-out opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#090514] via-[#090514]/40 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-tr from-[#7a3fff]/30 to-transparent opacity-60 mix-blend-screen" />
             
             {/* Floating Widget */}
             <div className="absolute bottom-10 left-8 right-8 glass-panel rounded-3xl p-5 border border-white/10 shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-100">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-[#682c58]/40 border border-[#ff6be2]/30 flex items-center justify-center text-[#ff6be2] text-lg">
                     🔥
                   </div>
                   <div>
                     <h4 className="text-white font-bold text-sm">Truth or Dare</h4>
                     <p className="text-white/50 text-xs font-medium">Deep Connection Pack</p>
                   </div>
                 </div>
                 <div className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-wider">
                   Tonight
                 </div>
               </div>
               <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-gradient-to-r from-[#7a3fff] to-[#ff6be2] w-[65%] h-full rounded-full" />
               </div>
               <div className="mt-2 text-right text-[10px] text-white/40 font-bold uppercase tracking-widest">
                 In Progress
               </div>
             </div>
           </div>
           
           {/* Secondary floating element */}
           <div className="absolute top-10 -right-4 lg:-left-12 glass-panel rounded-2xl px-5 py-3 border border-white/10 shadow-2xl flex items-center gap-3 animate-pulse">
             <div className="w-2 h-2 rounded-full bg-[#ff6be2]" />
             <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Sarah & Mike just joined</span>
           </div>
        </div>
      </section>

      {/* Game Grid */}
      <section className="w-full max-w-6xl py-24 relative z-10" id="games">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Curated Experiences</h2>
          <p className="text-white/60 text-lg max-w-2xl">From lighthearted fun to deep emotional connections, find the perfect game for your current mood.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl py-24">
         <div className="glass-panel rounded-[3rem] p-10 md:p-20 cinematic-shadow overflow-hidden relative">
            <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#682c58] opacity-20 blur-[100px]" />
            <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="font-serif text-4xl font-bold text-white mb-8 leading-tight">Designed for intimacy and fun.</h2>
                <ul className="space-y-8">
                  <li className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#501fda]/20 flex items-center justify-center shrink-0 border border-[#501fda]/30">
                        <span className="text-[#f185d3]">✓</span>
                     </div>
                     <div>
                       <h4 className="text-white font-semibold text-lg mb-1">Real-time Multiplayer</h4>
                       <p className="text-white/60 text-sm leading-relaxed">Sync your devices instantly and play together, whether you're in the same room or long distance.</p>
                     </div>
                  </li>
                  <li className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#501fda]/20 flex items-center justify-center shrink-0 border border-[#501fda]/30">
                        <span className="text-[#f185d3]">✓</span>
                     </div>
                     <div>
                       <h4 className="text-white font-semibold text-lg mb-1">AI-Powered Personalization</h4>
                       <p className="text-white/60 text-sm leading-relaxed">Our AI adapts the games to your unique relationship dynamic and mood, keeping things fresh.</p>
                     </div>
                  </li>
                  <li className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#501fda]/20 flex items-center justify-center shrink-0 border border-[#501fda]/30">
                        <span className="text-[#f185d3]">✓</span>
                     </div>
                     <div>
                       <h4 className="text-white font-semibold text-lg mb-1">Absolute Privacy</h4>
                       <p className="text-white/60 text-sm leading-relaxed">Your answers and moments are securely ephemeral. What happens in Winkd, stays in Winkd.</p>
                     </div>
                  </li>
                </ul>
              </div>
              <div className="relative h-full min-h-[400px] rounded-[2rem] overflow-hidden bg-[#38304c]/40 border border-white/10 flex items-center justify-center p-8 group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#501fda]/20 to-[#f185d3]/20 opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                 <div className="relative z-10 text-center transform group-hover:scale-105 transition-transform duration-500">
                   <div className="text-7xl mb-6 drop-shadow-2xl">🥂</div>
                   <h3 className="font-serif text-3xl font-bold text-white mb-3">Elevate your date night</h3>
                   <p className="text-white/70 text-base font-medium">A new standard for couples.</p>
                 </div>
              </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="font-serif font-bold text-xl text-white flex items-center gap-1">
            Winkd <span className="text-[10px] font-sans font-semibold text-[#f185d3] uppercase tracking-wider bg-[#501fda]/20 px-2 py-0.5 rounded-full border border-[#f185d3]/20">Plus</span>
         </div>
         <div className="flex gap-8 text-sm text-white/50 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
         </div>
         <div className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} Winkd Inc. All rights reserved.
         </div>
      </footer>
    </div>
  );
}
