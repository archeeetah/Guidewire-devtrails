"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Zap, CloudRain, AlertCircle, Wind, Loader2, ArrowRight } from "lucide-react";
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
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-slate/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="relative w-full sm:max-w-xl bg-white rounded-t-[48px] sm:rounded-[48px] shadow-2xl overflow-hidden border border-slate-100 max-h-[92dvh] overflow-y-auto"
          >
            {/* Header Area */}
            <div className="p-8 sm:p-10 pb-0 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-lg shadow-brand-yellow/20">
                  <ShieldCheck className="text-black w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-slate tracking-tighter italic leading-none">Instant Quote</h2>
                  <p className="text-slate-400 font-bold text-sm tracking-tight">{platform} Partner • {primaryZone}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-50 hover:bg-slate-100 active:scale-90 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-8 sm:p-10 space-y-8">
              {/* Premium Card */}
              <div className="p-8 rounded-[40px] bg-brand-slate text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                   <Zap className="w-24 h-24 text-brand-yellow" />
                </div>
                
                <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase text-brand-yellow tracking-[0.3em] mb-4">Precision Risk-Adjusted Rate</p>
                   {isLoading ? (
                     <div className="flex items-center gap-3 py-4">
                       <Loader2 className="w-8 h-8 animate-spin text-brand-yellow" />
                       <span className="font-black text-xl italic tracking-tighter">Analyzing Telemetry...</span>
                     </div>
                   ) : (
                     <div className="mb-6">
                       <div className="flex items-baseline gap-2">
                         <span className="text-6xl font-black tracking-tighter italic">₹{quote?.final_weekly_premium || "--"}</span>
                         <span className="text-brand-yellow/60 font-black text-xl italic">/week</span>
                       </div>
                       {quote?.risk_factors && quote.risk_factors.length > 0 && (
                         <div className="mt-4 space-y-1">
                            {quote.risk_factors.map((f, i) => (
                              <p key={i} className="text-[10px] font-black text-brand-yellow uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1 h-1 bg-brand-yellow rounded-full" /> {f}
                              </p>
                            ))}
                         </div>
                       )}
                     </div>
                   )}
                </div>
              </div>

              {/* Parametric Logic Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Automated Triggers</h3>
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">Real-time Verified</span>
                </div>

                <div className="space-y-3">
                  {[
                    { 
                      icon: <CloudRain className="w-5 h-5 text-blue-500" />, 
                      label: "Rainfall Displacement", 
                      value: "> 10mm / day",
                      active: isZomato 
                    },
                    { 
                      icon: <Wind className="w-5 h-5 text-orange-500" />, 
                      label: "Air Quality Volatility", 
                      value: "AQI > 300",
                      active: !isAmazon
                    },
                    { 
                      icon: <AlertCircle className="w-5 h-5 text-red-500" />, 
                      label: "Zonal Grid-Lock", 
                      value: "Curfew/Lockout",
                      active: isAmazon
                    }
                  ].map((trigger, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-brand-yellow/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                          {trigger.icon}
                        </div>
                        <span className="text-brand-slate font-black text-sm uppercase tracking-tighter">{trigger.label}</span>
                      </div>
                      <span className="font-black text-xs text-slate-400 italic">
                        {trigger.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payout Promise */}
              <div className="bg-slate-50 p-6 rounded-[32px] border border-dashed border-slate-200">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <p className="text-xs font-bold text-slate-500 leading-tight">
                      ShramShield uses **parametric smart contracts**. If triggers are met, ₹2,500 is sent to your UPI instantly—no claim process required.
                    </p>
                 </div>
              </div>
            </div>

            {/* Final Action */}
            <div className="p-8 sm:p-10 pt-0 sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-slate-100">
              <Link href="/login" className="block w-full">
                <button 
                   disabled={isLoading}
                   className="w-full py-5 bg-brand-slate text-white font-black rounded-3xl hover:bg-black transition-all shadow-2xl shadow-brand-slate/20 flex items-center justify-center gap-3 text-lg leading-none active:scale-95 group disabled:opacity-50"
                >
                  <span className="text-brand-yellow drop-shadow-sm">Activate Protection Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
