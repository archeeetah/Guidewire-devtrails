"use client";

import { useState, useEffect } from "react";
import { 
  CloudLightning, MapPin, ShieldCheck, CheckCircle2, 
  CloudRain, AlertCircle, Loader2, ArrowRight, 
  Zap, History, Navigation, Bell, ChevronRight, Activity 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkerPortal() {
  const [user, setUser] = useState<any>(null);
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-brand-yellow/20 border-t-brand-yellow rounded-full animate-spin" />
        <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-yellow w-6 h-6" />
      </div>
      <p className="text-brand-slate font-black uppercase text-xs tracking-widest animate-pulse">Syncing Telemetry...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-brand-slate selection:bg-brand-yellow selection:text-brand-dark pb-32">
      
      {/* Dynamic Immersive Header */}
      <header className="relative bg-brand-slate text-white pt-16 pb-20 px-6 overflow-hidden rounded-b-[40px] shadow-2xl shadow-brand-slate/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                <ShieldCheck className="text-black w-7 h-7" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tighter uppercase leading-none">ShramShield</h1>
                <span className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.2em]">Partner Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors relative">
                 <Bell className="w-5 h-5 text-slate-400" />
                 <div className="absolute top-2 right-2 w-2 h-2 bg-brand-yellow rounded-full border-2 border-brand-slate" />
               </button>
               <div className="w-10 h-10 bg-gradient-to-br from-brand-yellow to-brand-yellow/80 text-brand-dark rounded-xl flex items-center justify-center font-black shadow-lg">
                 {user?.name?.charAt(0)}
               </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-1"
          >
            <p className="text-slate-400 font-medium tracking-tight">Ram ram, {user?.name.split(' ')[0]} 👋</p>
            <div className="flex items-baseline gap-2">
               <h2 className="text-4xl font-black tracking-tighter">Your Dashboard</h2>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-lg mx-auto px-6 -mt-10 relative z-20 space-y-6">
        
        {/* Status Quick-Bar */}
        <div className="bg-white rounded-3xl p-4 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
               <MapPin className="w-5 h-5 text-brand-yellow" />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Primary Zone</p>
               <p className="font-bold text-sm tracking-tight">{user?.primary_zone}</p>
             </div>
           </div>
           <div className="h-8 w-px bg-slate-100" />
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
               <Activity className="w-5 h-5 text-blue-500" />
             </div>
             <div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Zone Risk</p>
               <p className="font-bold text-sm tracking-tight text-blue-600">Stable</p>
             </div>
           </div>
        </div>

        {/* Payout Announcement - Only if payouts exist */}
        <AnimatePresence>
          {payouts.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-brand-yellow rounded-[32px] p-6 border border-brand-yellow shadow-xl shadow-brand-yellow/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-24 h-24 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-brand-slate rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-brand-yellow" />
                  </div>
                  <h3 className="font-black text-brand-slate uppercase text-sm tracking-widest">Automatic Payout Success</h3>
                </div>
                <p className="text-brand-slate font-bold text-lg leading-tight mb-4 tracking-tight">
                  Disruption detected in {user?.primary_zone}. ₹{payouts[0].amount} has been sent to your UPI.
                </p>
                <div className="flex justify-between items-center bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div>
                    <p className="text-[10px] font-black text-brand-slate/50 uppercase tracking-widest leading-none mb-1">Transaction ID</p>
                    <p className="font-black text-brand-slate text-xs uppercase tracking-tighter">#{payouts[0].id.toString().padStart(6, '0')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl text-brand-slate leading-none">₹{payouts[0].amount}</p>
                    <p className="text-[10px] font-black text-brand-slate/50 uppercase tracking-widest mt-1">Confirmed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Coverage Logic */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em]">Live Protection</h3>
             <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               Satellite Sync Live
             </div>
          </div>

          {policies.length > 0 ? (
            /* Active Policy High-Fidelity Card */
            <motion.div 
               whileHover={{ y: -5 }}
               className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-green-500/10 transition-colors" />
               
               <div className="flex justify-between items-start mb-10">
                 <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                      <CheckCircle2 className="w-3 h-3" /> Fully Protected
                   </div>
                   <h4 className="text-5xl font-black tracking-tighter text-brand-slate mb-1">₹2,500</h4>
                   <p className="text-slate-400 font-bold text-sm">Disruption coverage active</p>
                 </div>
                 <div className="w-16 h-16 rounded-[24px] bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Premium</p>
                     <p className="font-black text-brand-slate tracking-tight text-lg">₹{policies[0].weekly_premium}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                     <p className="font-black text-emerald-600 tracking-tight text-lg">Verified</p>
                  </div>
               </div>
               
               <button className="w-full mt-6 py-4 bg-slate-50 text-slate-400 font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-colors border border-dashed border-slate-200">
                  View Certificate Info
               </button>
            </motion.div>
          ) : (
            /* Unprotected High-Fidelity Call to Action */
            <motion.div 
               className="bg-brand-yellow/10 rounded-[40px] p-8 border-2 border-dashed border-brand-yellow relative overflow-hidden"
            >
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-brand-yellow flex items-center justify-center shadow-lg shadow-brand-yellow/20">
                   <AlertCircle className="text-black w-7 h-7" />
                 </div>
                 <div>
                   <h4 className="font-black text-xl text-brand-slate tracking-tight">Income at Risk</h4>
                   <p className="text-slate-500 text-sm font-bold tracking-tight">No active policy detected for {user?.primary_zone}.</p>
                 </div>
               </div>

               <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-brand-yellow/5 border border-slate-100 mb-8">
                  <div className="flex justify-between items-baseline mb-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Exclusive Partner Quote</p>
                      <h5 className="text-5xl font-black tracking-tighter text-brand-slate">₹{quote?.final_weekly_premium}</h5>
                    </div>
                    <span className="text-slate-400 font-black text-lg tracking-tighter">/week</span>
                  </div>
                  
                  <div className="space-y-2 mb-2">
                    {quote?.risk_factors.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-tight">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow shadow-[0_0_8px_rgba(250,204,21,1)]" />
                        {f}
                      </div>
                    ))}
                  </div>
               </div>

               <motion.button 
                 whileTap={{ scale: 0.95 }}
                 onClick={handlePurchase}
                 disabled={purchasing}
                 className="w-full py-5 bg-brand-slate text-white font-black rounded-3xl hover:bg-black transition-all shadow-xl shadow-brand-slate/40 flex items-center justify-center gap-3 text-lg leading-none"
               >
                 {purchasing ? (
                   <><Loader2 className="w-6 h-6 animate-spin text-brand-yellow" /> Connecting UPI...</>
                 ) : (
                   <>Activate Protection <ArrowRight className="w-6 h-6 text-brand-yellow" /></>
                 )}
               </motion.button>
            </motion.div>
          )}
        </section>

        {/* Live Weather Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-[32px] p-6 flex items-center justify-between group overflow-hidden relative">
           <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
           <div className="relative z-10">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Local Risk Radar</p>
              <h3 className="text-2xl font-black text-brand-slate tracking-tight">
                {weather ? weather.weather[0].main : "Clear Skies"}
              </h3>
              <p className="font-bold text-sm text-blue-600/60 uppercase tracking-tighter">Current Temp: {weather ? Math.round(weather.main.temp) : "--"}°C</p>
           </div>
           <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-500/10 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
               {weather?.weather[0].main === "Rain" ? (
                 <CloudRain className="w-10 h-10 text-blue-500" />
               ) : (
                 <CloudLightning className="w-10 h-10 text-yellow-500" />
               )}
           </div>
        </div>

        {/* Simplified History Log */}
        <section className="pt-2 px-2">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em]">Trigger History</h3>
             <button className="text-[10px] font-black uppercase tracking-widest text-brand-yellow bg-brand-slate px-3 py-1.5 rounded-full hover:bg-black transition-colors">
               Full Audit Log
             </button>
           </div>
           
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-4 divide-y divide-slate-50">
             {payouts.length > 0 ? (
               payouts.slice(0, 3).map((p, i) => (
                 <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center">
                         <Zap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-black text-sm text-brand-slate uppercase tracking-tighter">{p.trigger_type}</p>
                        <p className="text-[10px] font-bold text-slate-400 leading-none">Detected via Satellite</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-brand-slate">₹{p.amount}</p>
                       <p className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none">Paid Out</p>
                    </div>
                 </div>
               ))
             ) : (
               <div className="py-12 flex flex-col items-center justify-center opacity-30 italic">
                 <History className="w-12 h-12 mb-3 text-slate-300" />
                 <p className="text-sm font-bold text-slate-400 tracking-tight">Waiting for first trigger...</p>
               </div>
             )}
           </div>
        </section>

      </div>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-[100]">
        <div className="bg-brand-slate/90 backdrop-blur-2xl border border-white/10 rounded-full p-2 px-3 shadow-2xl flex items-center justify-between">
           {[
             { icon: <Navigation className="w-5 h-5" />, label: "Portal", active: true },
             { icon: <ShieldCheck className="w-5 h-5" />, label: "Policy", active: false },
             { icon: <History className="w-5 h-5" />, label: "History", active: false },
           ].map((item, i) => (
             <button 
                key={i}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${item.active ? 'bg-brand-yellow text-brand-dark font-black' : 'text-slate-400 hover:text-white'}`}
             >
                {item.icon}
                {item.active && <span className="text-xs uppercase tracking-widest leading-none">{item.label}</span>}
             </button>
           ))}
        </div>
      </nav>
      
    </main>
  );
}
