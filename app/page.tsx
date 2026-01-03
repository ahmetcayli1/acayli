"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MarqueeColumn } from "./components/MarqueeColumn";
import { CITY_IMAGES } from "./config/images";

export default function Home() {
  const leftImages = CITY_IMAGES.slice(0, 4);
  const rightImages = CITY_IMAGES.slice(4, 8);

  return (
    <main className="relative w-full h-screen overflow-hidden flex bg-slate-900">
      
      {/* Left Marquee */}
      <div className="hidden md:block w-1/4 h-full z-0">
        <MarqueeColumn images={leftImages} direction="up" />
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 z-[-1]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium backdrop-blur-md">
            AI-Powered Academic Matching
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            UNIWISE AI
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            Find your perfect Bachelor or Master program abroad. <br/>
            Our AI analyzes your profile, transcripts, and preferences to match you with top universities in Europe and beyond.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/wizard" 
              className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
            >
              Start Matching
            </Link>
            
            <Link 
              href="/login" 
              className="px-8 py-4 rounded-full border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-medium text-lg transition-all backdrop-blur-sm bg-white/5"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Marquee */}
      <div className="hidden md:block w-1/4 h-full z-0">
        <MarqueeColumn images={rightImages} direction="down" />
      </div>

    </main>
  );
}
