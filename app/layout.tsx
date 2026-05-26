import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Winkd | Premium Social Games for Couples",
  description: "A premium, real-time social gaming platform for couples and friends. Play Truth or Dare, Would You Rather, and deep conversation games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased relative min-h-screen selection:bg-[#ff6be2]/30 selection:text-white bg-[#090514]">
        {/* Cinematic Background */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#090514]">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#7a3fff] opacity-[0.08] blur-[140px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#ff6be2] opacity-[0.05] blur-[150px] mix-blend-screen" />
          <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-full bg-[#682c58] opacity-[0.08] blur-[120px] mix-blend-screen" />
          <div className="absolute inset-0 bg-black/40 mix-blend-overlay pointer-events-none" />
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
