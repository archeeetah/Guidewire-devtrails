"use client";

import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";

interface PersonaCardProps {
  platform: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  riskText: string;
  index: number;
  onSelect: () => void;
}

export default function PersonaCard({ platform, icon, color, description, riskText, index, onSelect }: PersonaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onSelect}
      className="group relative cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="bg-white p-8 sm:p-10 rounded-[48px] h-full border border-slate-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:border-brand-yellow/30 transition-all flex flex-col relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-yellow/10 transition-colors" />

        <div className="flex justify-between items-start mb-8">
           <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex items-center justify-center bg-slate-50 group-hover:bg-brand-yellow transition-all border border-slate-100 group-hover:border-brand-yellow shadow-sm" style={{ color }}>
             {icon}
           </div>
           <ShieldCheck className="w-6 h-6 text-slate-200 group-hover:text-brand-yellow transition-colors" />
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-black mb-3 text-brand-slate tracking-tighter italic">
          {platform}
        </h3>
        
        <p className="text-base text-slate-500 mb-8 flex-grow leading-tight font-bold tracking-tight">
          {description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-3 text-xs font-black text-brand-slate uppercase tracking-[0.1em] bg-slate-50 group-hover:bg-brand-yellow/10 px-5 py-4 rounded-3xl border border-slate-100 transition-colors">
            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
            <span>{riskText}</span>
          </div>
          
          <div className="mt-6 flex items-center gap-2 text-brand-yellow font-black uppercase text-[10px] tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
             Check Protection Odds <ArrowRight className="w-3 h-3 translate-y-[-1px]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
