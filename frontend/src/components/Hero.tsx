"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-10 sm:pt-20 pb-10 sm:pb-16 overflow-hidden">
      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center px-3 py-1.5 mb-4 sm:mb-6 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-slate text-xs sm:text-sm font-semibold">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-yellow-500" />
            <span>AI-Powered Parametric Protection</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 sm:mb-6 text-brand-slate leading-[0.95]">
            Secure Your <span className="text-yellow-500">Weekly Earnings</span>
          </h1>
          
          <p className="text-base sm:text-xl text-slate-600 mb-6 sm:mb-10 leading-relaxed font-medium px-2">
            ShramShield provides an instant financial safety net for India's gig workers. 
            Automated payouts triggered by weather and city disruptions. 
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <a href="#platforms" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-brand-yellow text-brand-dark font-black rounded-xl sm:rounded-2xl hover:bg-black hover:text-white transition-all shadow-xl shadow-brand-yellow/20 active:scale-[0.97]">
                Get Protected
              </button>
            </a>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white border-2 border-slate-100 text-brand-slate font-bold rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.97]">
              Watch Demo
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8"
        >
          {[
            {
              icon: <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-brand-slate" />,
              title: "Weekly Pricing",
              desc: "Flexible premiums adjusted to your weekly earning cycle."
            },
            {
              icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />,
              title: "Zero-Touch Claims",
              desc: "Instant payouts triggered automatically by parametric events."
            },
            {
              icon: <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-brand-slate" />,
              title: "AI Risk Assessment",
              desc: "Predictive modeling ensures you get the fairest rates."
            }
          ].map((feature, i) => (
            <div key={i} className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-yellow transition-all group active:scale-[0.98]">
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white w-fit group-hover:bg-brand-yellow/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-black mb-1.5 sm:mb-2 text-brand-slate">{feature.title}</h3>
              <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Background Decor - simplified on mobile for performance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[800px] h-[200px] sm:h-[400px] bg-brand-yellow/5 blur-[60px] sm:blur-[100px] rounded-full -z-10" />
    </section>
  );
}
