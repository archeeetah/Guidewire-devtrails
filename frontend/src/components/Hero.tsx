"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, BarChart3, ArrowRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 sm:pt-32 pb-24 overflow-hidden bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {/* Refined Background Elements - No aggressive neons */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-emerald-50/50 rounded-full blur-[80px]" />
      </div>

      <div className="container px-6 mx-auto relative z-10 text-slate-900">
        <div className="max-w-4xl mx-auto text-center mb-24">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Live Parametric Network</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
          >
            Protecting the Future of <br className="hidden sm:block" />
            <span className="text-blue-600">Independent Work.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed font-medium max-w-2xl mx-auto"
          >
            ShramShield provides a high-fidelity financial safety net for gig workers. Smart contracts trigger automated payouts based on real-world satellite telemetry.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#platforms" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 text-base active:scale-95 group">
                Join 50,000+ Partners <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </motion.div>

          {/* Trusted Companies */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 pt-10 border-t border-slate-200 max-w-2xl mx-auto"
          >
             <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Trusted by partners operating on</p>
             <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <span className="font-bold text-lg tracking-tight">Zomato</span>
               <span className="font-bold text-lg tracking-tight">Swiggy</span>
               <span className="font-bold text-lg tracking-tight">Amazon</span>
               <span className="font-bold text-lg tracking-tight">Zepto</span>
               <span className="font-bold text-lg tracking-tight">Blinkit</span>
             </div>
          </motion.div>
        </div>

        {/* Feature Cards - SaaS Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: <ShieldCheck className="w-6 h-6 text-slate-600" />,
              title: "Micro-Premiums",
              desc: "Subscription models designed for the erratic earning cycles of the gig economy.",
              bg: "bg-slate-50"
            },
            {
              icon: <Zap className="w-6 h-6 text-blue-600" />,
              title: "Zero-Touch Claims",
              desc: "Satellite data triggers instant UPI payouts—no paperwork, no phone calls, no delays.",
              bg: "bg-blue-50"
            },
            {
              icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
              title: "AI Risk Telemetry",
              desc: "Hyper-local risk modeling ensures you only pay for the specific threats in your zone.",
              bg: "bg-emerald-50"
            }
          ].map((feature, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className={`mb-5 p-3 rounded-xl w-fit ${feature.bg} border border-white`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-900 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
