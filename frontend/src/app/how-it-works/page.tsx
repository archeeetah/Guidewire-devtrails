"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { CloudLightning, Cpu, Smartphone, ShieldCheck, MapPin, Zap, ArrowRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: <MapPin className="w-8 h-8 text-brand-slate" />,
    title: "Secure Your Zone",
    desc: "Pick your delivery platform and primary work zone. Our AI calculates a precise premium based on that area's hyper-local risk telemetry.",
    color: "bg-slate-50"
  },
  {
    number: "02",
    icon: <CloudLightning className="w-8 h-8 text-brand-yellow" />,
    title: "Global Monitoring",
    desc: "24/7 synchronization with satellite and IMD data. We monitor rainfall, AQI, and zonal disruptions while you focus on your work.",
    color: "bg-brand-slate text-white"
  },
  {
    number: "03",
    icon: <Zap className="w-8 h-8 text-blue-500" />,
    title: "Parametric Trigger",
    desc: "The moment conditions pass our pre-set thresholds (e.g., >30mm rainfall), the parametric smart contract executes automatically.",
    color: "bg-slate-50"
  },
  {
    number: "04",
    icon: <Smartphone className="w-8 h-8 text-emerald-500" />,
    title: "Instant Payout",
    desc: "No claims, no phone calls, no delays. ₹2,500 is sent instantly to your UPI ID, replacing lost income within minutes.",
    color: "bg-brand-yellow text-brand-dark"
  }
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white text-brand-slate selection:bg-brand-yellow selection:text-brand-dark pb-24 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 sm:pt-32">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-[0.2em]"
          >
             No Claims. Zero Touch.
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 leading-[0.9] italic"
          >
            Predict. Protect.<br /> <span className="text-brand-yellow">Prosper.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-2xl text-slate-500 font-bold max-w-2xl mx-auto leading-tight"
          >
             ShramShield isn't like traditional insurance. It's automated parametric software that monitors India's cities and acts the moment you're disrupted.
          </motion.p>
        </div>

        {/* Vertical Stepper with Visuals */}
        <div className="space-y-4 max-w-6xl mx-auto">
           {STEPS.map((step, i) => (
             <motion.div 
               key={step.number}
               initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className={`p-10 sm:p-20 rounded-[56px] ${step.color} grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden group shadow-xl hover:scale-[1.01] transition-all`}
             >
                <div className="absolute top-10 right-10 text-9xl font-black opacity-10 italic leading-none group-hover:scale-125 transition-transform">{step.number}</div>
                
                <div className="lg:col-span-1 border-r border-current/10 hidden lg:block h-32 flex flex-col items-center justify-center">
                   {step.icon}
                </div>

                <div className="lg:col-span-7 flex flex-col justify-center">
                   <h3 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6 italic uppercase leading-none">{step.title}</h3>
                   <p className={`text-lg sm:text-xl font-bold leading-snug tracking-tight max-w-2xl ${i === 1 ? 'text-slate-400' : 'text-slate-500'}`}>
                      {step.desc}
                   </p>
                </div>

                <div className="lg:col-span-4 flex items-center justify-center">
                   <div className="w-full aspect-square bg-current/5 rounded-[40px] flex items-center justify-center p-8 backdrop-blur-3xl">
                      <div className="p-10 bg-white rounded-[32px] shadow-2xl">
                         {step.icon}
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Automated vs Traditional Sidebar Comparison */}
        <div className="mt-32 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-12 rounded-[48px] bg-slate-50 border border-slate-100">
              <h4 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Traditional Insurance</h4>
              <ul className="space-y-4 opacity-50 font-bold text-sm">
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"/> Weeks of waiting for approval</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"/> Extensive paperwork and forms</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"/> Subjective human evaluation</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"/> Phone calls and loss adjusters</li>
              </ul>
           </div>
           
           <div className="p-12 rounded-[48px] bg-brand-slate text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                 <Zap className="w-32 h-32 text-brand-yellow" />
              </div>
              <h4 className="text-2xl font-black mb-8 italic uppercase tracking-tighter text-brand-yellow relative z-10">ShramShield Way</h4>
              <ul className="space-y-4 font-bold text-sm relative z-10">
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand-yellow rounded-full"/> 0 seconds waiting for approval</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand-yellow rounded-full"/> 0 papers and no manual forms</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand-yellow rounded-full"/> Fully objective satellite triggers</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-brand-yellow rounded-full"/> API verified instant UPI transfer</li>
              </ul>
           </div>
        </div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
           <h4 className="text-3xl font-black tracking-tighter italic mb-8">Ready to secure your work?</h4>
           <a href="/#platforms">
              <button className="px-12 py-6 bg-brand-slate text-white hover:bg-black font-black rounded-3xl transition-all shadow-2xl shadow-brand-slate/20 flex items-center justify-center gap-4 text-xl mx-auto active:scale-95 group">
                 Choose Your Level <ArrowRight className="text-brand-yellow group-hover:translate-x-1 transition-transform" />
              </button>
           </a>
        </motion.div>
      </div>
    </main>
  );
}
