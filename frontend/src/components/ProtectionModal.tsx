"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Zap, CloudRain, AlertCircle, Wind } from "lucide-react";

interface ProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
}

export default function ProtectionModal({ isOpen, onClose, platform }: ProtectionModalProps) {
  const isZomato = platform === "Zomato / Swiggy";
  const isAmazon = platform === "Amazon / Flipkart";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-slate/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-8 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="text-black w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-brand-slate tracking-tight">Active Protection</h2>
                  <p className="text-slate-500 font-medium text-sm">Powered by ShramShield AI</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="mb-8 p-6 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20">
                <p className="text-brand-slate font-bold mb-1 opacity-70">Weekly Premium</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-brand-slate">₹{isZomato ? "149" : isAmazon ? "199" : "129"}</span>
                  <span className="text-slate-500 font-bold">/week</span>
                </div>
              </div>

              <h3 className="text-lg font-black text-brand-slate mb-4">Parametric Triggers</h3>
              <div className="space-y-4">
                {[
                  { 
                    icon: <CloudRain className="w-5 h-5 text-blue-500" />, 
                    label: "Rainfall Displacement", 
                    value: "> 10mm / day",
                    active: isZomato 
                  },
                  { 
                    icon: <Wind className="w-5 h-5 text-orange-500" />, 
                    label: "Air Quality Index", 
                    value: "AQI > 300",
                    active: !isAmazon
                  },
                  { 
                    icon: <AlertCircle className="w-5 h-5 text-red-500" />, 
                    label: "Restricted Zones", 
                    value: "Grid Lockout",
                    active: isAmazon
                  }
                ].map((trigger, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:border-brand-yellow/30 bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {trigger.icon}
                      <span className="text-slate-700 font-bold text-sm tracking-tight">{trigger.label}</span>
                    </div>
                    <span className="text-brand-slate font-black text-xs px-2 py-1 bg-white rounded-lg shadow-sm border border-slate-100">
                      {trigger.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-8 pt-0">
              <button className="w-full py-4 bg-brand-yellow text-brand-dark font-black rounded-2xl hover:bg-black hover:text-white transition-all shadow-xl shadow-brand-yellow/20 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                Activate Protection
              </button>
              <p className="text-center mt-4 text-xs text-slate-400 font-medium">
                Prowered by Guidewire Underwriting API (Simulation)
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
