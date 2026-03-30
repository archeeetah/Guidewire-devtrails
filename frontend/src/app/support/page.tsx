"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Minus, MessageSquare, Phone, 
  Mail, Globe, HelpCircle, ArrowRight, ShieldCheck 
} from "lucide-react";

const FAQS = [
  {
    question: "How do I file a claim?",
    answer: "You don't! ShramShield is a parametric insurance platform. We monitor weather and AQI data through IMD and satellites. If a trigger is met in your work zone, we send the payout automatically to your registered UPI ID."
  },
  {
    question: "When will I receive my payout?",
    answer: "Payouts are triggered the moment the threshold data is processed (usually within 15-30 minutes of the disruption peak). The money is sent directly via UPI and should reflect in your account instantly."
  },
  {
    question: "Which zones are currently covered?",
    answer: "We currently cover major tier-1 and tier-2 cities across India, including Mumbai, Delhi NCR, Bangalore, Chennai, Pune, and Hyderabad. More zones are being added every week."
  },
  {
    question: "What happens if I change my work zone?",
    answer: "You can update your primary zone in the ShramShield app settings. Premiums may adjust slightly based on the risk profile of your new zone."
  },
  {
    question: "Is my personal data safe?",
    answer: "Absolutely. We only collect the minimum telemetry data required to verify your zone and facilitate payouts. Your financial data is handled through secure, encrypted UPI protocols."
  }
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-white text-brand-slate selection:bg-brand-yellow selection:text-brand-dark pb-24 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 sm:pt-32">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-[0.2em]"
          >
             Global Infrastructure Support
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 leading-[0.9] italic"
          >
            We've Got Your <span className="text-brand-yellow">Back.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-2xl text-slate-500 font-bold max-w-xl mx-auto leading-tight"
          >
             Need help with your policy or payouts? Our multi-channel support team is available 24/7.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-7xl mx-auto items-start">
           
           {/* FAQ Section */}
           <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3 mb-12">
                 <HelpCircle className="w-6 h-6 text-brand-yellow" />
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter">Frequently Asked</h2>
              </div>
              
              {FAQS.map((faq, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-[32px] overflow-hidden border transition-all ${openIndex === i ? 'bg-slate-50 border-brand-yellow/30 shadow-xl' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                >
                  <button 
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full p-8 flex items-center justify-between text-left group"
                  >
                     <span className="text-lg font-black tracking-tight italic transition-colors">{faq.question}</span>
                     {openIndex === i ? <Minus className="w-5 h-5 text-brand-yellow" /> : <Plus className="w-5 h-5 text-slate-300" />}
                  </button>
                  <AnimatePresence>
                     {openIndex === i && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: "auto", opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         transition={{ duration: 0.3 }}
                       >
                          <div className="px-8 pb-8 text-slate-500 font-bold leading-tight max-w-2xl">
                             {faq.answer}
                          </div>
                       </motion.div>
                     )}
                  </AnimatePresence>
                </motion.div>
              ))}
           </div>

           {/* Contact Sidebar */}
           <div className="lg:col-span-5 space-y-8 sticky top-32">
              <div className="p-10 rounded-[48px] bg-brand-slate text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform rotate-12">
                    <MessageSquare className="w-32 h-32 text-brand-yellow" />
                 </div>
                 <h3 className="text-2xl font-black mb-8 italic uppercase tracking-tighter text-brand-yellow relative z-10">Direct Support</h3>
                 
                 <div className="space-y-6 relative z-10">
                    <a href="https://wa.me/919123456789" className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group/item cursor-pointer">
                       <div className="p-3 bg-brand-yellow rounded-2xl">
                          <MessageSquare className="w-5 h-5 text-brand-dark" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">WhatsApp Live</p>
                          <p className="text-lg font-black italic tracking-tighter hover:text-brand-yellow transition-colors underline decoration-dotted">+91 91234 56789</p>
                       </div>
                    </a>

                    <a href="mailto:help@shramshield.in" className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group/item cursor-pointer">
                       <div className="p-3 bg-white/10 rounded-2xl">
                          <Mail className="w-5 h-5 text-white" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">Email Support</p>
                          <p className="text-lg font-black italic tracking-tighter hover:text-brand-yellow transition-colors underline decoration-dotted">help@shramshield.in</p>
                       </div>
                    </a>

                    <a href="tel:1800-SHRAM-HELP" className="flex items-center gap-4 bg-white/5 p-5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all group/item cursor-pointer">
                       <div className="p-3 bg-white/10 rounded-2xl">
                          <Phone className="w-5 h-5 text-white" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">24/7 Helpline</p>
                          <p className="text-lg font-black italic tracking-tighter hover:text-brand-yellow transition-colors underline decoration-dotted">1800-SHRAM-HELP</p>
                       </div>
                    </a>
                 </div>
              </div>

              {/* System Status Link */}
              <a href="/dashboard" className="p-10 rounded-[48px] bg-slate-50 border border-slate-100 flex flex-col items-center text-center group active:scale-95 transition-all cursor-pointer">
                 <div className="w-16 h-16 bg-white rounded-3xl shadow-lg border border-slate-100 mb-6 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
                    <Globe className="w-6 h-6 text-emerald-500 relative z-10" />
                 </div>
                 <h4 className="text-xl font-black italic uppercase tracking-tighter mb-2">System Telemetry</h4>
                 <p className="text-xs font-bold text-slate-400 max-w-[200px] mb-6">Real-time IMD Sync and Sensor Network status.</p>
                 <div className="px-6 py-2 bg-white border border-slate-100 rounded-full flex items-center gap-2 group-hover:border-brand-yellow transition-all">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">All Systems Optimal</span>
                 </div>
              </a>
           </div>
        </div>
      </div>
    </main>
  );
}
