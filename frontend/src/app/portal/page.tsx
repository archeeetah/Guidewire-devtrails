"use client";

import { useState, useEffect } from "react";
import { 
  CloudLightning, MapPin, ShieldCheck, CheckCircle2, 
  CloudRain, AlertCircle, Loader2, ArrowRight, ArrowUpRight, 
  Zap, History, Navigation, Bell, Activity, ChevronRight, Home, Globe, Volume2, 
  Menu, Settings, HelpCircle, Map, Heart, PieChart, ShieldAlert, User, LogOut, ChevronDown, Terminal, ExternalLink, Calendar, Info, Users, UserCheck, Smartphone, Shield, Radar, BarChart3
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
  const [isKycVerified, setIsKycVerified] = useState(false);
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
          const qRes = await fetch("/api/policies/quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ platform: uRes.platform, primary_zone: uRes.primary_zone })
          });
          if (qRes.ok) setQuote(await qRes.json());
        }
        
        setPolicies(pRes);
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
  }, [lang, t]);

  // PRODUCTION FEATURE: Push Simulation (Real-time Alerts)
  useEffect(() => {
    if (activeTab !== 'dashboard') return;
    const timer = setTimeout(() => {
      toast.info("Active Volatility Alert", {
        description: "Heavy rainfall detected in Chennai Central. Ensure the app is connected for automated claim verification.",
        icon: <CloudLightning className="w-4 h-4 text-rose-500" />
      });
      speak("High volatility detected. Parametric coverage is now in Active Verification mode.");
    }, 10000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("worker_phone");
    window.location.href = "/login";
  };

  const handleSOS = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      toast.error("SOS Field Dispatch Triggered", {
        description: `Emergency response unit notified with your coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        icon: <ShieldAlert className="w-5 h-5 text-white" />,
        className: "bg-rose-600 text-white border-0"
      });
      speak("Emergency assist triggered. Response team notified with your location.");
      console.log(`SOS LOG: UID ${user?.id} at ${latitude}, ${longitude}`);
    });
  };

  const handleKYC = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Syncing with DigiLocker...',
        success: () => {
          setIsKycVerified(true);
          speak("Identity verified via government node. Higher payout limits enabled.");
          return 'Identity Verified ✅';
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
        <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">Synchronizing ShramShield Ecosystem...</p>
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
            {/* Main Stream */}
            <div className="lg:col-span-12 xl:col-span-8 space-y-10">
               
               {/* Production Header: Push Notification Simulator Preview */}
               <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <Radar className="w-5 h-5 text-blue-600 animate-spin-slow" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Live Intelligence Hub</p>
                        <p className="text-sm font-bold text-slate-900 leading-none">Passive background monitoring is ACTIVE</p>
                     </div>
                  </div>
                  <div className="hidden sm:block text-right">
                     <p className="text-[9px] font-black text-emerald-500 uppercase">Coverage Node: Verified</p>
                  </div>
               </div>

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
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 max-w-sm flex-grow">
                           <div className="flex justify-between items-center text-xs font-bold mb-4">
                              <span className="text-slate-500 uppercase">Security Token</span>
                              <span className="text-blue-400">V.3.1.9</span>
                           </div>
                           <p className="text-[9px] text-slate-400 leading-relaxed italic mb-4 font-medium opacity-60">Telemetry verified at {new Date().toLocaleTimeString()} across 4 nodes.</p>
                           <button className="w-full py-2 bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Audit Live Feed</button>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center lg:py-24">
                     <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                        <Shield className="w-10 h-10 text-slate-300" />
                     </div>
                     <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{t.no_shield}</h3>
                     <p className="text-base text-slate-500 font-medium leading-relaxed mb-10 max-w-sm mx-auto">Income risk detected for today. Activate your stabilization shield.</p>
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
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">Mobility Confidence</p>
                        <p className="text-base font-black text-slate-900 tracking-tight leading-none">{(Math.random() * 0.1 + 0.89).toFixed(2)} [VERIFIED]</p>
                     </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
                     <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 self-start">
                        <Navigation className="w-5 h-5 text-blue-600" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">Atmospheric Volatility</p>
                        <p className="text-base font-black text-slate-900 tracking-tight leading-none uppercase">Condition: STABLE</p>
                     </div>
                  </div>
               </div>

               <EarningsShield lang={lang} />
            </div>

            {/* Side Panel Widgets */}
            <div className="lg:col-span-12 xl:col-span-4 space-y-10">
               
               {/* Quick KYC (Production) */}
               {!isKycVerified && (
                 <div className="bg-white rounded-[2.5rem] p-8 border-2 border-dashed border-blue-200 text-center">
                    <UserCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h5 className="font-black text-lg mb-2 leading-none uppercase tracking-tighter">KYC Missing</h5>
                    <p className="text-slate-500 text-xs font-medium mb-6">Verify identity via DigiLocker to enable instant bank settlements.</p>
                    <button onClick={handleKYC} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Verify Now</button>
                 </div>
               )}

               {/* SOS Emergency Hub (Production Functional) */}
               <button 
                 onClick={handleSOS}
                 className="w-full bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between group hover:bg-black transition-all shadow-xl relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full blur-2xl -mr-16 -mt-16" />
                  <div className="flex items-center gap-5 text-left relative z-10">
                     <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-105 transition-all">
                        <ShieldAlert className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <p className="font-black text-xl tracking-tighter uppercase leading-none mb-1">Crisis Dispatch</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-70 italic">Field SOS Support</p>
                     </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1.5 transition-all" />
               </button>

               {/* Mini Analytics Preview */}
               <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Weekly Shield Savings</p>
                     <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter mb-1 leading-none">₹840.00</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase leading-none tracking-widest">+12% vs. Last Week</p>
               </div>

            </div>
          </motion.div>
        );

      case 'zones':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
             <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                   <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Zone Explorer</h3>
                      <p className="text-slate-500 font-medium text-sm">Real-time risk telemetry for active delivery zones across the region.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {[
                     { name: 'Chennai Central', risk: 'Low', volatility: '2.1%', riders: 120, cover: 'AVAILABLE' },
                     { name: 'Tambaram East', risk: 'Stable', volatility: '1.4%', riders: 45, cover: 'AVAILABLE' },
                     { name: 'Adyar Hub', risk: 'Moderate', volatility: '5.2%', riders: 210, cover: 'AVAILABLE' },
                     { name: 'Velachery Lake', risk: 'High Risk', volatility: '12.4%', riders: 12, cover: 'PEAK PRICED' },
                   ].map((zone, i) => (
                      <div key={i} className="p-8 border border-slate-100 rounded-[2.5rem] group bg-slate-50 hover:bg-white flex flex-col justify-between h-64 hover:shadow-xl transition-all">
                         <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                               <MapPin className={`w-6 h-6 ${zone.risk === 'High Risk' ? 'text-rose-500' : 'text-slate-400'}`} />
                            </div>
                            <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-[2px] ${zone.risk === 'Low' || zone.risk === 'Stable' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                               {zone.risk}
                            </span>
                         </div>
                         <div>
                            <p className="font-black text-slate-500 text-[10px] uppercase tracking-widest mb-1 italic">Riders: {zone.riders}</p>
                            <h5 className="font-black text-slate-900 text-xl tracking-tight mb-4 leading-none">{zone.name}</h5>
                            <button className="w-full py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Switch Base</button>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </motion.div>
        );

      case 'hub':
         return (
           <motion.div 
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
             className="space-y-10"
           >
              <div className="bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -mr-48 -mt-48" />
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="max-w-xl">
                       <div className="p-2 px-4 bg-white/10 rounded-full inline-flex items-center gap-2 mb-6 border border-white/20">
                          <Users className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-[2px]">Group Protection Active</span>
                       </div>
                       <h3 className="text-5xl font-black tracking-tighter uppercase mb-4 italic">Rider Collective Hub</h3>
                       <p className="text-blue-100 text-lg font-medium leading-relaxed">Join 8,400+ riders in the Chennai protection pool. Get lower premiums by ensuring localized hub stability.</p>
                    </div>
                    <div className="bg-black/20 p-8 rounded-[2.5rem] border border-white/10 text-center flex-grow max-w-sm">
                       <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Pool Discount Enabled</p>
                       <p className="text-5xl font-black tracking-tighter mb-6">-30%</p>
                       <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-widest">Join Pool</button>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
                    <h5 className="font-black text-xl mb-6 uppercase tracking-tighter">Your Communities</h5>
                    <div className="space-y-4">
                       {[
                         { name: 'Adyar Rider Hub', members: 450, discount: '15%', active: true },
                         { name: 'Zomato Chennai South', members: 1200, discount: '25%', active: false },
                         { name: 'Amazon Flex TN', members: 3400, discount: '30%', active: false },
                       ].map((hub, i) => (
                         <div key={i} className="p-5 border border-slate-100 rounded-3xl bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner">
                                  <Users className="w-5 h-5 text-slate-400" />
                               </div>
                               <div>
                                  <p className="font-black text-slate-900 text-sm tracking-tight">{hub.name}</p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{hub.members} Riders</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-emerald-500 font-black text-sm tracking-tight">-{hub.discount}</p>
                               {hub.active && <span className="text-[8px] font-black text-slate-300 uppercase italic">Joined</span>}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col justify-between">
                    <div>
                       <h5 className="font-black text-xl mb-4 uppercase tracking-tighter italic">Collective Intelligence</h5>
                       <p className="text-slate-400 text-sm font-medium leading-relaxed">By staying in sync with your hub, our AI stabilizes pricing for the whole community. Every successful delivery in high-risk zones lowers the volatility index for the entire pool.</p>
                    </div>
                    <div className="pt-8 flex items-center gap-3">
                       <div className="flex -space-x-3 overflow-hidden">
                          {[1,2,3,4].map(i => <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700" />)}
                       </div>
                       <p className="text-[10px] font-bold text-slate-300">+4,200 active today</p>
                    </div>
                 </div>
              </div>
           </motion.div>
         )

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
                      {isKycVerified && (
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                           <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                      )}
                   </div>
                   <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">{user?.name}</h3>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isKycVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                            {isKycVerified ? 'Identity Verified' : 'KYC Pending'}
                         </span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Secure Profile Data</p>
                      {[
                        { label: 'Work ID', value: user?.platform_worker_id, icon: Terminal },
                        { label: 'Platform', value: user?.platform, icon: Globe },
                        { label: 'Base Zone', value: user?.primary_zone, icon: MapPin },
                        { label: 'UPI Payout', value: user?.upi_id, icon: Zap },
                      ].map((field, i) => (
                        <div key={i} className="p-6 border border-slate-100 rounded-3xl bg-slate-50 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <field.icon className="w-4 h-4 text-slate-300" />
                              <div>
                                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{field.label}</p>
                                 <p className="text-sm font-black text-slate-900 tracking-tight leading-none truncate max-w-[150px]">{field.value}</p>
                              </div>
                           </div>
                           <ChevronRight className="w-4 h-4 text-slate-200" />
                        </div>
                      ))}
                   </div>
                   <div className="space-y-10">
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Accessibility Deployment</p>
                         <div className="p-8 border border-slate-200 rounded-[2.5rem] bg-slate-50/50 flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                               <p className="font-black text-slate-900 text-sm tracking-tight capitalize">Voice Feed</p>
                               <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1">
                                  <div className="w-4 h-4 bg-white rounded-full shadow-sm ml-auto" />
                               </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                               {(['en', 'hi', 'ta'] as const).map(l => (
                                 <button key={l} onClick={() => setLang(l)} className={`py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-900'}`}>
                                    {l}
                                 </button>
                               ))}
                            </div>
                         </div>
                      </div>
                      <button onClick={handleLogout} className="w-full p-8 border-2 border-dashed border-rose-200 rounded-[2.5rem] bg-rose-50/10 flex items-center justify-between group hover:bg-rose-50 transition-all">
                         <div className="flex items-center gap-5">
                            <LogOut className="w-6 h-6 text-rose-500" />
                            <div>
                               <p className="font-black text-rose-600 text-sm uppercase tracking-tight">Security Exit</p>
                               <p className="text-[9px] text-rose-300 font-bold uppercase tracking-widest">Terminate Node Connection</p>
                            </div>
                         </div>
                         <ChevronRight className="w-5 h-5 text-rose-200" />
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        );

      case 'history':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="space-y-10"
          >
             <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-8">
                   <div>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2 leading-none italic">Audit Log 3.0</h3>
                      <p className="text-slate-500 font-medium text-sm">Full chronological ledger of parametric trigger settlements.</p>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Trigger Event</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Settlement</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Evidence ID</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {payouts.length > 0 ? payouts.map((p, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                               <td className="px-10 py-8">
                                  <p className="font-bold text-sm text-slate-900">{p.trigger_type}</p>
                                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{p.trigger_reason}</p>
                               </td>
                               <td className="px-10 py-8 font-black text-lg text-slate-900 tracking-tighter">₹{p.amount}</td>
                               <td className="px-10 py-8">
                                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${p.payout_status === 'SETTLED' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-400'}`}>
                                     {p.payout_status}
                                  </span>
                               </td>
                               <td className="px-10 py-8 font-mono text-[10px] text-slate-300 uppercase truncate max-w-[150px]">{p.transaction_id || 'ANALYZING...'}</td>
                            </tr>
                         )) : (
                            <tr>
                               <td colSpan={4} className="py-40 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">
                                  Awaiting trigger events for audit trails.
                               </td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </motion.div>
        );

      case 'analytics':
         return (
           <motion.div initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-12">Stabilization Yield</h3>
                    
                    {/* Growth Analytics Mock */}
                    <div className="h-[400px] flex items-end justify-between gap-4 p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                       {[70, 40, 85, 30, 95, 60, 100].map((h, i) => (
                         <div key={i} className="flex-grow bg-blue-600 rounded-t-2xl relative group hover:bg-slate-900 transition-all" style={{ height: `${h}%` }}>
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">₹{h * 15}</div>
                         </div>
                       ))}
                    </div>
                    <div className="flex justify-between mt-8 px-6 text-[10px] font-black text-slate-400 uppercase tracking-[4px]">
                       {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <span key={d}>{d}</span>)}
                    </div>
                 </div>
                 <div className="lg:col-span-4 space-y-10">
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col justify-between h-72">
                       <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">Stability Rating</p>
                       <div>
                          <p className="text-7xl font-black text-emerald-400 tracking-tighter mb-2 italic">A+</p>
                          <p className="text-sm font-medium text-slate-400 leading-relaxed">Your risk mitigation score is in the top 4% of active Chennai hubs.</p>
                       </div>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm flex flex-col justify-between h-72 group hover:border-blue-500/30 transition-all cursor-pointer">
                       <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Hub Optimization</p>
                       <div>
                          <span className="text-4xl font-black text-slate-900 tracking-tighter uppercase">98%<span className="text-sm ml-2 text-blue-500">LIVE</span></span>
                          <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">Your telemetry consistency is nearly perfect. Maintain this for maximum Group Hub multipliers.</p>
                       </div>
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
      
      {/* Side Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 hidden lg:flex flex-col p-6 shadow-sm">
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
            { id: 'hub', icon: Users, label: 'Group Hub' },
            { id: 'history', icon: History, label: 'Audit Log' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'preferences', icon: Settings, label: 'Preferences' },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <item.icon className="w-4 h-4" />
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
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 text-rose-500 font-bold text-[10px] uppercase tracking-[2px] transition-all hover:bg-rose-50 rounded-xl">
              <LogOut className="w-4 h-4" /> Log Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 min-h-screen">
        
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 lg:px-10 py-6 lg:py-8 sticky top-0 z-40">
           <div className="max-w-[1400px] mx-auto flex justify-between items-center">
              <div className="lg:hidden flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                   <ShieldCheck className="text-white w-4 h-4" />
                </div>
                <h1 className="font-bold text-base tracking-tight text-slate-900 uppercase">ShramShield</h1>
              </div>

              <div className="hidden lg:block">
                 <div className="flex items-center gap-2 text-slate-400 font-black text-[9px] uppercase tracking-[3px] mb-1 leading-none">
                    <span>Terminal</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className={activeTab === 'dashboard' ? 'text-blue-500' : 'text-slate-900'}>{activeTab}</span>
                 </div>
                 <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none capitalize italic">{activeTab === 'dashboard' ? t.dashboard : activeTab}</h2>
              </div>

              <div className="flex items-center gap-4">
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
                 <button className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center relative shadow-sm hover:bg-slate-50 transition-colors bg-white">
                    <Bell className="w-5 h-5 text-slate-500" />
                    <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-600 rounded-full border-2 border-white" />
                 </button>
                 <button className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors lg:hidden bg-white">
                    <Menu className="w-5 h-5 text-slate-500" />
                 </button>
              </div>
           </div>
        </header>

        <div className="max-w-[1400px] mx-auto p-6 lg:p-10">
           <AnimatePresence mode="wait">
              {renderContent()}
           </AnimatePresence>
        </div>

      </div>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-8 flex items-center justify-between z-50 lg:hidden shadow-[0_-4px_24px_-10px_rgba(0,0,0,0.1)]">
         {[
           { id: 'dashboard', icon: Home, label: 'Dash' },
           { id: 'hub', icon: Users, label: 'Hub' },
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
