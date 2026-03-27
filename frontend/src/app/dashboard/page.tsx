"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudLightning, Wind, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const [simulationParams, setSimulationParams] = useState({ zone: "Andheri" });
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:8000/api/triggers/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simulationParams),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setIsSimulating(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-brand-slate selection:bg-brand-yellow selection:text-brand-dark flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-grow flex flex-col items-center">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 font-black text-sm uppercase tracking-widest">
            <Zap className="w-4 h-4 mr-2" />
            Hackathon God Mode
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-brand-slate">
            Disruption Simulator
          </h1>
          <p className="text-slate-500 font-medium">
            Trigger a real-world disaster in a specific zone to watch ShramShield's parametric engine automatically save the day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          
          {/* Controls */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-fit">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <CloudLightning className="text-brand-yellow" /> Parameters
            </h2>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-brand-slate mb-3">Target Disruption Zone</label>
              <input 
                type="text"
                value={simulationParams.zone}
                onChange={(e) => setSimulationParams({ zone: e.target.value })}
                placeholder="Enter Target Zone (e.g. Pune)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold text-brand-slate mb-4 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-100">
               <p className="text-sm font-medium text-slate-500 mb-2">Simulated Event Override</p>
               <ul className="space-y-3 font-bold text-brand-slate">
                 <li className="flex justify-between items-center"><span className="flex items-center gap-2"><CloudLightning className="w-4 h-4 text-blue-500"/> Flash Flood (&gt;50mm)</span> <span className="text-xs px-2 py-1 bg-white rounded-md border border-slate-200 text-slate-400">If Flood Risk (Default)</span></li>
                 <li className="flex justify-between items-center"><span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500"/> Curfew Lockout</span> <span className="text-xs px-2 py-1 bg-white rounded-md border border-slate-200 text-slate-400">If High Tension</span></li>
                 <li className="flex justify-between items-center"><span className="flex items-center gap-2"><Wind className="w-4 h-4 text-green-500"/> Severe AQI (&gt;400)</span> <span className="text-xs px-2 py-1 bg-white rounded-md border border-slate-200 text-slate-400">If High Pollution</span></li>
               </ul>
            </div>

            <button 
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSimulating ? "Connecting to APIs..." : "Execute Weather Event"}
            </button>
          </div>

          {/* Results Screen */}
          <div className="bg-brand-slate p-8 rounded-[32px] shadow-2xl overflow-hidden relative min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl" />
            
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2 relative z-10">
              <ShieldCheck className="text-brand-yellow" /> Live Engine Output
            </h2>

            {!result && !isSimulating && (
              <div className="h-full flex items-center justify-center opacity-30 text-white font-mono text-sm">
                Awaiting Disruption Signal...
              </div>
            )}

            {isSimulating && (
              <div className="flex flex-col gap-4 text-yellow-500 font-mono text-sm relative z-10">
                 <motion.p initial={{opacity:0}} animate={{opacity:1}}>&gt;&gt; Authenticating API...</motion.p>
                 <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.5}}>&gt;&gt; Polling Weather Data for {simulationParams.zone}...</motion.p>
                 <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 1.0}}>&gt;&gt; Running Parametric Threshold Checks...</motion.p>
              </div>
            )}

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10"
                >
                  <div className={`p-4 rounded-xl border mb-6 ${result.status === "disrupted" ? "bg-red-500/10 border-red-500/20 text-red-100" : "bg-green-500/10 border-green-500/20 text-green-100"}`}>
                    <p className="font-bold font-mono text-sm">{result.message}</p>
                  </div>

                  {result.telemetry && (
                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 p-3 rounded-xl">
                          <p className="text-xs text-slate-400 font-bold mb-1">Rainfall (3h)</p>
                          <p className="text-white font-black font-mono">{result.telemetry.rainfall_mm_3h.toFixed(1)}mm</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl">
                          <p className="text-xs text-slate-400 font-bold mb-1">Air Quality</p>
                          <p className="text-white font-black font-mono">{result.telemetry.aqi} AQI</p>
                        </div>
                     </div>
                  )}

                  {result.payouts && result.payouts.length > 0 && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.5 }}
                      className="bg-brand-yellow rounded-2xl p-6 shadow-2xl shadow-brand-yellow/20"
                    >
                      <div className="flex items-center gap-3 mb-2 text-brand-slate">
                        <CheckCircle2 className="w-6 h-6" />
                        <span className="font-black text-lg">Razorpay Auto-Payout</span>
                      </div>
                      
                      {result.payouts.map((p: any, i: number) => (
                        <div key={i} className="bg-white/80 p-3 rounded-xl mt-3 flex justify-between items-center text-brand-slate">
                           <div>
                             <p className="font-black">Policy #{p.policy_id}</p>
                             <p className="text-xs font-bold text-red-600">{p.trigger_reason}</p>
                           </div>
                           <p className="text-2xl font-black">₹{p.payout_amount}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
