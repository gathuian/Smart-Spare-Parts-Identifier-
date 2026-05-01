/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ChevronRight, Cpu, Shield, Zap } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen overflow-hidden relative industrial-grid">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-chrome/5 blur-[100px] rounded-full pointer-events-none" />

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex items-center gap-2 px-4 py-2 glass-card chrome-glow rounded-full text-xs font-mono uppercase tracking-[0.2em] text-neon-blue"
        >
          <Cpu size={14} className="animate-pulse" />
          Powered by Gemini Vision AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8"
        >
          SMART SPARE <br />
          <span className="text-industrial-400">IDENTIFIER</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl text-industrial-400 text-lg md:text-xl mb-12 leading-relaxed"
        >
          Identify mechanical and industrial spare parts instantly. Reduce downtime 
          and improve maintenance efficiency with professional-grade AI recognition.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={onStart}
            className="px-10 py-5 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-3 overflow-hidden group relative"
          >
            LAUNCH SCANNER
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-neon-blue opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="mt-24 grid md:grid-cols-3 gap-8 w-full max-w-5xl"
        >
          {[
            { icon: Zap, title: "INSTANT ANALYSIS", desc: "Processing time varies based on part complexity." },
            { icon: Shield, title: "INDUSTRIAL GRADE", desc: "Trained on thousands of mechanical components." },
            { icon: Cpu, title: "VISION INTELLIGENCE", desc: "Handles blurred, low-light, and dirty images." }
          ].map((feature, i) => (
            <div key={i} className="glass-card chrome-glow p-8 text-left transition-transform hover:-translate-y-1">
              <feature.icon className="text-neon-blue mb-4" size={32} />
              <h3 className="text-white font-bold mb-2 tracking-wide uppercase">{feature.title}</h3>
              <p className="text-industrial-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      <footer className="absolute bottom-10 left-10 text-[10px] uppercase tracking-[0.3em] text-industrial-600 font-mono">
        System 7.4.2 // Beta Build // AI_INDUSTRIAL_SECURE
      </footer>
    </div>
  );
}
