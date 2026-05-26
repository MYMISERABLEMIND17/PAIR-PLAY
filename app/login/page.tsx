"use client";

import { useState } from "react";
import { loginAction } from "../actions/auth";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-base relative overflow-hidden px-4">
      {/* Cinematic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary-purple/20 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-white mb-2 tracking-tight">Welcome back</h1>
            <p className="text-white/60 font-sans text-sm">Enter the lounge and connect with your partner.</p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-sans text-white/50 uppercase tracking-wider">Email</label>
              <input 
                name="email"
                type="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-primary-purple/50 focus:ring-1 focus:ring-primary-purple/50 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-sans text-white/50 uppercase tracking-wider">Password</label>
              <input 
                name="password"
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-sans focus:outline-none focus:border-primary-purple/50 focus:ring-1 focus:ring-primary-purple/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-romantic-pink text-sm font-sans bg-romantic-pink/10 p-3 rounded-lg border border-romantic-pink/20">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-purple to-pink-500 hover:from-primary-purple hover:to-pink-400 text-white font-sans font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Enter Lounge 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm font-sans">
              Don't have an account?{" "}
              <Link href="/signup" className="text-white hover:text-primary-purple transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
