"use client";

import { useState, useEffect } from "react";
import { 
  CloudLightning, MapPin, ShieldCheck, CheckCircle2, 
  CloudRain, AlertCircle, Loader2, ArrowRight, 
  Zap, History, Navigation, Bell, Activity, ChevronRight, Home, Globe, Volume2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSensorTelemetry } from "@/hooks/useSensorTelemetry";
import { useVoiceAccessibility } from "@/hooks/useVoiceAccessibility";
import { translations } from "@/utils/translations";
import EarningsShield from "@/components/EarningsShield";

export default function WorkerPortal() {
  const { lang, setLang, speak } = useVoiceAccessibility('en');
  const t = translations[lang] || translations.en;

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
        
        // VOICE: Check if new payouts added since last poll and speak them
        if (payoutData.length > payouts.length && payouts.length > 0) {
            const newPay = payoutData[0];
            const msg = `${t.status_payout}. ₹${newPay.amount} moved to bank. Reference ${newPay.transaction_id.substring(0,6)}.`;
            speak(msg);
        }
        
        setPayouts(payoutData);

        if (policyData.length === 0) {
          const qRes = await fetch("/api/policies/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ platform: userData.platform, primary_zone: userData.primary_zone })
          });
          setQuote(await qRes.json());
        }

        // Fetch local weather
        const wRes = await fetch(`/api/triggers/simulate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ zone: userData.primary_zone })
        });
        setWeather(await wRes.json());

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [payouts.length, t, speak]);

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
        speak(t.active_protection);
      }
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* Header & Hero */}
      <header className="bg-white pt-8 pb-16 px-6 rounded-b-[3rem] shadow-sm relative overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600 rounded-full blur-3xl -ml-20 -mb-20" />
        </div>

        <div className="max-w-lg mx-auto relative z-20 mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <a href="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" /> Home
            </a>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-600 font-semibold italic">Partner Portal</span>
          </nav>

          {/* Language Toggle Hub */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
             {(['en', 'hi', 'ta'] as const).map(l => (
               <button 
                 key={l}
                 onClick={() => setLang(l)}
                 className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${lang === l ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}
               >
                 {l === 'en' ? 'EN' : (l === 'hi' ? 'हिंदी' : 'த')}
               </button>
             ))}
          </div>
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

          <div className="mb-8">
            <EarningsShield lang={lang} />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-1"
          >
            <p className="text-slate-500 font-medium tracking-tight text-sm">{t.welcome}, {user?.name.split(' ')[0]}</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{t.dashboard}</h2>
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-lg mx-auto px-6 -mt-8 relative z-20 space-y-6">
        
        {/* Status Quick-Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-500" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t.mobility_live}</p>
                <div className="flex items-center gap-1.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${isCapturing ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                   <p className="text-xs font-bold text-slate-700">{isCapturing ? 'Live Feed' : 'Standby'}</p>
                </div>
             </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Zone Status</p>
              <div className="flex items-center gap-1.5 justify-end">
                <p className="text-xs font-bold text-slate-900">Protected</p>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              </div>
           </div>
        </div>

        {/* Protection Status Card */}
        {policies.length > 0 ? (
          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
             {/* Card Accents */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                     <span className="text-[10px] font-bold uppercase tracking-widest">{t.active_protection}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-blue-100 text-xs font-medium mb-1">{t.payout_guarantee}</p>
                  <h3 className="text-4xl font-black tracking-tight">₹{policies[0].coverage_amount}</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest mb-1">Target Zone</p>
                      <p className="font-bold text-sm tracking-tight">{policies[0].primary_zone}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-blue-200 tracking-widest mb-1">Status</p>
                      <p className="font-bold text-sm bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-lg inline-block">Active</p>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-10 text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CloudRain className="w-8 h-8 text-slate-300" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">{t.no_shield}</h3>
             <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">Stay protected against weather disruptions and lockdowns.</p>
             
             {quote && (
                <button 
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  {purchasing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                  {t.activate_shield} (₹{quote.premium_amount})
                </button>
             )}
          </div>
        )}

        {/* Section: Live Weather & History */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
             <h4 className="font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" /> {t.history}
             </h4>
             <button className="text-[10px] font-bold uppercase tracking-widest text-blue-600">All Logs</button>
           </div>
           
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 divide-y divide-slate-100">
              {payouts.length > 0 ? (
                payouts.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 px-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center relative">
                          <Zap className="w-5 h-5 text-blue-500" />
                          <div className="absolute -top-1 -right-1">
                             <Volume2 
                               onClick={() => speak(`${p.trigger_type}. ₹${p.amount} ${t.status_payout}`)}
                               className="w-3 h-3 text-slate-400 cursor-pointer hover:text-blue-500" 
                             />
                          </div>
                       </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 tracking-tight">{p.trigger_type}</p>
                        <p className="font-mono text-[9px] text-slate-400 mt-1 uppercase">ID: {p.transaction_id ? p.transaction_id.substring(0,10) : '...'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-slate-900">₹{p.amount}</p>
                       <span className={`text-[9px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full inline-block ${
                          p.payout_status === 'SETTLED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                       }`}>
                          {p.payout_status === 'SETTLED' ? t.status_payout.split(' ')[0] : (p.payout_status === 'FRAUD_FLAGGED' ? 'Flagged' : 'Processing')}
                       </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center">
                  <div className="p-3 bg-slate-50 rounded-full mb-3 border border-slate-100">
                    <History className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 tracking-tight">Listening for live updates...</p>
                </div>
              )}
           </div>
        </div>

        {/* Support Access */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white flex items-center justify-between shadow-lg">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                 <Bell className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                 <p className="font-bold leading-tight">{t.emergency}</p>
                 <p className="text-[10px] text-slate-400 font-medium">SOS Help Center</p>
              </div>
           </div>
           <ArrowRight className="w-5 h-5 text-slate-600" />
        </div>

      </div>

      {/* Bottom Floating Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-2xl z-50 px-8 py-4 flex items-center justify-between max-w-md mx-auto">
         <button className="flex flex-col items-center gap-1 text-blue-600">
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Main</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400">
            <MapPin className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Zones</span>
         </button>
         <div className="relative -top-10">
            <button className="w-14 h-14 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/40 flex items-center justify-center text-white border-4 border-slate-50">
               <Zap className="w-6 h-6 fill-current" />
            </button>
         </div>
         <button className="flex flex-col items-center gap-1 text-slate-400">
            <History className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Shields</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-400">
            <Activity className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Support</span>
         </button>
      </nav>
    </main>
  );
}
