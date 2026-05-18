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
      <section className="w-full py-20 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Connect. Laugh. <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
            Play Together.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed">
          The ultimate interactive platform for couples, friends, and parties.
          Break the ice, spark deep conversations, and create memorable moments.
        </p>
      </section>

      {/* Game Grid */}
      <section className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Featured Experiences</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.href} {...game} />
          ))}
        </div>
      </section>
    </div>
  );
}
