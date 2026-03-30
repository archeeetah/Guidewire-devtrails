"use client";

import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle } from "lucide-react";

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onClick={onSelect}
      className="group relative p-0.5 sm:p-1 rounded-2xl sm:rounded-3xl bg-white hover:bg-brand-yellow/30 transition-all cursor-pointer active:scale-[0.97]"
    >
      <div className="bg-white p-5 sm:p-8 rounded-[14px] sm:rounded-[22px] h-full border border-slate-100 group-hover:border-brand-yellow/30 transition-all flex flex-col">
        <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 bg-white group-hover:bg-brand-yellow/10 transition-colors border border-slate-50`} style={{ color }}>
          {icon}
        </div>
        
        <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3 flex items-center text-brand-slate group-hover:text-yellow-600 transition-colors">
          {platform}
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </h3>
        
        <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-6 flex-grow leading-relaxed font-medium">
          {description}
        </p>

        <div className="pt-4 sm:pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-brand-slate bg-brand-yellow/10 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-brand-yellow/20">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600 shrink-0" />
            <span>{riskText}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
