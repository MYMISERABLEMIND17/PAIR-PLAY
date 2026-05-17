import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

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
        <Navbar />

        <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </body>
    </html>
  );
}
