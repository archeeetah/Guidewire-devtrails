"use client";

import { useState, useEffect } from "react";
import { 
  CloudLightning, MapPin, ShieldCheck, CheckCircle2, 
  CloudRain, AlertCircle, Loader2, ArrowRight, 
  Zap, History, Navigation, Bell, Activity, ChevronRight, Home 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSensorTelemetry } from "@/hooks/useSensorTelemetry";

export default function WorkerPortal() {
  const [user, setUser] = useState<any>(null);
  const { isCapturing } = useSensorTelemetry(user?.id);

  const [policies, setPolicies] = useState<any[]>([]);
  const [quote, setQuote] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
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
          fetch(`/api/users/${phone}`),
          fetch(`/api/policies/worker/${phone}`),
          fetch(`/api/payouts/worker/${phone}`)
        ]);

        if (!uRes.ok) throw new Error("User not found");

        const userData = await uRes.json();
        const policyData = await pRes.json();
        const payoutData = await payRes.json();

        setUser(userData);
        setPolicies(policyData);
        setPayouts(payoutData);

        if (policyData.length === 0) {
          const qRes = await fetch("/api/policies/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ platform: userData.platform, primary_zone: userData.primary_zone })
          });
          setQuote(await qRes.json());
        }

        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userData.primary_zone}&appid=50ac3262efa601768ceef39ca51d7e47&units=metric`);
        if (weatherRes.ok) setWeather(await weatherRes.json());

      } catch (e) {
        console.error("Portal error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await fetch("/api/policies/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          weekly_premium: quote.final_weekly_premium,
          coverage_amount: 2500.0,
          rain_trigger_active: true,
          aqi_trigger_active: true,
          zone_lockout_active: true
        })
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
      setPurchasing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 font-sans">
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-slate-500 font-semibold uppercase text-xs tracking-widest animate-pulse">Syncing Telemetry...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 pb-32 font-sans">
      
      {/* Clean Corporate Header */}
      <header className="relative bg-white border-b border-slate-200 pt-8 pb-20 px-6 shadow-sm">
        {/* Breadcrumb Row */}
        <div className="max-w-lg mx-auto mb-8">
          <nav className="flex items-center gap-1.5 text-xs font-medium">
            <a href="/" className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </a>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-600 font-semibold">Partner Portal</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-blue-600 font-semibold">Dashboard</span>
          </nav>
        </div>

        <div className="relative z-10 max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight leading-none text-slate-900">ShramShield</h1>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Partner Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
                 <Bell className="w-5 h-5" />
                 <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
               </button>
               <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-700 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                 {user?.name?.charAt(0)}
               </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-1"
          >
            <p className="text-slate-500 font-medium tracking-tight text-sm">Welcome back, {user?.name.split(' ')[0]}</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Coverage Dashboard</h2>
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-lg mx-auto px-6 -mt-8 relative z-20 space-y-6">
        
        {/* Status Quick-Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
               <MapPin className="w-5 h-5 text-slate-400" />
             </div>
             <div>
               <p className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider mb-0.5">Primary Zone</p>
               <p className="font-bold text-sm tracking-tight text-slate-900">{user?.primary_zone}</p>
             </div>
           </div>
           <div className="h-8 w-px bg-slate-100" />
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
               <Activity className="w-5 h-5 text-emerald-500" />
             </div>
             <div>
               <p className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider mb-0.5">Zone Risk</p>
               <p className="font-bold text-sm tracking-tight text-emerald-600">Stable</p>
             </div>
           </div>
        </div>

        {/* Payout Announcement - Only if payouts exist */}
        <AnimatePresence>
          {payouts.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-900 text-sm tracking-wide">Automatic Payout Success</h3>
                </div>
                <p className="text-slate-600 font-medium text-sm leading-relaxed mb-5">
                  Disruption detected in {user?.primary_zone}. ₹{payouts[0].amount} has been successfully routed to your UPI.
                </p>
                <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Transaction ID</p>
                    <p className="font-mono text-slate-700 text-xs font-semibold uppercase">#{payouts[0].id.toString().padStart(6, '0')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-slate-900">₹{payouts[0].amount}</p>
                    <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest mt-0.5">Confirmed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Coverage Logic */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-widest">Coverage Status</h3>
             <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold uppercase tracking-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Satellite Sync Live
             </div>
          </div>

          {policies.length > 0 ? (
            /* Active Policy High-Fidelity Card */
            <motion.div 
               whileHover={{ y: -2 }}
               className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
               
               <div className="flex justify-between items-start mb-8">
                 <div>
                   <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[10px] font-semibold uppercase tracking-widest mb-4">
                      <CheckCircle2 className="w-3" /> Fully Protected
                   </div>
                   <h4 className="text-4xl font-bold tracking-tight text-slate-900 mb-1">₹2,500</h4>
                   <p className="text-slate-500 font-medium text-sm">Disruption limit active</p>
                 </div>
                 <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-slate-600" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                     <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Weekly Premium</p>
                     <p className="font-bold text-slate-900 tracking-tight text-lg">₹{policies[0].weekly_premium}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                     <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Network Status</p>
                     <p className="font-bold text-emerald-600 tracking-tight text-lg">Online</p>
                  </div>
               </div>
               
               <button className="w-full mt-6 py-3.5 bg-white text-slate-600 font-semibold text-xs tracking-wider uppercase rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm">
                  View Certificate Details
               </button>
            </motion.div>
          ) : (
            /* Unprotected Call to Action */
            <motion.div 
               className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden"
            >
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                   <AlertCircle className="text-rose-500 w-6 h-6" />
                 </div>
                 <div>
                   <h4 className="font-bold text-lg text-slate-900 tracking-tight">Income at Risk</h4>
                   <p className="text-slate-500 text-sm font-medium">No active policy detected for {user?.primary_zone}.</p>
                 </div>
               </div>

               <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6">
                  <div className="flex justify-between items-baseline mb-4">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Personalized Quote</p>
                      <h5 className="text-4xl font-bold tracking-tight text-slate-900">₹{quote?.final_weekly_premium}</h5>
                    </div>
                    <span className="text-slate-500 font-medium text-lg tracking-tight">/week</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    {quote?.risk_factors.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {f}
                      </div>
                    ))}
                  </div>
               </div>

               <motion.button 
                 whileTap={{ scale: 0.98 }}
                 onClick={handlePurchase}
                 disabled={purchasing}
                 className="w-full py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2 text-base"
               >
                 {purchasing ? (
                   <><Loader2 className="w-5 h-5 animate-spin text-slate-300" /> Initializing...</>
                 ) : (
                   <>Activate Protection <ArrowRight className="w-4 h-4 text-slate-400" /></>
                 )}
               </motion.button>
            </motion.div>
          )}
        </section>

        {/* Live Weather Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center justify-between group overflow-hidden relative shadow-sm">
           <div className="absolute right-0 top-0 w-32 h-32 bg-white/40 rounded-full blur-2xl" />
           <div className="relative z-10">
              <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-widest mb-1.5">Local Risk Radar</p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                {weather ? weather.weather[0].main : "Clear Skies"}
              </h3>
              <p className="font-semibold text-xs text-blue-600/70 uppercase tracking-wide">Temperature: {weather ? Math.round(weather.main.temp) : "--"}°C</p>
           </div>
           <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-blue-100 flex items-center justify-center relative z-10">
               {weather?.weather[0].main === "Rain" ? (
                 <CloudRain className="w-8 h-8 text-blue-500" />
               ) : (
                 <CloudLightning className="w-8 h-8 text-amber-500" />
               )}
           </div>
        </div>

        {/* Simplified History Log */}
        <section className="pt-2 px-1">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-widest">Trigger History</h3>
             <button className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors border border-slate-200">
               Full Audit Log
             </button>
           </div>
           
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 divide-y divide-slate-100">
             {payouts.length > 0 ? (
               payouts.slice(0, 3).map((p, i) => (
                 <div key={i} className="flex items-center justify-between p-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                         <Zap className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 tracking-tight">{p.trigger_type}</p>
                        <p className="font-mono text-[9px] text-slate-400 mt-1 uppercase">Ref: {p.transaction_id ? p.transaction_id.substring(0,14) : '...'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-slate-900">₹{p.amount}</p>
                       <p className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full inline-block ${
                          p.payout_status === 'SETTLED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                       }`}>
                          {p.payout_status || 'PAID'}
                       </p>
                    </div>
                 </div>
               ))
             ) : (
               <div className="py-12 flex flex-col items-center justify-center">
                 <div className="p-3 bg-slate-50 rounded-full mb-3 border border-slate-100">
                   <History className="w-6 h-6 text-slate-400" />
                 </div>
                 <p className="text-sm font-medium text-slate-500 tracking-tight">Awaiting automated triggers...</p>
               </div>
             )}
           </div>
        </section>

      </div>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
        <div className="bg-white border border-slate-200 rounded-full p-2 shadow-lg flex items-center justify-between">
           {[
             { icon: <Navigation className="w-5 h-5" />, label: "Portal", active: true },
             { icon: <ShieldCheck className="w-5 h-5" />, label: "Policy", active: false },
             { icon: <History className="w-5 h-5" />, label: "History", active: false },
           ].map((item, i) => (
             <button 
                key={i}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${item.active ? 'bg-slate-900 text-white font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
             >
                {item.icon}
                {item.active && <span className="text-xs uppercase tracking-wider">{item.label}</span>}
             </button>
           ))}
        </div>
      </nav>
      
    </main>
  );
}
