"use client";

import Navbar from "@/components/Navbar";
import OnboardingWizard from "@/components/auth/OnboardingWizard";
import { ShieldCheck, CheckCircle2, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white md:bg-slate-50 text-brand-slate selection:bg-brand-yellow selection:text-brand-dark flex flex-col overscroll-none overflow-hidden">
      {/* Simplified Navbar for Onboarding */}
      <nav className="h-14 sm:h-20 border-b border-black/5 bg-white flex items-center px-4 sm:px-8 shrink-0 relative z-50">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-yellow rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-brand-yellow/10">
            <ShieldCheck className="text-black w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-lg sm:text-2xl font-black tracking-tighter uppercase text-brand-slate">ShramShield</span>
        </a>
      </nav>
      
      <div className="flex-grow flex flex-col md:flex-row relative">
        
        {/* Left Side: Onboarding Wizard */}
        <div className="flex-grow flex items-center justify-center p-4 sm:p-8 relative z-20 order-2 md:order-1">
           <OnboardingWizard />
        </div>

        {/* Right Side: Design Panel (Hidden on Small Screens) */}
        <div className="hidden md:flex w-[40%] bg-brand-slate text-white p-12 flex-col justify-between relative overflow-hidden order-2">
          {/* Subtle Animated Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="mb-12"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-brand-yellow text-xs font-black uppercase tracking-widest mb-6">
                 Verified Protection
              </div>
              <h1 className="text-5xl font-black tracking-tighter leading-tight mb-6">
                Protecting India's <span className="text-brand-yellow">Digital Backbone</span>
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Join 50,000+ delivery and logistics partners securing their income from monsoon flood risk and city disruptions.
              </p>
            </motion.div>

            {/* Icon Feature List */}
            <div className="space-y-6">
              {[
                { 
                  icon: <Zap className="text-brand-yellow w-5 h-5" />, 
                  title: "Instant Verification", 
                  desc: "Connect your platform ID and get protected in 2 minutes." 
                },
                { 
                  icon: <Globe className="text-blue-400 w-5 h-5" />, 
                  title: "Parametric Triggers", 
                  desc: "We track weather and curfews so you don't have to." 
                },
                { 
                  icon: <CheckCircle2 className="text-green-400 w-5 h-5" />, 
                  title: "Automated Payouts", 
                  desc: "Insurance claims that pay instantly to your UPI ID." 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wide text-brand-yellow">{item.title}</h3>
                    <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/5">
             <p className="text-xs font-medium text-slate-500">
               Trusted by partners from Zomato, Swiggy, Amazon, Zepto & 15+ more companies.
             </p>
          </div>
        </div>
      </div>
      
      {/* Global Background Decor for Mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-gradient-to-br from-white via-slate-50 to-brand-yellow/5" />
    </main>
  );
}
