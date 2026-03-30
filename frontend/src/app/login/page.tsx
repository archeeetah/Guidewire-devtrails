"use client";

import Navbar from "@/components/Navbar";
import OnboardingWizard from "@/components/auth/OnboardingWizard";
import { ShieldCheck, CheckCircle2, Zap, Globe, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white text-brand-slate selection:bg-brand-yellow selection:text-brand-dark flex flex-col overflow-hidden">
      
      {/* Immersive Header */}
      <nav className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl flex items-center px-8 shrink-0 relative z-50">
        <a href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
          <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-yellow/30">
            <ShieldCheck className="text-black w-7 h-7" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase text-brand-slate italic">ShramShield</span>
        </a>
      </nav>
      
      <div className="flex-grow flex flex-col md:flex-row relative">
        
        {/* Left Side: Onboarding Wizard - Centered and Spaced */}
        <div className="flex-grow flex items-center justify-center p-6 sm:p-12 relative z-20 order-2 md:order-1 bg-[#FDFDFD]">
           <AnimatePresence mode="wait">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-full max-w-xl"
             >
                <OnboardingWizard />
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Right Side: High-End Marketing Panel */}
        <div className="hidden lg:flex w-[45%] bg-brand-slate text-white p-16 flex-col justify-between relative overflow-hidden order-2 border-l border-white/5">
          {/* Layered Abstract Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <motion.div 
               initial={{ opacity: 0, x: 40 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-yellow text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                 <Star className="w-3 h-3 fill-current" /> Verified Partner Protection
              </div>
              <h1 className="text-6xl font-black tracking-tighter leading-[0.9] mb-8 italic">
                Protecting India's <br />
                <span className="text-brand-yellow drop-shadow-lg">Digital Backbone</span>
              </h1>
              <p className="text-slate-400 text-2xl font-bold leading-tight tracking-tight max-w-md">
                Join 50,000+ delivery and logistics partners securing their income from monsoon flood risk and city disruptions.
              </p>
            </motion.div>

            {/* High-Fidelity Feature Set */}
            <div className="space-y-8">
              {[
                { 
                  icon: <Zap className="text-brand-yellow w-6 h-6" />, 
                  title: "Instant Verification", 
                  desc: "Connect your platform ID and get protected in under 120 seconds." 
                },
                { 
                  icon: <Globe className="text-blue-400 w-6 h-6" />, 
                  title: "Parametric Triggers", 
                  desc: "We track satellite weather and curfew data so you don't have to." 
                },
                { 
                  icon: <CheckCircle2 className="text-green-400 w-6 h-6" />, 
                  title: "Automated Payouts", 
                  desc: "Insurance claims that pay instantly and directly to your UPI ID." 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (0.1 * i), duration: 0.8 }}
                  className="flex gap-6 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-yellow/10 group-hover:border-brand-yellow/30 transition-all">
                    {item.icon}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-black text-xs uppercase tracking-[0.3em] text-brand-yellow mb-1">{item.title}</h3>
                    <p className="text-slate-500 text-base font-bold tracking-tight">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-16 border-t border-white/5 flex items-center justify-between">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Coverage Partner</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Telemetry Online
                </p>
             </div>
             <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <span className="font-black text-xl italic tracking-tighter">Zomato</span>
                <span className="font-black text-xl italic tracking-tighter">Swiggy</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Background Decor for Mobile */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[#FDFDFD]" />
    </main>
  );
}
