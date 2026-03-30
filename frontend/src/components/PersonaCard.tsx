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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onSelect}
      className="group cursor-pointer active:scale-[0.98] transition-transform h-full"
    >
      <div className="bg-white p-6 sm:p-8 rounded-2xl h-full border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col relative overflow-hidden">
        
        <div className="flex justify-between items-start mb-6">
           <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:bg-slate-100 transition-colors shadow-sm" style={{ color }}>
             {icon}
           </div>
           <ShieldCheck className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-slate-900 tracking-tight">
          {platform}
        </h3>
        
        <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed font-medium">
          {description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-slate-50 group-hover:bg-blue-50/50 px-4 py-3 rounded-xl border border-slate-100 transition-colors">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{riskText}</span>
          </div>
          
          <div className="mt-5 flex items-center justify-between text-blue-600 font-semibold text-sm opacity-60 group-hover:opacity-100 transition-opacity">
             <span>Check Coverage API</span>
             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
