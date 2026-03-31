"use client";

import { useState, useEffect } from "react";
import { 
  CloudLightning, MapPin, ShieldCheck, CheckCircle2, 
  CloudRain, AlertCircle, Loader2, ArrowRight, ArrowUpRight, 
  Zap, History, Navigation, Bell, Activity, ChevronRight, Home, Globe, Volume2, 
  Menu, Settings, HelpCircle, Map, Heart, PieChart, ShieldAlert, User, LogOut, ChevronDown, Terminal, ExternalLink, Calendar, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSensorTelemetry } from "@/hooks/useSensorTelemetry";
import { useVoiceAccessibility } from "@/hooks/useVoiceAccessibility";
import { translations } from "@/utils/translations";
import EarningsShield from "@/components/EarningsShield";
import { toast } from "sonner";

export default function WorkerPortal() {
  const { lang, setLang, speak } = useVoiceAccessibility('en');
  const t = translations[lang] || translations.en;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const { isCapturing } = useSensorTelemetry(user?.id);

  const [policies, setPolicies] = useState<any[]>([]);
  const [quote, setQuote] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const phone = localStorage.getItem("worker_phone");
      if (!phone) {
        setLoading(false);
        window.location.href = "/login";
        return;
      }

      try {
        const [uRes, pRes, payRes] = await Promise.all([
          fetch(`/api/users/${phone}`).then(r => r.ok ? r.json() : null),
          fetch(`/api/policies/worker/${phone}`).then(r => r.ok ? r.json() : []),
          fetch(`/api/payouts/worker/${phone}`).then(r => r.ok ? r.json() : [])
        ]);

        if (uRes) {
          setUser(uRes);
          // Fetch Quote only if user is found
          const qRes = await fetch("/api/policies/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ platform: uRes.platform, primary_zone: uRes.primary_zone })
          });
          if (qRes.ok) setQuote(await qRes.json());
        }
        
        setPolicies(pRes);
        
        if (payRes.length > payouts.length && payouts.length > 0) {
            const newPay = payRes[0];
            speak(`${t.status_payout}. ₹${newPay.amount}`);
        }
        setPayouts(payRes);

      } catch (err) {
        console.error("Portal Data Sync Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [lang, t, speak]);

  const handleLogout = () => {
    localStorage.removeItem("worker_phone");
    window.location.href = "/login";
  };

  const handleSwitchZone = async (zName: string) => {
    if (!user) return;
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: `Calibrating sensors for ${zName}...`,
        success: () => {
           speak(`Base zone updated to ${zName}`);
           return `Base zone set to ${zName}`;
        }
      }
    );
  };

  const handlePurchase = async () => {
    if (!user || !quote) return;
    setPurchasing(true);
    try {
      const res = await fetch("/api/policies/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          primary_zone: user.primary_zone,
          coverage_amount: quote.coverage_amount,
          premium_amount: quote.premium_amount,
          rain_trigger_active: true,
          aqi_trigger_active: true,
          zone_lockout_active: true
        })
      });
      if (res.ok) {
        const newPolicy = await res.json();
        setPolicies([newPolicy]);
        setQuote(null);
        toast.success(t.active_protection);
        speak(t.active_protection);
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-6">
        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
           <ShieldCheck className="text-white w-8 h-8" />
        </div>
        <div className="text-center">
           <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400 mb-1">Encrypted Telemetry Node</p>
           <p className="text-sm font-bold text-slate-900">Syncing Protection Status...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10"
          >
            {/* Main Stream (Primary Actions) */}
            <div className="lg:col-span-12 xl:col-span-8 space-y-10">
               
               {/* Active Shield Card */}
               {policies.length > 0 ? (
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                     <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div>
                          <div className="flex items-center gap-2.5 mb-8">
                             <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-glow shadow-emerald-400" />
                             <span className="text-[10px] font-black uppercase tracking-[2px] text-emerald-400 leading-none">{t.active_protection}</span>
                          </div>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{t.payout_guarantee}</p>
                          <h3 className="text-6xl font-black tracking-tighter italic">₹{policies[0].coverage_amount}</h3>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex-grow max-w-sm">
                           <div className="flex justify-between items-center text-xs font-bold mb-4">
                              <span className="text-slate-500 uppercase tracking-widest">Active Zone</span>
                              <span className="text-emerald-400 uppercase truncate pl-4">{policies[0].primary_zone}</span>
                           </div>
                           <div className="h-[1px] bg-white/10 mb-4" />
                           <p className="text-[9px] font-black italic text-blue-400 uppercase tracking-[2px] text-center">Zero-Trust Mobility Link Stabilized</p>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center lg:py-24">
                     <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <CloudRain className="w-10 h-10 text-slate-300" />
                     </div>
                     <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{t.no_shield}</h3>
                     <p className="text-base text-slate-500 font-medium leading-relaxed mb-10 max-w-sm mx-auto">Environmental volatility detected in your area. Activate your stabilization shield now.</p>
                     {quote && (
                        <button 
                          onClick={handlePurchase} disabled={purchasing}
                          className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 mx-auto"
                        >
                          {purchasing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                          {t.activate_shield} (₹{quote.premium_amount})
                        </button>
                     )}
                  </div>
               )}

               {/* Sensor Matrix */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
                     <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 self-start">
                        <Activity className={`w-5 h-5 ${isCapturing ? 'text-emerald-500' : 'text-slate-300'}`} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">{t.mobility_live}</p>
                        <p className="text-sm font-black text-slate-900 tracking-tight leading-none capitalize">{isCapturing ? 'Verifying Activity...' : 'Sensors Optimized'}</p>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
                     <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 self-start">
                        <Navigation className="w-5 h-5 text-blue-600" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">Atmospheric Telemetry</p>
                        <p className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase">Condition: STABLE</p>
                     </div>
                  </div>
               </div>

               {/* AI Insights Carousel */}
               <EarningsShield lang={lang} />
            </div>

            {/* Sidebar Support (Desktop) */}
            <div className="lg:col-span-12 xl:col-span-4 space-y-10">
               <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm h-full max-h-[800px] flex flex-col overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                     <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">{t.history}</h4>
                     <button onClick={() => setActiveTab('history')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Full Audit</button>
                  </div>
                  <div className="flex-grow overflow-y-auto p-4 space-y-3">
                     {payouts.length > 0 ? payouts.slice(0, 5).map((p, i) => (
                        <div key={i} className="p-4 border border-slate-100 rounded-[2rem] bg-slate-50 flex items-center justify-between">
                           <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                              <Zap className="w-5 h-5 text-blue-600" />
                           </div>
                           <div className="flex-grow min-w-0 px-4">
                              <p className="font-black text-xs text-slate-800 truncate">{p.trigger_type}</p>
                              <p className="font-mono text-[8px] text-slate-400 uppercase tracking-tighter truncate">Ref: {p.transaction_id || 'INTERNAL'}</p>
                           </div>
                           <div className="text-right flex-shrink-0">
                              <p className="font-black text-slate-900 text-sm tracking-tighter font-mono">₹{p.amount}</p>
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-emerald-500 text-white uppercase">{p.payout_status.split('_')[0]}</span>
                           </div>
                        </div>
                     )) : (
                        <div className="py-20 text-center opacity-30">
                           <Activity className="w-10 h-10 mx-auto mb-4" />
                           <p className="text-[10px] font-black uppercase tracking-widest leading-loose italic">Monitoring climate nodes for automated trigger events...</p>
                        </div>
                     )}
                  </div>
               </div>

               <button className="w-full bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between group hover:bg-black transition-all shadow-xl">
                  <div className="flex items-center gap-5 text-left">
                     <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-105 transition-all">
                        <ShieldAlert className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <p className="font-black text-xl tracking-tighter uppercase leading-none mb-1">{t.emergency}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-70 italic">Parametric SOS Assist</p>
                     </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1.5 transition-all" />
               </button>
            </div>
          </motion.div>
        );

      case 'zones':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
             <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 lg:p-12 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                   <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Safety Zone Auditor</h3>
                      <p className="text-slate-500 font-medium text-sm">Real-time risk telemetry for active delivery zones across Chennai Metropolitan area.</p>
                   </div>
                   <div className="p-1 px-4 bg-emerald-50 border border-emerald-200 rounded-full flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Stable Conditions</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {[
                     { name: 'Chennai Central', risk: 'Low', volatility: '2.1%', riders: 120, cover: 'AVAILABLE' },
                     { name: 'Tambaram East', risk: 'Stable', volatility: '1.4%', riders: 45, cover: 'AVAILABLE' },
                     { name: 'Adyar / Thiruvanmiyur', risk: 'Low', volatility: '2.8%', riders: 88, cover: 'AVAILABLE' },
                     { name: 'T-Nagar Hub', risk: 'Moderate', volatility: '5.2%', riders: 210, cover: 'DEMAND HIGH' },
                     { name: 'Velachery Lake View', risk: 'High Risk', volatility: '12.4%', riders: 12, cover: 'PEAK PRICED' },
                     { name: 'Mount Road / Anna Salai', risk: 'Stable', volatility: '0.9%', riders: 340, cover: 'AVAILABLE' },
                   ].map((zone, i) => (
                      <div key={i} className="p-6 border border-slate-100 rounded-[2.5rem] hover:border-blue-200 hover:shadow-xl transition-all group bg-slate-50 hover:bg-white flex flex-col justify-between h-56">
                         <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                               <MapPin className={`w-6 h-6 ${zone.risk === 'High Risk' ? 'text-rose-500' : 'text-slate-400'}`} />
                            </div>
                            <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-[2px] ${zone.risk === 'Low' || zone.risk === 'Stable' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                               {zone.risk}
                            </span>
                         </div>
                         <div>
                            <p className="font-black text-slate-500 text-[10px] uppercase tracking-widest mb-1 italic">V-{zone.volatility}</p>
                            <h5 className="font-black text-slate-900 text-lg tracking-tight mb-4 leading-none">{zone.name}</h5>
                            <button 
                              onClick={() => handleSwitchZone(zone.name)}
                              className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                            >
                               {t.switch_zone || 'Switch Base'}
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </motion.div>
        );

      case 'history':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 lg:p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-8">
                   <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Payout Audit Log</h3>
                      <p className="text-slate-500 font-medium text-sm">Automated parametric settlements processed by Mobility Intelligence.</p>
                   </div>
                   <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                      <div className="px-4 py-2 bg-white rounded-xl shadow-sm">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Recovered</p>
                         <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">₹{payouts.reduce((sum, p) => sum + p.amount, 0)}</p>
                      </div>
                   </div>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trigger Node</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence Type</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Hash</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {payouts.length > 0 ? payouts.map((p, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-blue-600" />
                                     </div>
                                     <p className="font-bold text-sm text-slate-900">{p.trigger_type}</p>
                                  </div>
                               </td>
                               <td className="px-8 py-6 font-medium text-xs text-slate-500 uppercase tracking-wider">{p.trigger_reason}</td>
                               <td className="px-8 py-6 font-mono font-black text-slate-900">₹{p.amount}</td>
                               <td className="px-8 py-6">
                                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest inline-block ${p.payout_status === 'SETTLED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                     {p.payout_status}
                                  </span>
                               </td>
                               <td className="px-8 py-6 font-mono text-[10px] text-slate-400 group-hover:text-blue-500 transition-colors uppercase">{p.transaction_id || 'PENDING_HUB'}</td>
                               <td className="px-8 py-6 text-right">
                                  <button onClick={() => speak(`Payout of ${p.amount} triggered by ${p.trigger_type}`)} className="p-2 hover:bg-white rounded-lg transition-all">
                                     <Volume2 className="w-4 h-4 text-slate-300 hover:text-blue-500" />
                                  </button>
                               </td>
                            </tr>
                         )) : (
                            <tr>
                               <td colSpan={6} className="py-32 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">
                                  No environmental triggers logged in legal audit trail.
                               </td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </motion.div>
        );

      case 'preferences':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto space-y-10"
          >
             <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm">
                <div className="flex items-center gap-8 mb-12">
                   <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl relative">
                      {user?.name?.charAt(0)}
                      <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center">
                         <ChevronDown className="w-4 h-4 text-white" />
                      </button>
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">{user?.name}</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">Verified ID: {user?.platform_worker_id}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Global Settings</p>
                      <div className="space-y-4">
                         {[
                           { label: 'Display Name', value: user?.name, desc: 'Name used in claim audits' },
                           { label: 'Work Platform', value: user?.platform, desc: 'Primary telemetry source' },
                           { label: 'Base Phone', value: user?.phone_number, desc: 'Secure identifier' },
                           { label: 'UPI Linked ID', value: user?.upi_id, desc: 'Automated settlement destination' },
                         ].map((field, i) => (
                           <div key={i} className="p-5 border border-slate-100 rounded-3xl bg-slate-50 flex items-center justify-between">
                              <div>
                                 <p className="font-bold text-slate-900 text-xs mb-0.5">{field.label}</p>
                                 <p className="text-[10px] text-slate-400 font-medium">{field.desc}</p>
                              </div>
                              <p className="font-black text-slate-900 text-xs uppercase tracking-tight">{field.value}</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Accessibility Hub</p>
                      <div className="space-y-4">
                         <div className="p-6 border border-slate-200 rounded-[2.5rem] bg-white shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-blue-50 rounded-2xl">
                                  <Globe className="w-5 h-5 text-blue-600" />
                               </div>
                               <div>
                                  <p className="font-black text-slate-900 text-xs uppercase tracking-tight">Active Language</p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase italic">{lang === 'en' ? 'English (Global)' : (lang === 'hi' ? 'Hindi (Regional)' : 'Tamil (Regional)')}</p>
                               </div>
                            </div>
                            <div className="flex gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-100">
                               {(['en', 'hi', 'ta'] as const).map(l => (
                                 <button key={l} onClick={() => setLang(l)} className={`w-8 h-8 rounded-lg text-[9px] font-black uppercase transition-all ${lang === l ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                                    {l}
                                 </button>
                               ))}
                            </div>
                         </div>

                         <button onClick={handleLogout} className="w-full p-6 border-2 border-dashed border-rose-200 rounded-[2.5rem] bg-rose-50/10 flex items-center justify-between group hover:bg-rose-50 transition-all">
                            <div className="flex items-center gap-4 text-left">
                               <div className="p-3 bg-rose-100 rounded-2xl group-hover:scale-110 transition-transform">
                                  <LogOut className="w-5 h-5 text-rose-500" />
                               </div>
                               <div>
                                  <p className="font-black text-rose-600 text-xs uppercase tracking-tight">Terminate Session</p>
                                  <p className="text-[9px] text-rose-300 font-bold uppercase">Clear local telemetry keys</p>
                               </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-rose-200 group-hover:translate-x-1.5 transition-all" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        );

      case 'analytics':
        return (
          <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
             className="space-y-10"
          >
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] p-8 lg:p-12 shadow-sm">
                   <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Stability Outlook</h3>
                   <p className="text-slate-500 font-medium text-sm mb-12">Comparative analysis of your earnings volatility vs. protected stability baseline.</p>
                   
                   {/* Mock Growth Chart */}
                   <div className="h-[400px] bg-slate-50 rounded-[3rem] border border-slate-100 relative overflow-hidden flex flex-col justify-end p-12">
                      <div className="absolute inset-0 p-12 opacity-5">
                         <div className="w-full h-full border-b border-l border-slate-900" />
                      </div>
                      <div className="flex items-end gap-4 h-full relative z-10">
                         {[60, 45, 80, 55, 90, 70, 100].map((h, i) => (
                           <div key={i} className="flex-grow bg-blue-600 rounded-t-2xl hover:bg-slate-900 transition-all relative group" style={{ height: `${h}%` }}>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{h * 10}</div>
                           </div>
                         ))}
                      </div>
                      <div className="flex justify-between mt-8">
                         {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d, i) => (
                           <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</span>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                   <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                         <Activity className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-2xl font-black tracking-tighter uppercase mb-4 italic">Efficiency Score</h4>
                      <p className="text-6xl font-black text-emerald-400 tracking-tighter mb-4">98.4</p>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">Your mobility consistency in rain zones is 12.4% higher than the platform average.</p>
                   </div>
                   <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-xl">
                      <h4 className="text-xl font-bold mb-4 tracking-tight">Active Protection Streak</h4>
                      <p className="text-4xl font-black tracking-tighter mb-2">12 Days</p>
                      <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-80 italic">Parametric Stabilizer: OPTIMIZED</p>
                   </div>
                </div>
             </div>
          </motion.div>
        )

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20 lg:pb-0">
      
      {/* 1. Desktop Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 hidden lg:flex flex-col p-6 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2.5 mb-12 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <ShieldCheck className="text-white w-4 h-4" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-slate-900 uppercase">ShramShield</h1>
        </div>

        <nav className="flex-grow space-y-1.5">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'zones', icon: Map, label: 'Safety Zones' },
            { id: 'history', icon: History, label: 'Payout History' },
            { id: 'analytics', icon: PieChart, label: 'Analytics' },
            { id: 'preferences', icon: Settings, label: 'Preferences' },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
           {user && (
             <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md">
                   {user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                   <p className="font-black text-slate-900 text-[13px] truncate">{user.name}</p>
                   <p className="text-[9px] font-black text-slate-400 uppercase truncate tracking-wider italic">{user.platform}</p>
                </div>
             </div>
           )}
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3.5 text-rose-500 font-black text-[10px] uppercase tracking-[2px] hover:bg-rose-50 rounded-xl transition-all">
              <LogOut className="w-4 h-4" /> Log Out
           </button>
        </div>
      </aside>

      {/* 2. Main Responsive Content Container */}
      <div className="lg:pl-64 min-h-screen">
        
        {/* Adaptive Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 lg:px-10 py-6 lg:py-8 sticky top-0 z-40">
           <div className="max-w-[1400px] mx-auto flex justify-between items-center">
              <div className="lg:hidden flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                   <ShieldCheck className="text-white w-4 h-4" />
                </div>
                <h1 className="font-bold text-base tracking-tight text-slate-900 uppercase">ShramShield</h1>
              </div>

              <div className="hidden lg:block">
                 <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-[3px] mb-1">
                    <span>Portal</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-blue-500">{activeTab}</span>
                 </div>
                 <h2 className="text-3xl font-black tracking-tighter text-slate-900 leading-none capitalize">{activeTab === 'dashboard' ? t.dashboard : activeTab}</h2>
              </div>

              <div className="flex items-center gap-4">
                 {/* Desktop Multi-lingual Hub */}
                 <div className="hidden sm:flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                   {(['en', 'hi', 'ta'] as const).map(l => (
                     <button 
                       key={l}
                       onClick={() => setLang(l)}
                       className={`px-4 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${lang === l ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-900'}`}
                     >
                       {l}
                     </button>
                   ))}
                 </div>
                 <div className="flex gap-2.5">
                    <button className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center relative shadow-sm hover:bg-slate-50 transition-colors bg-white">
                       <Bell className="w-5 h-5 text-slate-500" />
                       <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-600 rounded-full border border-white" />
                    </button>
                    <button className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors lg:hidden bg-white">
                       <Menu className="w-5 h-5 text-slate-500" />
                    </button>
                 </div>
              </div>
           </div>
        </header>

        {/* Dynamic Viewport */}
        <div className="max-w-[1400px] mx-auto p-6 lg:p-10">
           <AnimatePresence mode="wait">
              {renderContent()}
           </AnimatePresence>
        </div>

      </div>

      {/* 3. Mobile Bottom Navigation (Responsive Visibility) */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-8 flex items-center justify-between z-50 lg:hidden shadow-[0_-4px_24px_-10px_rgba(0,0,0,0.1)]">
         {[
           { id: 'dashboard', icon: Home, label: 'Dash' },
           { id: 'zones', icon: Map, label: 'Zones' },
           { id: 'history', icon: History, label: 'Audit' },
           { id: 'preferences', icon: Settings, label: 'Setup' },
         ].map((nav) => (
           <button 
             key={nav.id} 
             onClick={() => setActiveTab(nav.id)}
             className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === nav.id ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
           >
              <nav.icon className={`w-6 h-6 ${activeTab === nav.id ? 'fill-blue-600/10' : ''}`} />
              <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === nav.id ? 'opacity-100' : 'opacity-60'}`}>{nav.label}</span>
           </button>
         ))}
      </nav>

    </main>
  );
}
