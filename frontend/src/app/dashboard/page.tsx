"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Zap, CloudRain, Wind, AlertCircle, History, 
  Terminal, Activity, ShieldAlert, Cpu, Globe, 
  BarChart3, Settings, Play, RefreshCw, Layers, Loader2, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Dashboard() {
  const [adminStats, setAdminStats] = useState<any>(null);
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [simulationParams, setSimulationParams] = useState({
    trigger_type: "Flood",
    severity: "High",
    zone: "Mumbai"
  });
  const [result, setResult] = useState<any>(null);
  const lastAlertId = useRef<number | string>(0);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setAdminStats(data);

      // Handle Live Notifications Toasts
      if (data.notifications && data.notifications.length > 0) {
        const latest = data.notifications[0];
        if (latest.id !== lastAlertId.current) {
          lastAlertId.current = latest.id;
          if (latest.type === "PAYOUT_ISSUED") {
            toast.success(latest.title, {
              description: latest.message,
              duration: 5000,
            });
          } else {
            toast.info(latest.title, {
              description: latest.message,
            });
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      const res = await fetch("/api/payouts/");
      const data = await res.json();
      setPayoutHistory(data);
    } catch (err) {
      console.error("Failed to fetch payout history", err);
    }
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    setResult(null);
    toast.loading("Initiating Global Parametric Cross-Check...", { id: "sim-loading" });
    
    try {
      const res = await fetch("/api/triggers/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simulationParams),
      });
      const data = await res.json();
      setResult(data);
      toast.dismiss("sim-loading");
      
      if (data.status === "disrupted") {
        toast.error(`ALERT: ${simulationParams.trigger_type} Cluster Detected`, {
          description: `IMD confirmed. ${data.payouts?.length || 0} automated payouts dispatched.`,
          duration: 6000
        });
      } else {
        toast.info("Simulation Complete", {
          description: "No thresholds breached in the target zone."
        });
      }
      
      fetchPayoutHistory(); 
      fetchAdminStats();
    } catch (err) {
      toast.dismiss("sim-loading");
      toast.error("System Error", { description: "Failed to connect to simulation core." });
      console.error(err);
    }
    setIsSimulating(false);
  };

  useEffect(() => {
    fetchPayoutHistory();
    fetchAdminStats();
    const interval = setInterval(fetchAdminStats, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-brand-slate text-white selection:bg-brand-yellow selection:text-brand-dark p-6 sm:p-10 font-sans">
      
      {/* HUD Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 relative">
         <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-brand-yellow/5 rounded-full blur-[120px] pointer-events-none" />
         
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-brand-yellow rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.2)]">
                  <Terminal className="w-6 h-6 text-brand-dark" />
               </div>
               <h1 className="text-sm font-black uppercase tracking-[0.4em] text-brand-yellow">Emergency Command Center v3</h1>
            </div>
            <h2 className="text-4xl font-black tracking-tighter leading-tight italic">AI Parametric System Dashboard</h2>
         </div>

         <div className="flex items-center gap-4 relative z-10">
            <div className="hidden sm:flex flex-col items-end">
               <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Telemetry Status</p>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-400">AUTHORITATIVE</span>
                  <div className="flex gap-1">
                     {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-3 h-1.5 bg-blue-500 rounded-sm" />)}
                  </div>
               </div>
            </div>
            <div className="h-10 w-px bg-white/10 hidden sm:block" />
            
            <div className="relative">
               <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95 relative"
               >
                  <Bell className="w-5 h-5 text-slate-400" />
                  {adminStats?.notifications?.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-yellow rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                  )}
               </button>

               <AnimatePresence>
                 {showNotifications && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute right-0 mt-4 w-80 bg-brand-slate/90 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl p-6 z-[100]"
                   >
                     <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 mb-4 px-1">Recent Alerts</h4>
                     <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        {adminStats?.notifications?.map((n: any) => (
                          <div key={n.id} className="group relative pr-8">
                             <div className="flex items-start gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full ${n.type === 'PAYOUT_ISSUED' ? 'bg-brand-yellow' : 'bg-blue-500'}`} />
                                <div>
                                   <p className="font-black text-xs uppercase tracking-tight">{n.title}</p>
                                   <p className="text-[10px] text-slate-400 font-bold leading-tight">{n.message}</p>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            <button 
               onClick={() => { fetchPayoutHistory(); fetchAdminStats(); }}
               className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
               <RefreshCw className="w-5 h-5 text-slate-400" />
            </button>
         </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Simulator & Stats Panel */}
        <div className="lg:col-span-5 space-y-8">
           
           {/* Liquidity Tracker Card */}
           <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                 <ShieldAlert className="w-24 h-24" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                 <Globe className="w-5 h-5 text-green-400" />
                 <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Liquidity Pool Health</h3>
              </div>
              
              {adminStats ? (
                <div className="relative z-10">
                   <div className="flex justify-between items-end mb-2">
                      <p className="text-sm font-black text-slate-400 uppercase italic">Solvency Score</p>
                      <p className="text-3xl font-black text-white italic tracking-tighter">{adminStats.liquidity.health_score}%</p>
                   </div>
                   <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-8 border border-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${adminStats.liquidity.health_score}%` }}
                        className={`h-full ${adminStats.liquidity.health_score > 70 ? 'bg-green-500' : 'bg-brand-yellow'} shadow-[0_0_20px_rgba(34,197,94,0.3)]`}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Total Reserves</p>
                         <p className="font-black text-xl tracking-tighter italic text-slate-300">₹{(adminStats.liquidity.current_pool / 100000).toFixed(1)}L</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Total Payouts</p>
                         <p className="font-black text-xl tracking-tighter italic text-brand-yellow">₹{(adminStats.liquidity.total_payouts / 100000).toFixed(1)}L</p>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="animate-pulse h-32 bg-white/5 rounded-2xl" />
              )}
           </div>

           {/* Heatmap Overview SIM */}
           <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 overflow-hidden relative group">
              <div className="flex items-center gap-3 mb-6">
                 <Layers className="w-5 h-5 text-brand-yellow" />
                 <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 italic font-medium">Disruption Zones</h3>
              </div>
              
              <div className="space-y-4">
                 {adminStats?.heatmap && adminStats.heatmap.length > 0 ? (
                    adminStats.heatmap.slice(0, 4).map((zone: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-brand-yellow animate-ping" />
                            <p className="text-xs font-black uppercase text-slate-300">{zone.city}</p>
                         </div>
                         <div className="h-1 flex-grow mx-4 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-yellow/50" style={{ width: `${Math.min(zone.claims * 10, 100)}%` }} />
                         </div>
                         <p className="text-xs font-black text-slate-500">{zone.claims} Claims</p>
                      </div>
                    ))
                 ) : (
                    <div className="py-8 text-center opacity-20">
                       <p className="text-[10px] font-black uppercase tracking-widest">No Active Breaches</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-8">
                 <Settings className="w-5 h-5 text-brand-yellow" />
                 <h3 className="font-black uppercase text-xs tracking-widest text-slate-400">Simulation Configuration</h3>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-2 italic">Disruption Type</label>
                    <div className="grid grid-cols-3 gap-3">
                       {["Flood", "Cyclone", "Curfew"].map(type => (
                         <button 
                           key={type}
                           onClick={() => setSimulationParams(p => ({...p, trigger_type: type}))}
                           className={`py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${simulationParams.trigger_type === type ? 'bg-brand-yellow text-brand-dark border-brand-yellow' : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20'}`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-2 italic">Data Source Auth</label>
                    <div className="w-full bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-3">
                       <ShieldAlert className="w-5 h-5 text-blue-400" />
                       <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">IMD (MET-CORE) API SELECTED</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-2 italic">Target Geo-Zone</label>
                    <input 
                      type="text"
                      placeholder="e.g. Mumbai, Navi Mumbai..."
                      value={simulationParams.zone}
                      onChange={(e) => setSimulationParams(p => ({...p, zone: e.target.value}))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-black text-sm outline-none focus:border-brand-yellow transition-all placeholder:text-slate-600"
                    />
                 </div>

                 <motion.button 
                   whileTap={{ scale: 0.98 }}
                   onClick={handleSimulate}
                   disabled={isSimulating}
                   className="w-full py-5 bg-white text-brand-dark font-black rounded-2xl hover:bg-brand-yellow transition-all shadow-[0_20px_50px_rgba(255,255,255,0.05)] disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                 >
                    {isSimulating ? (
                      <><Loader2 className="w-6 h-6 animate-spin" /> CROSS-VERIFYING IMD...</>
                    ) : (
                      <><Play className="w-5 h-5 fill-current" /> EXECUTE TRIGGER</>
                    )}
                 </motion.button>
              </div>
           </div>
        </div>

        {/* Audit Log / Payout History */}
        <div className="lg:col-span-7 flex flex-col gap-8">
           
           {/* Simulation Result Overlay - Only if result exists */}
           <AnimatePresence>
             {result && (
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="bg-brand-yellow rounded-[32px] p-8 border border-brand-yellow shadow-2xl shadow-brand-yellow/20 relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <ShieldAlert className="w-32 h-32 text-brand-dark" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-black text-brand-dark uppercase text-xs tracking-[0.3em] mb-4">Simulation Result</h4>
                    <p className="text-brand-dark font-black text-3xl italic tracking-tight mb-8">
                      {result.message}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-brand-dark/10 backdrop-blur-md rounded-2xl p-5 border border-brand-dark/10">
                          <p className="text-[10px] font-black text-brand-dark/50 uppercase tracking-widest mb-1 italic">Total Claims Issued</p>
                          <p className="text-3xl font-black text-brand-dark tracking-tighter italic">{result.payouts?.length || 0}</p>
                       </div>
                       <div className="bg-brand-dark/10 backdrop-blur-md rounded-2xl p-5 border border-brand-dark/10">
                          <p className="text-[10px] font-black text-brand-dark/50 uppercase tracking-widest mb-1 italic">Data Integrity</p>
                          <p className="text-3xl font-black text-brand-dark tracking-tighter italic uppercase">Authenticated</p>
                       </div>
                    </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="flex-grow bg-white/5 border border-white/10 rounded-[40px] p-8 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-brand-yellow" />
                    <h3 className="font-black uppercase text-xs tracking-widest text-slate-400 italic">Parametric Audit Log</h3>
                 </div>
                 <div className="flex gap-2">
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400">SHRAM-v3.0 (MODERN)</div>
                 </div>
              </div>

              <div className="flex-grow space-y-4">
                 {payoutHistory.length > 0 ? (
                   payoutHistory.slice().reverse().map((p, i) => (
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={p.id}
                        className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:bg-white/10 transition-all hover:border-brand-yellow/30"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-black text-brand-yellow text-xs shadow-inner uppercase tracking-widest">
                               {p.trigger_type?.slice(0, 3)}
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 italic">{p.user_name || 'Worker'}</p>
                               <p className="font-black text-lg tracking-tighter uppercase leading-none">{p.trigger_type}</p>
                            </div>
                         </div>

                         <div className="hidden sm:block text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 italic">Recipient ID</p>
                            <p className="font-bold text-sm tracking-widest opacity-60 uppercase">UPI: {p.user_upi || 'Real UPI Active'}</p>
                         </div>

                         <div className="text-right">
                            <p className="text-xl font-black text-brand-yellow tracking-tighter italic">₹{p.amount}</p>
                            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-none mt-1">SENT VIA RAZORPAY</p>
                         </div>
                      </motion.div>
                   ))
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center py-20">
                      <BarChart3 className="w-20 h-20 mb-4 opacity-10" />
                      <p className="font-black uppercase tracking-[0.3em] text-xs opacity-20">No Payout Telemetry</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      <Loader />
    </main>
  );
}

function Loader() {
  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-end gap-2 pointer-events-none">
       <div className="flex gap-1">
          {[1, 2, 3].map(i => <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }} className="w-1.5 h-1.5 bg-brand-yellow rounded-full shadow-[0_0_8px_rgba(250,204,21,0.5)]" />)}
       </div>
       <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">Live Global Monitoring</p>
    </div>
  );
}
