"use client";

import { motion } from "framer-motion";
import { Sparkles, Navigation, ShieldCheck, AlertTriangle, ArrowUpRight, Megaphone, Speaker, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useVoiceAccessibility } from "@/hooks/useVoiceAccessibility";
import { translations } from "@/utils/translations";

export default function EarningsShield({ lang: externalLang }: { lang: any }) {
  const { speak, setLang } = useVoiceAccessibility(externalLang);
  const t = translations[externalLang] || translations.en;
  
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLang(externalLang);
  }, [externalLang, setLang]);

  const fetchRecs = async () => {
    try {
      const res = await fetch("/api/monitoring/recommendations");
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("AI Insight Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
    const interval = setInterval(fetchRecs, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleVoiceInsight = (rec: any) => {
    const text = `${t.recommendation_prefix} ${rec.zone_name}. ${rec.threat_type}. stability index ${rec.esi_score} percent.`;
    speak(text);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-800 tracking-tight text-sm uppercase tracking-wider">{t.earnings_shield}</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-full border border-slate-200">
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Live Insight</span>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-6 gap-4 no-scrollbar snap-x snap-mandatory">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="min-w-[280px] h-[140px] bg-white border border-slate-200 rounded-3xl" />
          ))
        ) : (
          recommendations.map((rec, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[270px] snap-center bg-white rounded-3xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
            >
               <div className="flex justify-between items-start mb-4">
                  <span className={`text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-lg ${
                     rec.protection_density === 'HIGH' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                     {rec.protection_density} Protection
                  </span>
                  <button 
                    onClick={() => handleVoiceInsight(rec)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all"
                  >
                     <Megaphone className="w-3.5 h-3.5 text-slate-400" />
                  </button>
               </div>

               <div className="mb-6">
                 <h4 className="font-bold text-slate-900 text-lg tracking-tight mb-0.5">{rec.zone_name}</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{rec.threat_type} • {rec.eta_m}m ETA</p>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Stability</span>
                     <span className={`text-xl font-bold tracking-tighter ${rec.esi_score > 60 ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {rec.esi_score}%
                     </span>
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-black transition-all active:scale-95 shadow-sm">
                     {t.protect_zone}
                  </button>
               </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
