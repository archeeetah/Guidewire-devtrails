"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Zap, CloudRain, AlertCircle, Wind, Loader2 } from "lucide-react";

interface ProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
}

export default function ProtectionModal({ isOpen, onClose, platform }: ProtectionModalProps) {
  const [quote, setQuote] = useState<{ final_weekly_premium: number; base_premium: number; risk_adjustment: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mocking the zone for the demo. In a real app, this would come from GPS/User Profile.
  const primaryZone = platform.includes("Amazon") ? "Dharavi" : platform.includes("Zomato") ? "Andheri" : "Delhi-NCR";
  
  useEffect(() => {
    if (isOpen && platform) {
      setIsLoading(true);
      fetch("http://localhost:8000/api/policies/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          platform: platform.split(" /")[0], 
          primary_zone: primaryZone 
        })
      })
      .then(res => res.json())
      .then(data => {
        setQuote(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch quote", err);
        setIsLoading(false);
      });
    } else {
      setQuote(null);
    }
  }, [isOpen, platform, primaryZone]);

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
              <div className="mb-8 p-6 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 relative">
                <p className="text-brand-slate font-bold mb-1 opacity-70">AI Adjusted Weekly Premium</p>
                
                {isLoading ? (
                  <div className="flex items-center gap-2 text-slate-500 py-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="font-medium font-mono text-sm">Calculating Risk...</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-brand-slate">
                        ₹{quote ? quote.final_weekly_premium : "--"}
                      </span>
                      <span className="text-slate-500 font-bold">/week</span>
                    </div>
                    {quote && quote.risk_adjustment !== 0 && (
                      <p className={`text-sm font-bold mt-2 ${quote.risk_adjustment > 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {quote.risk_adjustment > 0 ? "+" : ""}
                        ₹{quote.risk_adjustment} Risk Adjustment for {primaryZone}
                      </p>
                    )}
                  </div>
                )}
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
                Activate Protection (₹{quote ? quote.final_weekly_premium : "--"})
              </button>
              <p className="text-center mt-4 text-xs text-slate-400 font-medium">
                Powered by Guidewire Underwriting API (Simulation)
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
