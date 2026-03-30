"use client";

import Navbar from "@/components/Navbar";
import OnboardingWizard from "@/components/auth/OnboardingWizard";
import { ShieldCheck, CheckCircle2, Zap, Globe, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col overflow-hidden font-sans">
      
      {/* Immersive Header */}
      <nav className="h-20 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center px-6 sm:px-8 shrink-0 relative z-50">
        <a href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">ShramShield</span>
        </a>
      </nav>
      
      <div className="flex-grow flex flex-col lg:flex-row relative">
        
        {/* Left Side: Onboarding Wizard */}
        <div className="flex-grow flex items-center justify-center p-6 sm:p-12 relative z-20 order-2 lg:order-1 bg-slate-50">
           <AnimatePresence mode="wait">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="w-full max-w-xl"
             >
                <OnboardingWizard />
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Right Side: High-End Marketing Panel */}
        <div className="hidden lg:flex w-[45%] bg-slate-900 text-white p-16 flex-col justify-between relative overflow-hidden order-1 lg:order-2 border-l border-slate-800">
          {/* Layered Abstract Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6 }}
               className="mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-8 shadow-sm">
                 <Star className="w-3 h-3 fill-current" /> Verified Coverage
              </div>
              <h1 className="text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                Protecting the Future of <br />
                <span className="text-blue-400">Independent Work.</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                Join 50,000+ delivery and logistics partners securing their income against urban risks and disruptions.
              </p>
            </motion.div>

            {/* High-Fidelity Feature Set */}
            <div className="space-y-6">
              {[
                { 
                  icon: <Zap className="text-blue-400 w-5 h-5" />, 
                  title: "Instant Verification", 
                  desc: "Connect your platform ID and get protected in under 120 seconds." 
                },
                { 
                  icon: <Globe className="text-emerald-400 w-5 h-5" />, 
                  title: "Parametric Triggers", 
                  desc: "We track satellite weather and curfew data so you don't have to." 
                },
                { 
                  icon: <CheckCircle2 className="text-amber-400 w-5 h-5" />, 
                  title: "Automated Payouts", 
                  desc: "Claims that pay instantly directly to your registered UPI ID." 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (0.1 * i), duration: 0.6 }}
                  className="flex gap-5 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-700 transition-all shadow-sm">
                    {item.icon}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-sm tracking-wide text-white mb-0.5">{item.title}</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-16 mt-16 border-t border-slate-800 flex items-center justify-end">
             <div className="flex gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <span className="font-bold text-lg tracking-tight">Zomato</span>
                <span className="font-bold text-lg tracking-tight">Swiggy</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Background Decor for Mobile */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-slate-50" />
    </main>
  );
}
