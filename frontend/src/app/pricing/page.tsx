"use client";

import Navbar from "@/components/Navbar";
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
    icon: <Shield className="w-6 h-6 text-slate-400" />,
    color: "bg-slate-50",
    button: "Start Free Trial"
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
    icon: <Zap className="w-6 h-6 text-brand-yellow" />,
    color: "bg-brand-slate text-white",
    popular: true,
    button: "Go Pro Now"
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
    icon: <Crown className="w-6 h-6 text-brand-yellow" />,
    color: "bg-white border-2 border-brand-yellow",
    button: "Contact Fleet Sales"
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-brand-slate selection:bg-brand-yellow selection:text-brand-dark pb-24">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 sm:pt-32">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 leading-none italic"
          >
            Simple, <span className="text-brand-yellow">Micro</span> Pricing.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-500 font-bold max-w-xl mx-auto leading-tight"
          >
            We don't do complex contracts. Just small weekly premiums for instant parametric protection.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={plan.name}
              className={`relative p-10 rounded-[48px] flex flex-col ${plan.color} shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 hover:scale-[1.02] transition-all`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-yellow text-brand-dark rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Most Trusted
                </div>
              )}

              <div className="mb-8">
                <div className={`p-4 w-fit rounded-2xl mb-6 ${plan.popular ? 'bg-white/10' : 'bg-slate-100'}`}>
                   {plan.icon}
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2 italic uppercase">{plan.name}</h3>
                <p className={`text-sm font-bold leading-snug ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter italic">{plan.price}</span>
                  {plan.period !== "per partner" && <span className={`font-black text-sm uppercase opacity-40 italic`}>/{plan.period}</span>}
                </div>
                {plan.period === "per partner" && <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Scale with your fleet</p>}
              </div>

              <div className="space-y-4 mb-12 flex-grow">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`mt-1 bg-brand-yellow/20 p-0.5 rounded-full`}>
                      <Check className="w-3.5 h-3.5 text-brand-yellow" />
                    </div>
                    <span className={`text-sm font-bold ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                  </div>
                ))}
              </div>

              <a href={plan.name === "Fleet Enterprise" ? "/support" : "/login"} className="w-full">
                <button className={`w-full py-5 rounded-3xl font-black text-lg transition-all active:scale-95 shadow-xl ${plan.popular ? 'bg-brand-yellow text-brand-dark hover:bg-white' : 'bg-brand-slate text-white hover:bg-black'}`}>
                  {plan.button}
                </button>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Risk Calculator Teaser */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-12 rounded-[56px] bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto"
        >
          <div className="max-w-xl">
             <h4 className="text-4xl font-black tracking-tighter mb-4 italic">Precise Risk-Based Adjustments.</h4>
             <p className="text-slate-500 font-bold leading-tight">
               Your premium isn't fixed in a vacuum. Our AI aggregates historical IMD data and local telemetry to ensure you pay the fairest rate for the specific risks in your delivery zone.
             </p>
          </div>
          <a href="/dashboard" className="px-10 py-5 bg-white border-2 border-brand-slate text-brand-slate font-black rounded-3xl hover:bg-brand-slate hover:text-white transition-all text-lg shadow-xl shrink-0">
             Open Area Risk Map
          </a>
        </motion.div>
      </div>
    </main>
  );
}
