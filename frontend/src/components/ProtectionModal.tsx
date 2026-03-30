"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Zap, CloudRain, AlertCircle, Wind, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ProtectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
}

export default function ProtectionModal({ isOpen, onClose, platform }: ProtectionModalProps) {
  const [quote, setQuote] = useState<{ final_weekly_premium: number; base_premium: number; risk_adjustment: number; risk_factors: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [primaryZone, setPrimaryZone] = useState("Mumbai");

  useEffect(() => {
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
      fetch("/api/policies/quote", {
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
        <div className="fixed inset-0 z-[100] flex items-end sm:items-stretch sm:justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full sm:max-w-lg bg-white sm:border-l border-slate-200 shadow-2xl h-[92dvh] sm:h-full overflow-y-auto flex flex-col font-sans rounded-t-3xl sm:rounded-none"
          >
            {/* Header Area */}
            <div className="p-6 sm:p-8 pb-0 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20 border-b border-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <ShieldCheck className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Coverage Quote</h2>
                  <p className="text-slate-500 font-medium text-sm tracking-tight">{platform} • {primaryZone}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 active:scale-95 rounded-full transition-all"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 flex-grow">
              {/* Premium Card */}
              <div className="p-8 rounded-2xl bg-slate-900 text-white shadow-xl relative overflow-hidden group border border-slate-800">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform pointer-events-none">
                   <Zap className="w-32 h-32 text-blue-400" />
                </div>
                
                <div className="relative z-10">
                   <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                     Dynamic Risk Adjustment
                   </p>
                   {isLoading ? (
                     <div className="flex items-center gap-3 py-4">
                       <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                       <span className="font-semibold text-lg">Analyzing Geolocation Data...</span>
                     </div>
                   ) : (
                     <div className="mb-4">
                       <div className="flex items-baseline gap-2">
                         <span className="text-5xl font-bold tracking-tight">₹{quote?.final_weekly_premium || "--"}</span>
                         <span className="text-slate-400 font-medium text-lg">/week</span>
                       </div>
                       {quote?.risk_factors && quote.risk_factors.length > 0 && (
                         <div className="mt-5 space-y-2">
                            {quote.risk_factors.map((f, i) => (
                              <p key={i} className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> {f}
                              </p>
                            ))}
                         </div>
                       )}
                     </div>
                   )}
                </div>
              </div>

              {/* Parametric Logic Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                   <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wide">Automated Payout Triggers</h3>
                   <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm">Active Monitoring</span>
                </div>

                <div className="space-y-2">
                  {[
                    { 
                      icon: <CloudRain className="w-5 h-5 text-blue-500" />, 
                      label: "Rainfall Displacement", 
                      value: "> 10mm / day",
                      active: isZomato 
                    },
                    { 
                      icon: <Wind className="w-5 h-5 text-amber-500" />, 
                      label: "Air Quality Volatility", 
                      value: "AQI > 300",
                      active: !isAmazon
                    },
                    { 
                      icon: <AlertCircle className="w-5 h-5 text-rose-500" />, 
                      label: "Zonal Grid-Lock", 
                      value: "Curfew/Lockout",
                      active: isAmazon
                    }
                  ].filter(t => t.active).map((trigger, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
                          {trigger.icon}
                        </div>
                        <span className="text-slate-800 font-semibold text-sm">{trigger.label}</span>
                      </div>
                      <span className="font-mono text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {trigger.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payout Promise */}
              <div className="bg-slate-50 p-5 rounded-xl border border-dashed border-slate-200">
                 <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                      This policy runs on a <strong className="text-slate-800 font-semibold">parametric smart contract</strong>. If local telemetry hits a trigger threshold, ₹2,500 is routed directly to your UPI ID without a claims process.
                    </p>
                 </div>
              </div>
            </div>

            {/* Final Action */}
            <div className="p-6 sm:p-8 pt-4 sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-100 z-20">
              <Link href="/login" className="block w-full">
                <button 
                   disabled={isLoading}
                   className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-3 text-base active:scale-95 disabled:opacity-50"
                >
                  Confirm Registration
                  <ArrowRight className="w-4 h-4 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
