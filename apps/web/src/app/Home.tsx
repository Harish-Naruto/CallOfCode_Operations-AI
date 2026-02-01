"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Sparkles, Users, Zap, Shield, ArrowRight,
  CheckCircle2, Activity, Target, BarChart3,
  Clock, Brain, Scissors, Layers, Compass
} from "lucide-react";

export default function Home() {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    /* FIX: Removed overflow-x-hidden and ensured the div allows natural height expansion. 
       This prevents the content from being clipped or the scrollbar from disappearing. 
    */
    <div className="min-h-screen w-full bg-[#E0F2F1] text-[#001D29] relative font-sans selection:bg-[#00B4D8] selection:text-white">
      
      {/* --- CREATIVE CURTAIN ENTRANCE --- */}
      <AnimatePresence>
        {!isRevealed && (
          <div className="fixed inset-0 z-[100] flex">
            <motion.div 
              initial={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 1.2, ease: [0.87, 0, 0.13, 1] }}
              className="w-1/2 h-full bg-[#001D29] flex items-center justify-end pr-4"
            >
              <h2 className="text-[#48CAE4] font-serif italic text-4xl">MSME</h2>
            </motion.div>
            <motion.div 
              initial={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 1.2, ease: [0.87, 0, 0.13, 1] }}
              className="w-1/2 h-full bg-[#001D29] flex items-center justify-start pl-4 border-l border-white/10"
            >
              <h2 className="text-white font-serif text-4xl uppercase tracking-tighter">Center</h2>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- AMBIENT BACKGROUND --- 
          FIX: Changed to 'fixed' instead of 'absolute' so these decorative orbs 
          stay in the viewport as the user scrolls down through the content.
      */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -left-[5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-10%] -right-[5%] w-[500px] h-[500px] bg-[#0077B6]/10 rounded-full blur-[100px]" 
        />
      </div>

      {/* --- CONTENT WRAPPER --- */}
      <div className="relative z-10 w-full">
        {/* HERO SECTION */}
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={isRevealed ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex-1 space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#001D29] rounded-full shadow-xl">
                  <Sparkles className="w-4 h-4 text-[#48CAE4] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Autonomous Textile Ops</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-serif font-black text-[#001D29] tracking-tighter leading-[0.85]">
                  Your Digital <br />
                  <span className="text-[#0077B6] italic font-normal">COO Instance.</span>
                </h1>
                <p className="text-lg text-[#001D29]/60 max-w-xl leading-relaxed">
                  Autonomous management for the garment industry. We don't just suggest — we decide, execute, and verify your entire workflow.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/auth/signup" className="group relative px-8 py-4 bg-[#001D29] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all hover:bg-[#0077B6] flex items-center gap-3 active:scale-95">
                    Establish Node <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="#features" className="px-8 py-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#001D29] hover:bg-white transition-all shadow-sm">
                    View Specs
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 100, rotateY: 30 }}
                animate={isRevealed ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                transition={{ delay: 1.4, duration: 1 }}
                className="w-full lg:w-[400px] h-[550px] bg-[#001D29] rounded-tr-[8rem] rounded-bl-[8rem] shadow-2xl relative overflow-hidden flex flex-col justify-between p-12"
              >
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-[#00B4D8] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00B4D8]/20">
                    <Scissors className="text-[#001D29] w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[#48CAE4] text-[10px] font-black uppercase tracking-[0.5em]">Network v.2026</p>
                    <h3 className="text-3xl font-serif text-white italic">Heritage Management</h3>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-[1px] w-full bg-white/10" />
                  <div className="flex justify-between items-end">
                     <Compass className="w-12 h-12 text-[#48CAE4] opacity-40" />
                     <p className="text-[10px] text-white/30 text-right uppercase font-bold leading-tight">Digital <br/> Textile Node</p>
                  </div>
                </div>
                <Layers className="absolute -bottom-10 -left-10 w-64 h-64 text-white/5 -rotate-12 pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Decision Loop", desc: "Real-time adaptive planning that observes and executes autonomously." },
                { title: "Inventory Sync", desc: "Automated validation of material stock against customer commitments." },
                { title: "Artisan Routing", desc: "Assigns work based on specific craftsmanship skills and availability." },
                { title: "Conflict Resolution", desc: "Detects logistical bottlenecks before they impact delivery promises." },
                { title: "Elastic Scaling", desc: "Adjusts artisan schedules dynamically as order volume oscillates." },
                { title: "Immutable Audit", desc: "Every system decision is logged and verifiable by the Director." },
              ].map((f, i) => (
                <div key={i} className="p-10 rounded-[3rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm transition-all hover:shadow-xl">
                  <h3 className="text-xl font-serif font-bold text-[#001D29] mb-4">{f.title}</h3>
                  <p className="text-xs text-[#001D29]/60 font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA & FOOTER */}
        <section className="py-20 px-6">
          <footer className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 opacity-60">
            <span className="text-xl font-serif font-black italic text-[#001D29]">MSME Center</span>
            <p className="text-[9px] font-black uppercase tracking-[0.4em]">© 2026 Digital Textiles Network Node</p>
          </footer>
        </section>
      </div>

      {/* --- GLOBAL SCROLLBAR STYLING --- */}
      <style jsx global>{`
        /* Custom scrollbar for the entire browser window */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #E0F2F1; /* Matches Light-Teal background */
        }
        ::-webkit-scrollbar-thumb {
          background: #00B4D8; /* Matches Electric Blue palette */
          border-radius: 10px;
          border: 2px solid #E0F2F1;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #0077B6;
        }
        /* Firefox Support */
        * {
          scrollbar-width: thin;
          scrollbar-color: #00B4D8 #E0F2F1;
        }
      `}</style>
    </div>
  );
}