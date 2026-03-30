"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, BarChart3, ArrowRight, Play, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 sm:pt-32 pb-20 overflow-hidden bg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
      </div>

      <div className="container px-6 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 text-brand-slate leading-[0.9] italic"
          >
            Protecting <span className="text-brand-yellow drop-shadow-sm">India's</span><br />
            Digital Backbone.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-2xl text-slate-500 mb-12 leading-tight font-bold max-w-2xl mx-auto"
          >
            ShramShield provides a high-fidelity financial safety net for gig workers. Automated payouts triggered by satellite telemetry and city-wide disruptions.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#platforms" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-10 py-5 bg-brand-slate text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl shadow-brand-slate/20 flex items-center justify-center gap-3 text-lg active:scale-95 group">
                Join 50,000+ Partners <ArrowRight className="w-5 h-5 text-brand-yellow group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <button className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 text-brand-slate font-black rounded-3xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-lg active:scale-95">
              <Play className="w-5 h-5 fill-current" /> Watch How It Works
            </button>
          </motion.div>

          {/* Trust Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale"
          >
             <p className="text-[10px] font-black uppercase tracking-[0.3em] w-full mb-2">Trusted by partners from</p>
             <span className="font-black text-xl italic tracking-tighter">Zomato</span>
             <span className="font-black text-xl italic tracking-tighter">Swiggy</span>
             <span className="font-black text-xl italic tracking-tighter">Amazon</span>
             <span className="font-black text-xl italic tracking-tighter">Zepto</span>
             <span className="font-black text-xl italic tracking-tighter">Blinkit</span>
          </motion.div>
        </div>

        {/* High-End Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8 text-brand-slate" />,
              title: "Weekly Micro-Premiums",
              desc: "Subscription models designed for the erratic earning cycles of the gig economy.",
              accent: "bg-brand-slate/5"
            },
            {
              icon: <Zap className="w-8 h-8 text-brand-yellow" />,
              title: "Zero-Touch Claims",
              desc: "Satellite data triggers instant UPI payouts—no paperwork, no phone calls, no delays.",
              accent: "bg-brand-yellow/10"
            },
            {
              icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
              title: "AI Risk Telemetry",
              desc: "Hyper-local risk modeling ensures you only pay for the specific threats in your zone.",
              accent: "bg-blue-500/5"
            }
          ].map((feature, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="p-10 rounded-[40px] bg-white border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:border-brand-yellow transition-all group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${feature.accent} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 w-fit group-hover:bg-brand-yellow transition-colors relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-3 text-brand-slate tracking-tight italic">{feature.title}</h3>
              <p className="text-slate-500 font-bold leading-snug tracking-tight">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
