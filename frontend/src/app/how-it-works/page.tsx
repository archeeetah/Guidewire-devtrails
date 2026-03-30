"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { CloudLightning, Cpu, Smartphone, ShieldCheck, MapPin, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: <MapPin className="w-6 h-6 text-blue-600" />,
    title: "Secure Your Zone",
    desc: "Pick your delivery platform and primary work zone. Our AI calculates a precise premium based on that area's hyper-local risk telemetry.",
    color: "bg-white border-slate-200 text-slate-900"
  },
  {
    number: "02",
    icon: <CloudLightning className="w-6 h-6 text-white" />,
    title: "Global Monitoring",
    desc: "24/7 synchronization with satellite and IMD data. We monitor rainfall, AQI, and zonal disruptions while you focus on your work.",
    color: "bg-slate-900 text-white border-slate-800"
  },
  {
    number: "03",
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: "Parametric Trigger",
    desc: "The moment conditions pass our pre-set thresholds (e.g., >30mm rainfall), the parametric smart contract executes automatically.",
    color: "bg-white border-slate-200 text-slate-900"
  },
  {
    number: "04",
    icon: <Smartphone className="w-6 h-6 text-emerald-600" />,
    title: "Instant Payout",
    desc: "No claims, no phone calls, no delays. Payout is sent instantly to your UPI ID, replacing lost income within minutes.",
    color: "bg-emerald-50 border-emerald-100 text-slate-900"
  }
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 pb-24 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 sm:pt-32 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white border border-slate-200 shadow-sm"
          >
             <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Automated Workflow</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            Predict. Protect. <span className="text-blue-600">Prosper.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
          >
             ShramShield isn't like traditional insurance. It's automated parametric software that monitors India's cities and acts the moment you're disrupted.
          </motion.p>
        </div>

        {/* Vertical Stepper with Visuals */}
        <div className="space-y-6 max-w-4xl mx-auto">
           {STEPS.map((step, i) => (
             <motion.div 
               key={step.number}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className={`p-8 sm:p-12 rounded-3xl border ${step.color} shadow-sm hover:shadow-md transition-all relative overflow-hidden group`}
             >
                <div className="absolute top-8 right-8 text-7xl font-black opacity-[0.03] leading-none pointer-events-none group-hover:scale-110 transition-transform">
                   {step.number}
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                   <div className={`p-4 rounded-xl shrink-0 ${i === 1 ? 'bg-slate-800' : (i === 3 ? 'bg-emerald-100/50' : 'bg-slate-50 border border-slate-100')}`}>
                      {step.icon}
                   </div>

                   <div className="flex flex-col justify-center pt-2">
                      <h3 className="text-2xl font-bold tracking-tight mb-3">{step.title}</h3>
                      <p className={`text-base font-medium leading-relaxed max-w-2xl ${i === 1 ? 'text-slate-400' : 'text-slate-500'}`}>
                         {step.desc}
                      </p>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Automated vs Traditional Comparison */}
        <div className="mt-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
           <div className="p-10 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <h4 className="text-xl font-bold mb-6 text-slate-900 tracking-tight">Traditional Insurance</h4>
              <ul className="space-y-4 font-medium text-sm text-slate-500">
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-400 rounded-full"/> Weeks of waiting for approval</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-400 rounded-full"/> Extensive paperwork and forms</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-400 rounded-full"/> Subjective human evaluation</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-red-400 rounded-full"/> Phone calls and loss adjusters</li>
              </ul>
           </div>
           
           <div className="p-10 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                 <ShieldCheck className="w-32 h-32 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold mb-6 tracking-tight flex items-center gap-2 relative z-10">
                 <Zap className="w-5 h-5 text-blue-400" /> Parametric Architecture
              </h4>
              <ul className="space-y-4 font-medium text-sm text-slate-300 relative z-10">
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/> 0 seconds waiting for approval</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/> 0 papers and no manual forms</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/> Fully objective satellite triggers</li>
                 <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/> API verified instant UPI transfer</li>
              </ul>
           </div>
        </div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center pb-10"
        >
           <h4 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Ready to secure your work?</h4>
           <a href="/#platforms">
              <button className="px-8 py-4 bg-blue-600 text-white hover:bg-blue-500 font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-3 text-base mx-auto active:scale-95 group">
                 Review Coverage Options <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
              </button>
           </a>
        </motion.div>
      </div>
    </main>
  );
}
