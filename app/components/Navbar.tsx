"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      id: "party",
      label: "Party",
      emoji: "🥳",
      href: "/",
      activeCheck: (path: string) => path === "/" || path.includes("/room/") && !path.includes("conversation_starters")
    },
    {
      id: "games",
      label: "Games",
      emoji: "🕹",
      href: "/games",
      activeCheck: (path: string) => path === "/games"
    },
    {
      id: "conversation",
      label: "Conversation Starters",
      emoji: "👋",
      href: "/room/offline-demo-conversation_starters",
      activeCheck: (path: string) => path.includes("conversation_starters")
    }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#070709]/80 border-b border-white/5 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Glowing Logo */}
        <Link href="/">
          <div className="font-black text-2xl tracking-tighter bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent cursor-pointer hover:opacity-95 active:scale-98 transition-all flex items-center gap-1.5">
            PairPlay <span className="text-xs font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">v2</span>
          </div>
        </Link>

        {/* Tab Items Container */}
        <div className="flex bg-[#121215]/80 border border-white/5 rounded-full p-1 relative items-center">
          {navItems.map((item) => {
            const isActive = item.activeCheck(pathname);
            return (
              <Link key={item.id} href={item.href} className="relative select-none">
                <div className={`relative px-5 py-2 rounded-full text-sm font-black transition-all duration-300 flex items-center gap-2 z-10 ${
                  isActive 
                    ? "text-white" 
                    : "text-white/60 hover:text-white"
                }`}>
                  <span className="text-base select-none leading-none">{item.emoji}</span>
                  <span className="leading-none">{item.label}</span>
                </div>

                {/* Animated Capsule Highlight */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff007f] to-[#ff3300] shadow-[0_0_25px_rgba(255,0,127,0.4)] z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

      </div>
    </nav>
  );
}
