"use client";

import { motion } from "framer-motion";
import { ArrowRight, CloudRain, ThermometerSun, AlertTriangle } from "lucide-react";

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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onSelect}
      className="group relative p-1 rounded-3xl bg-white hover:bg-brand-yellow/30 transition-all cursor-pointer"
    >
      <div className="bg-white p-8 rounded-[22px] h-full border border-slate-100 group-hover:border-brand-yellow/30 transition-all flex flex-col">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white group-hover:bg-brand-yellow/10 transition-colors border border-slate-50`} style={{ color }}>
          {icon}
        </div>
        
        <h3 className="text-2xl font-black mb-3 flex items-center text-brand-slate group-hover:text-yellow-600 transition-colors">
          {platform}
          <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </h3>
        
        <p className="text-slate-500 mb-6 flex-grow leading-relaxed font-medium">
          {description}
        </p>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm font-bold text-brand-slate bg-brand-yellow/10 px-4 py-3 rounded-xl border border-brand-yellow/20">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span>{riskText}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
