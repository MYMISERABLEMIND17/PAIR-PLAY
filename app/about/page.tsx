export default function AboutPage() {
  return (
    <div className="flex flex-col items-center min-h-[80vh] py-20 px-6">
      
      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center mb-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#501fda]/20 to-transparent blur-[100px] -z-10 rounded-full w-[80%] mx-auto h-full" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-[#c4a7b4] text-sm font-semibold mb-8 border border-[#c4a7b4]/30 uppercase tracking-widest">
          Our Story
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white leading-tight">
          Redefining how <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f185d3] to-[#c4a7b4] text-glow">
            couples connect.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-medium">
          We believe that digital spaces for relationships shouldn't feel like an afterthought. They should feel like a high-end date night—designed for intimacy, laughter, and authentic connection.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="w-full max-w-5xl grid md:grid-cols-2 gap-12 mb-32">
        <div className="glass-panel p-10 md:p-12 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#501fda]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h3 className="font-serif text-3xl font-bold text-white mb-4">The Mission</h3>
            <p className="text-white/60 leading-relaxed font-medium">
              We built Winkd because we were tired of generic dating apps, superficial interactions, and childish party games. We wanted to create a platform that honors the depth of modern relationships. Whether you've been together for 5 weeks or 5 years, our experiences are crafted to spark meaningful conversations and unforgettable moments.
            </p>
          </div>
        </div>

        <div className="glass-panel p-10 md:p-12 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-bl from-[#682c58]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <h3 className="font-serif text-3xl font-bold text-white mb-4">The Vision</h3>
            <p className="text-white/60 leading-relaxed font-medium">
              To be the definitive digital sanctuary for couples worldwide. By blending emotional intelligence, cutting-edge AI personalization, and world-class design, we aim to transform screen time from an isolating experience into an enriching, shared adventure. 
            </p>
          </div>
        </div>
      </section>

      {/* Manifesto / Vibe */}
      <section className="w-full max-w-5xl">
         <div className="bg-[#272136] border border-white/5 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#f185d3] opacity-[0.08] blur-[100px]" />
            <div className="absolute bottom-[-50%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#501fda] opacity-[0.08] blur-[100px]" />
            
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-10 leading-tight">
              Designed with restraint.<br />
              <span className="text-[#f185d3]">Built for connection.</span>
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-6 py-3 rounded-full glass-panel text-white/80 text-sm font-semibold">No Ads.</span>
              <span className="px-6 py-3 rounded-full glass-panel text-white/80 text-sm font-semibold">No Infinite Feeds.</span>
              <span className="px-6 py-3 rounded-full glass-panel text-white/80 text-sm font-semibold">No Microtransactions.</span>
              <span className="px-6 py-3 rounded-full glass-panel text-white/80 text-sm font-semibold">Just You & Them.</span>
            </div>
         </div>
      </section>
      
    </div>
  );
}
