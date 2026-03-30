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

  const [primaryZone, setPrimaryZone] = useState("Mumbai");

  useEffect(() => {
    // Attempt to detect zone if not set
    if (typeof window !== "undefined" && navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(async (pos) => {
         try {
           const { latitude, longitude } = pos.coords;
           const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
           const data = await res.json();
           const city = data.address.city || data.address.town || "Mumbai";
           setPrimaryZone(city);
         } catch (e) {
           console.error("Location detection failed for modal", e);
         }
       });
    }
  }, []);
  
  useEffect(() => {
    if (isOpen && platform) {
      setIsLoading(true);
      fetch("http://127.0.0.1:8001/api/policies/quote", {
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isZomato = platform === "Zomato / Swiggy";
  const isAmazon = platform === "Amazon / Flipkart";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-slate/50 backdrop-blur-sm sm:backdrop-blur-md"
          />
          
          {/* Modal - slides up from bottom on mobile (bottom sheet pattern) */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-lg bg-white rounded-t-[24px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto overscroll-contain"
          >
            {/* Drag handle for mobile */}
            <div className="sm:hidden flex justify-center pt-3 pb-1 sticky top-0 bg-white z-10">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="p-5 sm:p-8 pb-0 flex items-center justify-between sticky top-0 sm:top-0 bg-white z-10">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-yellow rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-black w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-brand-slate tracking-tight">Active Protection</h2>
                  <p className="text-slate-500 font-medium text-xs sm:text-sm">Powered by ShramShield AI</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8">
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 relative">
                <p className="text-brand-slate font-bold mb-1 opacity-70 text-sm sm:text-base">AI Adjusted Weekly Premium</p>
                
                {isLoading ? (
                  <div className="flex items-center gap-2 text-slate-500 py-2">
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    <span className="font-medium font-mono text-xs sm:text-sm">Calculating Risk...</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-brand-slate">
                        ₹{quote ? quote.final_weekly_premium : "--"}
                      </span>
                      <span className="text-slate-500 font-bold text-sm sm:text-base">/week</span>
                    </div>
                    {quote && quote.risk_adjustment !== 0 && (
                      <p className={`text-xs sm:text-sm font-bold mt-2 ${quote.risk_adjustment > 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {quote.risk_adjustment > 0 ? "+" : ""}
                        ₹{quote.risk_adjustment} Risk Adjustment for {primaryZone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-black text-brand-slate mb-3 sm:mb-4">Parametric Triggers</h3>
              <div className="space-y-2.5 sm:space-y-4">
                {[
                  { 
                    icon: <CloudRain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />, 
                    label: "Rainfall Displacement", 
                    value: "> 10mm / day",
                    active: isZomato 
                  },
                  { 
                    icon: <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />, 
                    label: "Air Quality Index", 
                    value: "AQI > 300",
                    active: !isAmazon
                  },
                  { 
                    icon: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />, 
                    label: "Restricted Zones", 
                    value: "Grid Lockout",
                    active: isAmazon
                  }
                ].map((trigger, i) => (
                  <div key={i} className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-50 bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      {trigger.icon}
                      <span className="text-slate-700 font-bold text-xs sm:text-sm tracking-tight">{trigger.label}</span>
                    </div>
                    <span className="text-brand-slate font-black text-[10px] sm:text-xs px-2 py-1 bg-white rounded-md sm:rounded-lg shadow-sm border border-slate-100 shrink-0 ml-2">
                      {trigger.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA - sticky bottom on mobile */}
            <div className="p-5 sm:p-8 pt-2 sm:pt-0 sticky bottom-0 bg-white pb-[max(1.25rem,var(--safe-bottom))]">
              <button className="w-full py-4 bg-brand-yellow text-brand-dark font-black rounded-2xl hover:bg-black hover:text-white transition-all shadow-xl shadow-brand-yellow/20 flex items-center justify-center gap-2 active:scale-[0.97] text-sm sm:text-base">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Activate Protection (₹{quote ? quote.final_weekly_premium : "--"})
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
