"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Zap, AlertCircle, Terminal, ShieldAlert, Globe, 
  BarChart3, Settings, Play, RefreshCw, Layers, Loader2, Bell, CheckCircle2, CloudRain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("shramshield_admin") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === "shramadmin") { // simple mocked password
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
    zone: "Mumbai"
  });
  const [result, setResult] = useState<any>(null);
  const lastAlertId = useRef<number | string>(0);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setAdminStats(data);

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
    const interval = setInterval(fetchAdminStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-md w-full border border-slate-200"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20 mb-8 mx-auto">
            <Lock className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 text-center mb-2">Admin Access</h2>
          <p className="text-slate-500 text-sm font-medium text-center mb-8">
             Enter verification phrase to access core telemetry and override protocols.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div>
               <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                 Access Token
               </label>
               <input 
                 type="password"
                 value={adminPass}
                 onChange={(e) => setAdminPass(e.target.value)}
                 className={`w-full bg-slate-50 border ${authError ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'} rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-transparent focus:ring-2 transition-all text-slate-900`}
                 placeholder="Enter admin token..."
               />
               {authError && <p className="text-red-500 text-xs mt-2 font-medium">Invalid access token. Command override denied.</p>}
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
            >
              Verify Identity
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
             <a href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                &larr; Return to Homepage
             </a>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6 sm:p-10 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Header Area */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <ShieldAlert className="w-5 h-5 text-blue-600" />
               <span className="text-sm font-semibold tracking-wide text-blue-600 uppercase">Admin Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Parametric System Overview</h1>
         </div>

         <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-4">
               <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">System Status</span>
               <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-slate-700">All Operations Normal</span>
               </div>
            </div>
            
            <div className="relative">
               <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors relative shadow-sm"
               >
                  <Bell className="w-5 h-5 text-slate-600" />
                  {adminStats?.notifications?.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full shadow-sm" />
                  )}
               </button>

               <AnimatePresence>
                 {showNotifications && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
                     className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-5 z-[100]"
                   >
                     <h4 className="font-semibold text-xs uppercase tracking-wide text-slate-500 mb-4 px-1">Recent Alerts</h4>
                     <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {adminStats?.notifications?.map((n: any) => (
                          <div key={n.id} className="group relative">
                             <div className="flex items-start gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'PAYOUT_ISSUED' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                <div>
                                   <p className="font-semibold text-sm text-slate-800">{n.title}</p>
                                   <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
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
               className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
            >
               <RefreshCw className="w-5 h-5 text-slate-600" />
            </button>
         </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
           
           {/* Liquidity Tracking */}
           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <Globe className="w-5 h-5 text-slate-400" />
                 <h3 className="font-semibold text-slate-700">Liquidity Health</h3>
              </div>
              
              {adminStats ? (
                <div>
                   <div className="flex justify-between items-end mb-3">
                      <p className="text-sm font-medium text-slate-500">Solvency Index</p>
                      <p className="text-3xl font-bold tracking-tight text-slate-900">{adminStats.liquidity.health_score}%</p>
                   </div>
                   <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${adminStats.liquidity.health_score}%` }}
                        className={`h-full ${adminStats.liquidity.health_score > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <p className="text-xs font-medium text-slate-500 mb-1">Total Reserves</p>
                         <p className="font-bold text-lg text-slate-800">₹{(adminStats.liquidity.current_pool / 100000).toFixed(1)}L</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <p className="text-xs font-medium text-slate-500 mb-1">Total Payouts</p>
                         <p className="font-bold text-lg text-blue-600">₹{(adminStats.liquidity.total_payouts / 100000).toFixed(1)}L</p>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="animate-pulse h-32 bg-slate-100 rounded-xl" />
              )}
           </div>

           {/* Active Disruption Zones */}
           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                 <Layers className="w-5 h-5 text-slate-400" />
                 <h3 className="font-semibold text-slate-700">Disruption Zones</h3>
              </div>
              
              <div className="space-y-4">
                 {adminStats?.heatmap && adminStats.heatmap.length > 0 ? (
                    adminStats.heatmap.slice(0, 4).map((zone: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                         <div className="flex items-center gap-3 w-1/3">
                            <CloudRain className="w-4 h-4 text-slate-400" />
                            <p className="text-sm font-semibold text-slate-700">{zone.city}</p>
                         </div>
                         <div className="h-2 flex-grow mx-4 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${Math.min(zone.claims * 10, 100)}%` }} />
                         </div>
                         <p className="text-xs font-medium text-slate-500 w-16 text-right">{zone.claims} Claims</p>
                      </div>
                    ))
                 ) : (
                    <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                       <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">No Active Zones</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           
           {/* Simulation Core */}
           <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <Settings className="w-5 h-5 text-slate-400" />
                 <h3 className="font-semibold text-slate-700 text-lg">System Trigger Simulation</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 
                 <div className="space-y-6">
                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Event Type</label>
                       <div className="flex gap-2">
                          {["Flood", "Cyclone", "Curfew"].map(type => (
                            <button 
                              key={type}
                              onClick={() => setSimulationParams(p => ({...p, trigger_type: type}))}
                              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border ${simulationParams.trigger_type === type ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                            >
                              {type}
                            </button>
                          ))}
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Target Region</label>
                       <input 
                         type="text"
                         placeholder="e.g. Mumbai, Delhi NCR"
                         value={simulationParams.zone}
                         onChange={(e) => setSimulationParams(p => ({...p, zone: e.target.value}))}
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                       />
                    </div>
                 </div>

                 <div className="flex flex-col justify-end">
                     <button 
                       onClick={handleSimulate}
                       disabled={isSimulating}
                       className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-md"
                     >
                        {isSimulating ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Processing Trigger...</>
                        ) : (
                          <><Play className="w-5 h-5 fill-current" /> Execute Simulation</>
                        )}
                     </button>
                 </div>
                 
              </div>
           </div>

           {/* Results Overlay */}
           {result && (
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-emerald-100">
                       <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-1">Execution Successful</h4>
                      <p className="text-emerald-700 text-sm mb-4 leading-relaxed">{result.message}</p>
                      
                      <div className="flex gap-6">
                         <div>
                            <p className="text-xs font-medium text-emerald-600/70 uppercase tracking-wide mb-1">Payouts Processed</p>
                            <p className="text-2xl font-bold text-emerald-800">{result.payouts?.length || 0}</p>
                         </div>
                         <div>
                            <p className="text-xs font-medium text-emerald-600/70 uppercase tracking-wide mb-1">Status</p>
                            <p className="text-lg font-bold text-emerald-800 mt-1">Verified</p>
                         </div>
                      </div>
                    </div>
                 </div>
              </div>
           )}

           {/* Audit Log Data Table */}
           <div className="flex-grow bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                 <div>
                    <h3 className="font-semibold text-slate-800 text-lg">Payout Ledger</h3>
                    <p className="text-sm text-slate-500">Recent automated transactions</p>
                 </div>
                 <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 shadow-sm">
                    Live Feed
                 </div>
              </div>

              <div className="flex-grow">
                 {/* Table Header */}
                 <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 hidden md:grid">
                    <div className="col-span-3">Trigger Event</div>
                    <div className="col-span-3">Recipient</div>
                    <div className="col-span-3">Hash Ref</div>
                    <div className="col-span-3 text-right">Amount</div>
                 </div>

                 {/* Table Rows */}
                 <div className="space-y-2">
                   {payoutHistory.length > 0 ? (
                     payoutHistory.slice().reverse().map((p, i) => (
                        <div 
                          key={p.id}
                          className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col md:grid md:grid-cols-12 items-center gap-4 hover:shadow-md transition-shadow"
                        >
                           <div className="col-span-12 md:col-span-3 w-full flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                                 <Zap className="w-4 h-4 text-blue-500" />
                              </div>
                              <span className="font-semibold text-sm text-slate-800">{p.trigger_type}</span>
                           </div>

                           <div className="col-span-12 md:col-span-3 w-full">
                              <p className="font-medium text-sm text-slate-600">{p.user_name || 'System Worker'}</p>
                           </div>

                           <div className="col-span-12 md:col-span-3 w-full">
                              <p className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded inline-block">UPI_{p.id.substring(0,8)}</p>
                           </div>

                           <div className="col-span-12 md:col-span-3 w-full text-left md:text-right">
                              <p className="font-bold text-slate-900">₹{p.amount}</p>
                              <p className="text-[10px] font-medium text-emerald-500 uppercase">Settled</p>
                           </div>
                        </div>
                     ))
                   ) : (
                     <div className="h-40 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 mt-4">
                        <BarChart3 className="w-8 h-8 text-slate-300 mb-3" />
                        <p className="font-medium text-sm text-slate-500">No transactions recorded yet</p>
                     </div>
                   )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
