"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      id: "games",
      label: "Games",
      href: "/games",
      activeCheck: (path: string) => path === "/games"
    },
    {
      id: "party",
      label: "Multiplayer",
      href: "/",
      activeCheck: (path: string) => path === "/" || path.includes("/room/")
    },
    {
      id: "about",
      label: "About",
      href: "/about",
      activeCheck: (path: string) => path === "/about"
    }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 elevated-nav">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Premium Logo */}
        <Link href="/">
          <div className="font-serif font-bold text-3xl tracking-tight text-white cursor-pointer hover:opacity-95 transition-all flex items-center gap-2">
            Winkd <span className="text-[10px] font-sans font-semibold text-[#f185d3] uppercase tracking-wider bg-[#501fda]/20 px-2.5 py-0.5 rounded-full border border-[#f185d3]/20">Plus</span>
          </div>
        </Link>

        {/* Minimal Nav Items */}
        <div className="hidden md:flex bg-[#272136]/50 border border-white/5 rounded-full p-1.5 relative items-center shadow-inner">
          {navItems.map((item) => {
            const isActive = item.activeCheck(pathname);
            return (
              <Link key={item.id} href={item.href} className="relative select-none">
                <div className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 z-10 ${
                  isActive 
                    ? "text-white" 
                    : "text-white/60 hover:text-white"
                }`}>
                  <span className="leading-none">{item.label}</span>
                </div>

                {/* Animated Capsule Highlight */}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full bg-[#501fda]/40 shadow-[0_0_15px_rgba(80,31,218,0.3)] border border-[#501fda]/50 z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="text-sm font-semibold text-white bg-white/10 border border-white/20 px-6 py-2.5 rounded-full hover:bg-white hover:text-[#38304c] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  );
}
