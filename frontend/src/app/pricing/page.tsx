"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown } from "lucide-react";

const PLANS = [
  {
    name: "Flex Lite",
    price: "₹49",
    period: "weekly",
    description: "Essential protection for part-time partners.",
    features: [
      "Rainfall Payouts (₹1,500)",
      "Basic AQI Protection",
      "UPI Instant Settlement",
      "Email Support"
    ],
    icon: <Shield className="w-5 h-5 text-slate-500" />,
    color: "bg-white",
    border: "border-slate-200",
    button: "Start Free Trial",
    buttonStyle: "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
  },
  {
    name: "Gig Pro",
    price: "₹99",
    period: "weekly",
    description: "Maximized coverage for professional full-time partners.",
    features: [
      "Full Rain Payouts (₹2,500)",
      "High-Risk AQI Coverage",
      "Zonal Grid-Lock Protection",
      "Priority Payout Queue",
      "WhatsApp Support"
    ],
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    color: "bg-slate-900 text-white",
    border: "border-slate-800",
    popular: true,
    button: "Go Pro Now",
    buttonStyle: "bg-blue-600 text-white hover:bg-blue-500 border border-blue-500"
  },
  {
    name: "Fleet Enterprise",
    price: "Custom",
    period: "per partner",
    description: "Scalable parametric safety for delivery fleets.",
    features: [
      "Bulk Partner Onboarding",
      "Fleet Health Dashboard",
      "Custom Risk Thresholds",
      "Dedicated Account Manager",
      "API Integration"
    ],
    icon: <Crown className="w-5 h-5 text-slate-700" />,
    color: "bg-white",
    border: "border-slate-200",
    button: "Contact Fleet Sales",
    buttonStyle: "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200"
  }
];

export default function PricingPage() {
  const [activeMobilePlan, setActiveMobilePlan] = useState(1); // Default to "Gig Pro" (index 1)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 pb-24 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 sm:pt-32">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
          >
             <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Transparent Pricing</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            Simple, <span className="text-blue-600">Micro-Premiums.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed"
          >
            We don't do complex contracts. Just small weekly premiums for instant parametric protection that fits your gig schedule.
          </motion.p>
        </div>

        {/* Mobile Plan Tab Selector */}
        <div className="md:hidden flex bg-white border border-slate-200 rounded-xl p-1 mb-8 max-w-sm mx-auto shadow-sm">
          {PLANS.map((plan, i) => (
            <button 
              key={plan.name} 
              onClick={() => setActiveMobilePlan(i)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeMobilePlan === i ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {plan.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Desktop: Full Grid */}
        <div className="hidden md:grid grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {PLANS.map((plan, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={plan.name}
              className={`relative p-8 rounded-3xl flex flex-col h-full ${plan.color} shadow-sm border ${plan.border} hover:shadow-md transition-shadow ${plan.popular ? 'md:scale-105 shadow-xl z-10 py-10' : 'z-0'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Most Trusted
                </div>
              )}

              <div className="mb-8">
                <div className={`p-3 w-fit rounded-xl mb-6 ${plan.popular ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'} border`}>
                   {plan.icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">{plan.name}</h3>
                <p className={`text-sm font-medium leading-relaxed ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                  {plan.period !== "per partner" && <span className={`font-medium text-sm ${plan.popular ? 'text-slate-500' : 'text-slate-400'}`}>/{plan.period}</span>}
                </div>
                {plan.period === "per partner" && <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-2">Scale with your fleet</p>}
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-0.5 rounded-full ${plan.popular ? 'bg-blue-500/20' : 'bg-emerald-50'}`}>
                      <Check className={`w-3.5 h-3.5 ${plan.popular ? 'text-blue-400' : 'text-emerald-500'}`} />
                    </div>
                    <span className={`text-sm font-medium ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                  </div>
                ))}
              </div>

              <a href={plan.name === "Fleet Enterprise" ? "/support" : "/login"} className="w-full mt-auto">
                <button className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${plan.buttonStyle}`}>
                  {plan.button}
                </button>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Single Card View */}
        <div className="md:hidden max-w-sm mx-auto">
          {PLANS.map((plan, i) => (
            activeMobilePlan === i && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                key={plan.name}
                className={`relative p-8 rounded-3xl flex flex-col ${plan.color} shadow-sm border ${plan.border}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Most Trusted
                  </div>
                )}

                <div className="mb-8">
                  <div className={`p-3 w-fit rounded-xl mb-6 ${plan.popular ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'} border`}>
                     {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{plan.name}</h3>
                  <p className={`text-sm font-medium leading-relaxed ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                    {plan.period !== "per partner" && <span className={`font-medium text-sm ${plan.popular ? 'text-slate-500' : 'text-slate-400'}`}>/{plan.period}</span>}
                  </div>
                  {plan.period === "per partner" && <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-2">Scale with your fleet</p>}
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className={`mt-0.5 p-0.5 rounded-full ${plan.popular ? 'bg-blue-500/20' : 'bg-emerald-50'}`}>
                        <Check className={`w-3.5 h-3.5 ${plan.popular ? 'text-blue-400' : 'text-emerald-500'}`} />
                      </div>
                      <span className={`text-sm font-medium ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <a href={plan.name === "Fleet Enterprise" ? "/support" : "/login"} className="w-full mt-auto">
                  <button className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all shadow-sm ${plan.buttonStyle}`}>
                    {plan.button}
                  </button>
                </a>
              </motion.div>
            )
          ))}
        </div>

        {/* Dynamic Risk Calculator Teaser */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 p-10 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto"
        >
          <div className="max-w-xl">
             <h4 className="text-2xl font-bold tracking-tight mb-3 text-slate-900">Precise Risk-Based Adjustments</h4>
             <p className="text-slate-500 font-medium leading-relaxed text-sm">
               Your premium isn't fixed in a vacuum. Our AI aggregates historical IMD data and local telemetry to ensure you pay the fairest rate for the specific risks in your delivery zone.
             </p>
          </div>
          <a href="/dashboard" className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm shrink-0">
             View Risk Telemetry
          </a>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
