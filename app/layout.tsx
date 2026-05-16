import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PairPlay | Interactive Entertainment Platform",
  description: "A premium platform for social games, conversation starters, and interactive experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} antialiased relative min-h-screen selection:bg-purple-500/30 selection:text-purple-200`}>
        {/* Immersive Background */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0a0a0a]">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]" />
        </div>

        {/* Global Navigation Shell */}
        <nav className="fixed top-0 w-full z-50 elevated-nav">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/">
              <div className="font-bold text-2xl tracking-tight bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent cursor-pointer">
                PairPlay
              </div>
            </Link>
            <div className="flex gap-6 text-sm font-medium text-white/60">
              <Link href="/games" className="hover:text-white transition-colors">Games</Link>
              <Link href="#" className="hover:text-white transition-colors">Generators</Link>
              <Link href="#" className="hover:text-white transition-colors">Party</Link>
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  );
}
