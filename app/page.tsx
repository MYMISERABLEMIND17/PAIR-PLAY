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
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 flex flex-col items-center text-center relative mt-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#501fda]/10 to-transparent blur-3xl -z-10 rounded-full w-[80%] mx-auto" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-white/80 text-sm font-medium mb-8 border border-[#f185d3]/30">
          <span className="w-2 h-2 rounded-full bg-[#f185d3] animate-pulse shadow-[0_0_8px_rgba(241,133,211,0.8)]"></span>
          Now introducing AI-guided Experiences
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-white leading-[1.1] max-w-5xl">
          Deepen your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f185d3] via-[#c4a7b4] to-[#f185d3] text-glow bg-[length:200%_auto] animate-gradient">
            Connection.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-12 leading-relaxed font-medium">
          A premium social gaming platform designed for couples. 
          Discover a curated collection of truth or dare, deep conversation games, and intimate challenges.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button className="px-8 py-4 rounded-full bg-white text-[#38304c] font-semibold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 transform hover:-translate-y-1">
            Start Playing Free
          </button>
          <button className="px-8 py-4 rounded-full glass-panel text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300">
            View Games
          </button>
        </div>
        
        {/* Social Proof Mini */}
        <div className="mt-16 flex items-center gap-4 text-sm text-white/60 font-medium">
          <div className="flex -space-x-3">
             <div className="w-8 h-8 rounded-full border-2 border-[#38304c] bg-gradient-to-br from-[#501fda] to-[#f185d3]" />
             <div className="w-8 h-8 rounded-full border-2 border-[#38304c] bg-gradient-to-br from-[#682c58] to-[#c4a7b4]" />
             <div className="w-8 h-8 rounded-full border-2 border-[#38304c] bg-gradient-to-br from-[#8c6c5c] to-[#38304c]" />
          </div>
          <p>Loved by 50,000+ couples worldwide.</p>
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
