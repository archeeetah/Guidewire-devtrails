"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-slate text-sm font-semibold">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            <span>AI-Powered Parametric Protection</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-brand-slate leading-[0.9]">
            Secure Your <span className="text-yellow-500">Weekly Earnings</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
            SafeZone provides an instant financial safety net for India's gig workers. 
            Automated payouts triggered by weather and city disruptions. 
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#platforms">
              <button className="px-8 py-4 bg-brand-yellow text-brand-dark font-black rounded-2xl hover:bg-black hover:text-white transition-all shadow-xl shadow-brand-yellow/20">
                Get Protected
              </button>
            </a>
            <button className="px-8 py-4 bg-white border-2 border-slate-100 text-brand-slate font-bold rounded-2xl hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: <ShieldCheck className="w-8 h-8 text-brand-slate" />,
              title: "Weekly Pricing",
              desc: "Flexible premiums adjusted to your weekly earning cycle."
            },
            {
              icon: <Zap className="w-8 h-8 text-yellow-500" />,
              title: "Zero-Touch Claims",
              desc: "Instant payouts triggered automatically by parametric events."
            },
            {
              icon: <BarChart3 className="w-8 h-8 text-brand-slate" />,
              title: "AI Risk Assessment",
              desc: "Predictive modeling ensures you get the fairest rates."
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-yellow transition-all group">
              <div className="mb-4 p-3 rounded-2xl bg-white w-fit group-hover:bg-brand-yellow/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black mb-2 text-brand-slate">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-yellow/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-brand-yellow/10 rounded-full blur-3xl -z-10 animate-pulse" />
    </section>
  );
}
