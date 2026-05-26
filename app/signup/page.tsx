"use client";

import { createBrowserSupabase } from "../../lib/supabase-browser";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
  const handleGoogleSignup = async () => {
    const supabase = createBrowserSupabase();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-base relative overflow-hidden px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-pink-500/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 relative z-10 text-center">
          <div className="mb-8">
            <h1 className="font-serif text-3xl text-white mb-2 tracking-tight">Begin the Journey</h1>
            <p className="text-white/60 font-sans text-sm">Create your account in one tap. No password needed.</p>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3.5 rounded-xl hover:bg-gray-100 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.9-5.9C34.2 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.9 5C14.9 16.1 19.1 13 24 13c3 0 5.7 1.1 7.8 2.9l5.9-5.9C34.2 6.5 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.3-5.3C29.4 35.3 26.8 36 24 36c-5.2 0-9.6-3-11.3-7.3l-6.9 5.3C9.7 39.8 16.4 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.3 5.3C40.7 36 44 30.4 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-white/30 text-xs mt-6 font-sans">
            By continuing you agree to our terms of service.
          </p>

          <div className="mt-6 border-t border-white/5 pt-5">
            <p className="text-white/40 text-xs font-sans">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:text-pink-400 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
