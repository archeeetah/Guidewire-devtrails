"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Zap, AlertCircle, Terminal, ShieldAlert, Globe, 
  BarChart3, Settings, Play, RefreshCw, Layers, Loader2, Bell, CheckCircle2, CloudRain,
  Cpu, History, Activity, ShieldCheck, Download, Filter, Search, UserX, FileText, ChevronRight, PieChart, TrendingUp, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [authError, setAuthError] = useState(false);
  const [activeView, setActiveView] = useState('overview'); // overview | fraud | reports

  useEffect(() => {
    if (localStorage.getItem("shramshield_admin") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === "shramadmin") { 
      localStorage.setItem("shramshield_admin", "true");
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setAdminPass("");
    }
  };

  const [adminStats, setAdminStats] = useState<any>(null);
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [simulationParams, setSimulationParams] = useState({
    trigger_type: "Flood",
    severity: "High",
    zone: "Chennai"
  });
  const [result, setResult] = useState<any>(null);
  const [scannerStatus, setScannerStatus] = useState<any>(null);
  const [scanLogs, setScanLogs] = useState<any[]>([]);
  const [isTogglingScanner, setIsTogglingScanner] = useState(false);
  const lastAlertId = useRef<number | string>(0);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setAdminStats(data);
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

  const handleExport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Generating Parametric Audit Report...',
        success: () => 'Report exported to secure-cloud successfully ✅',
      }
    );
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
      fetchPayoutHistory(); 
      fetchAdminStats();
    } catch (err) {
      toast.dismiss("sim-loading");
      toast.error("System Error", { description: "Failed to connect to simulation core." });
    }
    setIsSimulating(false);
  };

  useEffect(() => {
    fetchPayoutHistory();
    fetchAdminStats();
    const interval = setInterval(() => {
      fetchAdminStats();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200">
           <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl mb-10 mx-auto">
              <Lock className="text-white w-8 h-8" />
           </div>
           <h2 className="text-3xl font-black tracking-tighter text-slate-900 text-center mb-2 uppercase italic">Admin Portal</h2>
           <p className="text-slate-500 text-xs font-black uppercase tracking-widest text-center mb-10 italic">Core Governance Node v3.4</p>
           <form onSubmit={handleAdminLogin} className="space-y-6">
              <input 
                type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-4 focus:ring-blue-100 transition-all text-slate-900"
                placeholder="ACCESS TOKEN"
              />
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-xl uppercase tracking-widest text-xs italic">Verify Identity</button>
           </form>
        </motion.div>
      </main>
    );
  }

  const flaggedPayouts = payoutHistory.filter(p => (p.confidence_score || 1) < 0.6);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Sidebar (Admin Context) */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 z-50 hidden lg:flex flex-col p-8 shadow-2xl text-white">
         <div className="flex items-center gap-3 mb-16 px-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="font-black text-lg tracking-tighter uppercase leading-none">Command Center</h1>
         </div>

         <nav className="flex-grow space-y-3">
            {[
              { id: 'overview', icon: Layers, label: 'Ecosystem' },
              { id: 'fraud', icon: UserX, label: 'Fraud Desk', count: flaggedPayouts.length },
              { id: 'reports', icon: FileText, label: 'Analytics' },
            ].map(item => (
               <button 
                key={item.id} onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${activeView === item.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
               >
                 <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                 </div>
                 {item.count ? <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-[8px]">{item.count}</span> : null}
               </button>
            ))}
         </nav>

         <div className="pt-8 border-t border-white/10 space-y-6">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">System Pulse</p>
                <div className="flex items-center justify-between mb-1">
                   <p className="text-[10px] font-bold">Node-A14</p>
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-[78%]" />
                </div>
            </div>
            <button onClick={() => { localStorage.removeItem("shramshield_admin"); window.location.reload(); }} className="w-full py-4 text-center text-rose-400 font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500/10 rounded-xl transition-all">Clear Node Session</button>
         </div>
      </aside>

      {/* Main Viewport */}
      <div className="lg:pl-64 min-h-screen">
         
         <header className="bg-white border-b border-slate-200 px-10 py-8 flex justify-between items-center sticky top-0 z-40 bg-white/80 backdrop-blur-xl">
            <div>
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-[3px] mb-1 italic">ShramShield Governance</p>
               <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none uppercase italic">{activeView === 'overview' ? 'Parametric Pulse' : activeView}</h2>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={handleExport} className="hidden sm:flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-xl">
                  <Download className="w-4 h-4" /> Export Report
               </button>
               <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center relative hover:bg-slate-100 transition-all">
                  <Bell className="w-5 h-5 text-slate-500" />
                  <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
               </button>
            </div>
         </header>

         <div className="p-10 max-w-[1400px] mx-auto">
            <AnimatePresence mode="wait">
               {activeView === 'overview' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-10">
                     {/* Stats Wall */}
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                        {[
                          { label: 'Total Protected', value: adminStats?.liquidity?.total_users || '3.2k', sub: 'Active Workers', icon: Activity },
                          { label: 'Pool Reserves', value: `₹${((adminStats?.liquidity?.current_pool || 0)/100000).toFixed(1)}L`, sub: 'Real-time Liquidity', icon: Globe },
                          { label: 'Avg Confidence', value: '94.2%', sub: 'Telemetry Precision', icon: Zap },
                          { label: 'Auto Payouts', value: payoutHistory.length, sub: 'Trigger Events', icon: Layers },
                        ].map((stat, i) => (
                           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                              <div className="flex justify-between items-start mb-6">
                                 <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <stat.icon className="w-5 h-5" />
                                 </div>
                                 <TrendingUp className="w-4 h-4 text-emerald-500" />
                              </div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{stat.label}</p>
                              <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic">{stat.value}</h4>
                              <p className="text-[9px] text-slate-400 font-bold uppercase mt-2 tracking-tighter">{stat.sub}</p>
                           </div>
                        ))}
                     </div>

                     <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        {/* Simulation & Heatmap */}
                        <div className="xl:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 p-12 shadow-sm">
                           <div className="flex items-center justify-between mb-12">
                              <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Manual System Override</h3>
                              <div className="flex gap-2">
                                 {['Flood', 'Cyclone', 'Heat'].map(type => (
                                    <button 
                                      key={type} onClick={() => setSimulationParams(p => ({...p, trigger_type: type}))}
                                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${simulationParams.trigger_type === type ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}
                                    >
                                       {type}
                                    </button>
                                 ))}
                              </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div>
                                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4 italic">Specify Target Node (Zone)</label>
                                 <input 
                                   type="text" value={simulationParams.zone} onChange={(e) => setSimulationParams(p => ({...p, zone: e.target.value}))}
                                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black outline-none focus:ring-4 focus:ring-blue-50"
                                   placeholder="CHENNAI METRO"
                                 />
                              </div>
                              <div className="flex items-end">
                                 <button 
                                  onClick={handleSimulate} disabled={isSimulating}
                                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 italic"
                                 >
                                    {isSimulating ? <Loader2 className="animate-spin" /> : <Play className="fill-current w-3 h-3" />}
                                    Execute Trigger
                                 </button>
                              </div>
                           </div>
                        </div>

                        {/* Liquid Map */}
                        <div className="xl:col-span-4 bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                           <div className="relative z-10">
                               <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-8">Disruption Heat</h3>
                               <div className="space-y-6">
                                  {adminStats?.heatmap?.slice(0,3).map((z:any, i:number) => (
                                     <div key={i}>
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">
                                           <span>{z.city}</span>
                                           <span>{z.claims} Nodes Blocked</span>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                           <div className="h-full bg-blue-500" style={{ width: `${z.claims * 12}%` }} />
                                        </div>
                                     </div>
                                  ))}
                               </div>
                           </div>
                           <p className="text-[9px] text-slate-500 font-black uppercase mt-10 tracking-widest italic leading-relaxed relative z-10">Cross-referencing telemetry points with international weather nodes (IMD/ECMWF).</p>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeView === 'fraud' && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
                     <div className="bg-white rounded-[3rem] border border-slate-200 p-12 shadow-sm">
                        <div className="flex items-center gap-8 mb-12">
                           <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center text-rose-600 shadow-inner">
                              <ShieldAlert className="w-10 h-10" />
                           </div>
                           <div>
                              <h3 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-2">Fraud Analysis Desk</h3>
                              <p className="text-slate-500 text-sm font-medium">Flagged Parametric Payouts showing multi-node telemetry inconsistencies.</p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           {flaggedPayouts.length > 0 ? flaggedPayouts.map((p, i) => (
                              <div key={i} className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-white hover:border-rose-200 transition-all shadow-hover">
                                 <div className="flex items-center gap-8 text-left flex-grow">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                       <Activity className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <div>
                                       <p className="text-lg font-black text-slate-900 tracking-tighter italic uppercase leading-none mb-1">{p.user_name || 'Anonymous Node'}</p>
                                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.trigger_type} Cluster • Chennai Metro</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-12 text-right">
                                    <div>
                                       <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 italic">Confidence Sc.</p>
                                       <p className="text-2xl font-black text-slate-900 tracking-tighter">{(p.confidence_score * 100).toFixed(0)}%</p>
                                    </div>
                                    <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest italic hover:bg-rose-600 transition-colors">Invoke Audit</button>
                                 </div>
                              </div>
                           )) : (
                              <div className="py-40 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50">
                                 <ShieldCheck className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                                 <h4 className="text-2xl font-black text-slate-300 uppercase italic tracking-tighter">Zero Hostile Nodes Detected</h4>
                                 <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 italic">Global telemetry consistency across all worker nodes is OPTIMAL.</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeView === 'reports' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 shadow-sm">
                           <div className="flex justify-between items-start mb-12">
                              <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Policy Analytics</h3>
                              <PieChart className="w-6 h-6 text-blue-600" />
                           </div>
                           <div className="space-y-8">
                              {[
                                { label: 'Zomato Protection Pools', val: 74, color: 'bg-blue-600' },
                                { label: 'Amazon Courier Clusters', val: 56, color: 'bg-slate-900' },
                                { label: 'Individual Zepto Shields', val: 32, color: 'bg-emerald-500' },
                                { label: 'Others', val: 18, color: 'bg-slate-200' },
                              ].map((bar, i) => (
                                 <div key={i}>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
                                       <span>{bar.label}</span>
                                       <span>{bar.val}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                       <div className={`h-full ${bar.color}`} style={{ width: `${bar.val}%` }} />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="bg-blue-600 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                           <h3 className="text-3xl font-black tracking-tighter uppercase mb-2 italic">Yield Forecast</h3>
                           <p className="text-blue-100 text-lg font-medium mb-12">Projected liquidity health for the next monsoon cycle (Jul - Sep).</p>
                           
                           <div className="h-64 flex items-end gap-3 px-4 relative z-10">
                              {[30, 45, 25, 60, 50, 40, 70, 55, 90, 80, 100, 85].map((h, i) => (
                                 <div key={i} className="flex-grow bg-white/20 rounded-t-lg hover:bg-white transition-all scale-y-75 group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity italic">M{i+1}</div>
                                 </div>
                              ))}
                           </div>
                           <div className="flex justify-between px-4 mt-6 text-[8px] font-black text-blue-200 uppercase tracking-widest opacity-50 italic">
                              <span>JAN</span>
                              <span>DEC</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

      </div>

    </main>
  );
}
