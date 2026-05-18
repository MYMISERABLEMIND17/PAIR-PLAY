"use client";

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

export default function GamesPage() {
  // We list our active games first, then placeholders for the rest of the ecosystem
  const allGames = [
    {
      title: truthOrDareData.name,
      description: truthOrDareData.description,
      href: "/truth-or-dare",
      colorClass: truthOrDareData.color,
      iconName: truthOrDareData.icon,
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
    {
      title: "Most Likely To",
      description: "Find out what your friends really think of you in this hilarious voting game.",
      href: "#",
      colorClass: "from-yellow-400 to-orange-500",
      iconName: "Users",
    },
    {
      title: "Never Have I Ever",
      description: "Expose your friends' deepest secrets and wildest stories.",
      href: "#",
      colorClass: "from-red-500 to-rose-600",
      iconName: "AlertTriangle",
    },
    {
      title: "Couples Questions",
      description: "Intimate and fun questions to grow closer to your partner.",
      href: "#",
      colorClass: "from-pink-400 to-red-400",
      iconName: "Heart",
    },
    {
      title: "Taboo",
      description: "Get your team to guess the word without using any of the forbidden words.",
      href: "#",
      colorClass: "from-violet-500 to-fuchsia-500",
      iconName: "MicOff",
    },
    {
      title: "Spin the Bottle",
      description: "The classic party game reinvented for the digital age.",
      href: "#",
      colorClass: "from-green-400 to-emerald-600",
      iconName: "RefreshCw",
    }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-6xl mb-12 text-center md:text-left mt-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
          All Games
        </h1>
        <p className="text-lg text-white/50 max-w-2xl">
          Explore our entire collection of interactive social games. Whether you are breaking the ice or exposing deep secrets, we have something for every vibe.
        </p>
      </div>
      
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allGames.map((game) => (
          <GameCard key={game.title} {...game} />
        ))}
      </div>
    </div>
  );
}
