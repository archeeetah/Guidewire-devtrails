"use client";

import { useState, useEffect } from "react";
import { CloudLightning, MapPin, ShieldCheck, CheckCircle2, CloudRain, AlertCircle, Loader2 } from "lucide-react";

export default function WorkerPortal() {
  const [user, setUser] = useState<any>(null);
  const [policies, setPolicies] = useState<any[]>([]);
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [weatherLive, setWeatherLive] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const phone = localStorage.getItem("worker_phone");
      if (!phone) {
        window.location.href = "/login";
        return;
      }

      try {
        // Fetch User
        const userRes = await fetch(`http://localhost:8000/api/users/${phone}`);
        if (!userRes.ok) throw new Error("User not found");
        const userData = await userRes.json();
        setUser(userData);

        // Fetch Policies
        const polRes = await fetch(`http://localhost:8000/api/policies/worker/${phone}`);
        const polData = await polRes.json();
        setPolicies(polData);

        // Fetch Quote if no policy
        if (polData.length === 0) {
          const qRes = await fetch("http://localhost:8000/api/policies/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ platform: userData.platform, primary_zone: userData.primary_zone })
          });
          setQuote(await qRes.json());
        }

        // Fetch Live Weather explicitly for the UI Risk Radar
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userData.primary_zone}&appid=50ac3262efa601768ceef39ca51d7e47&units=metric`);
        if (weatherRes.ok) setWeatherLive(await weatherRes.json());

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
      await fetch("http://localhost:8000/api/policies/purchase", {
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
      // Refresh
      window.location.reload();
    } catch (e) {
      console.error(e);
      setPurchasing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-yellow" /></div>;

  return (
    <main className="min-h-screen bg-slate-100 flex justify-center pb-10">
      
      {/* Mobile Form Factor Container */}
      <div className="w-full max-w-md bg-white min-h-screen sm:shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Header App Bar */}
        <div className="bg-brand-slate text-white p-4 pt-8 sm:p-6 sm:pt-10 rounded-b-2xl sm:rounded-b-3xl inset-x-0 top-0 shadow-lg relative z-20">
           <div className="flex justify-between items-center mb-6">
              <h1 className="font-black text-2xl tracking-tight flex items-center gap-2"><ShieldCheck className="text-brand-yellow"/> ShramShield</h1>
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold">{user?.name?.charAt(0)}</div>
           </div>
           
           <p className="text-slate-400 font-bold mb-1">Hello, {user?.name}</p>
           <div className="flex items-center gap-2 text-sm font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
             <MapPin className="w-4 h-4 text-brand-yellow" /> {user?.primary_zone}
           </div>
        </div>

        <div className="flex-grow p-4 sm:p-6 space-y-4 sm:space-y-6 z-10 -mt-4 relative pt-10">

          {/* Dynamic Risk Radar */}
          <div className="bg-white rounded-2xl sm:rounded-[24px] border border-slate-100 shadow-sm p-4 sm:p-5 flex items-center justify-between">
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Live Risk Radar</p>
               <h3 className="font-black text-lg text-brand-slate">
                 {weatherLive ? weatherLive.weather[0].main : "Clear Skies"}
               </h3>
               <p className="font-bold text-sm text-slate-500">{weatherLive ? `${weatherLive.main.temp}°C` : "--"}</p>
             </div>
             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                 {weatherLive?.weather[0].main === "Rain" ? <CloudRain className="w-8 h-8 text-blue-500" /> : <CloudLightning className="w-8 h-8 text-yellow-500" />}
             </div>
          </div>

          {/* Policy Status */}
          {policies.length > 0 ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl sm:rounded-[32px] p-5 sm:p-6 shadow-sm">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <span className="bg-green-500 text-white text-xs font-black uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block">Active Protection</span>
                   <p className="font-black text-2xl text-green-950">₹2,500 <span className="text-sm font-bold text-green-700">Cover</span></p>
                 </div>
                 <CheckCircle2 className="w-8 h-8 text-green-500" />
               </div>
               
               <div className="space-y-3 bg-white/50 p-4 rounded-2xl">
                 <div className="flex justify-between text-sm font-bold text-green-900 border-b border-green-200/50 pb-2">
                   <span>Premium Paid</span>
                   <span>₹{policies[0].weekly_premium} / wk</span>
                 </div>
                 <div className="flex justify-between text-sm font-bold text-green-900 border-b border-green-200/50 pb-2">
                   <span>Parametric Auto-Claim</span>
                   <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4"/> Enabled</span>
                 </div>
               </div>
            </div>
          ) : (
            <div className="bg-brand-yellow/10 border-2 border-brand-yellow rounded-2xl sm:rounded-[32px] p-5 sm:p-6 shadow-sm">
               <div className="flex items-center gap-2 mb-4">
                 <AlertCircle className="text-brand-yellow w-6 h-6" />
                 <h2 className="font-black text-xl text-brand-slate">Unprotected Area</h2>
               </div>
               <p className="text-sm font-bold text-slate-500 mb-6 leading-relaxed">
                 You are currently at risk of income loss due to forced curfews or heavy rainfall in {user?.primary_zone}.
               </p>

               <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 mb-2">DYNAMIC WEEKLY QUOTE</p>
                  <p className="font-black text-4xl text-brand-slate mb-3">₹{quote?.final_weekly_premium} <span className="text-lg font-bold text-slate-400">/wk</span></p>
                  {quote?.risk_factors.map((f: string, i: number) => (
                    <p key={i} className="text-xs font-bold text-slate-500 flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" /> {f}
                    </p>
                  ))}
               </div>

               <button 
                 onClick={handlePurchase}
                 disabled={purchasing}
                 className="w-full py-4 bg-brand-slate text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-brand-slate/20 disabled:opacity-50 flex items-center justify-center gap-2"
               >
                 {purchasing ? "Processing UPI..." : "Activate Coverage via UPI"}
               </button>
            </div>
          )}

          {/* Telemetry Log */}
          <div className="pt-6">
             <h3 className="font-black text-brand-slate mb-4 px-2">Recent Triggers</h3>
             <div className="bg-white rounded-2xl border border-slate-100 p-4">
               <p className="text-sm font-bold text-slate-400 text-center py-6">No recent disruptions detected by satellites.</p>
             </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
