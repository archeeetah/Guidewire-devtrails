"use client";

import { motion } from "framer-motion";
import { Sparkles, Navigation, ShieldCheck, AlertTriangle, ArrowUpRight, Megaphone, Speaker } from "lucide-react";
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
    const text = `${t.recommendation_prefix} ${rec.zone_name}. ${rec.threat_type} ${t.history.toLowerCase()}. stability index ${rec.esi_score} percent.`;
    speak(text);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden group">
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-500/20 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -ml-16 -mb-16" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl">
                 <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                 <h3 className="text-lg font-bold leading-none">{t.earnings_shield}</h3>
                 <p className="text-xs text-slate-400 mt-1 font-medium italic">Powered by ShramShield AI</p>
              </div>
           </div>
           {loading && <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
           {recommendations.slice(0, 2).map((rec, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all cursor-pointer group/card"
              >
                 <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black tracking-widest uppercase bg-blue-600 px-2.5 py-1 rounded-full text-white shadow-lg shadow-blue-600/20">
                       {rec.protection_density} Protection Density
                    </span>
                    <button 
                      onClick={() => handleVoiceInsight(rec)}
                      className="p-1.5 bg-white/10 hover:bg-blue-600 rounded-lg transition-all"
                    >
                       <Megaphone className="w-4 h-4 text-white" />
                    </button>
                 </div>

                 <h4 className="font-bold text-lg mb-1">{rec.zone_name}</h4>
                 <p className="text-xs text-slate-400 font-medium mb-5">{rec.threat_type}</p>

                 <div className="flex items-end justify-between">
                    <div>
                       <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wide mb-1">{t.stability_index}</p>
                       <div className="flex items-center gap-2">
                          <span className={`text-2xl font-black ${rec.esi_score > 60 ? 'text-emerald-400' : 'text-blue-400'}`}>
                             {rec.esi_score}%
                          </span>
                       </div>
                    </div>
                    <button className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-blue-500 hover:text-white transition-all">
                       {t.protect_zone}
                    </button>
                 </div>
              </motion.div>
           ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>AI predicts payout thresholds will be met in suggested zones.</span>
           </div>
           <p className="text-[10px] uppercase tracking-widest font-black text-blue-500">View Map Coverage &rarr;</p>
        </div>
      </div>
    </div>
  );
}
