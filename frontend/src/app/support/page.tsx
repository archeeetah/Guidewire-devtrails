"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 pb-24 font-sans">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-24 sm:pt-32 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-white border border-slate-200 shadow-sm"
          >
             <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Global Infrastructure Support</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight"
          >
            We've Got Your <span className="text-blue-600">Back.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed"
          >
             Need help with your coverage or payouts? Our multi-channel support team is available 24/7.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
           
           {/* FAQ Section */}
           <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-slate-100 rounded-lg">
                    <HelpCircle className="w-5 h-5 text-slate-600" />
                 </div>
                 <h2 className="text-xl font-bold tracking-tight text-slate-800">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-4">
                 {FAQS.map((faq, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className={`rounded-2xl overflow-hidden border transition-all ${openIndex === i ? 'bg-white border-blue-200 shadow-md' : 'bg-white border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'}`}
                   >
                     <button 
                       onClick={() => setOpenIndex(openIndex === i ? null : i)}
                       className="w-full p-6 flex items-center justify-between text-left group focus:outline-none"
                     >
                        <span className="text-lg font-semibold tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors pr-8">{faq.question}</span>
                        <div className={`p-2 rounded-full flex items-center justify-center transition-colors ${openIndex === i ? 'bg-blue-50' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                           {openIndex === i ? <Minus className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-slate-400" />}
                        </div>
                     </button>
                     <AnimatePresence>
                        {openIndex === i && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                          >
                             <div className="px-6 pb-6 text-slate-500 font-medium leading-relaxed max-w-2xl border-t border-slate-50 pt-4">
                                {faq.answer}
                             </div>
                          </motion.div>
                        )}
                     </AnimatePresence>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* Contact Sidebar */}
           <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                    <MessageSquare className="w-32 h-32 text-blue-400" />
                 </div>
                 
                 <div className="flex items-center gap-3 mb-8 relative z-10">
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                       <MessageSquare className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Direct Support</h3>
                 </div>
                 
                 <div className="space-y-4 relative z-10">
                    <a href="https://wa.me/919123456789" className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-all group/item cursor-pointer">
                       <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                          <MessageSquare className="w-5 h-5 text-emerald-400" />
                       </div>
                       <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">WhatsApp Live</p>
                          <p className="text-base font-bold tracking-tight group-hover:text-emerald-400 transition-colors">+91 91234 56789</p>
                       </div>
                    </a>

                    <a href="mailto:help@shramshield.in" className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-all group/item cursor-pointer">
                       <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                          <Mail className="w-5 h-5 text-blue-400" />
                       </div>
                       <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">Email Support</p>
                          <p className="text-base font-bold tracking-tight group-hover:text-blue-400 transition-colors">help@shramshield.in</p>
                       </div>
                    </a>

                    <a href="tel:1800-SHRAM-HELP" className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-all group/item cursor-pointer">
                       <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                          <Phone className="w-5 h-5 text-purple-400" />
                       </div>
                       <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">24/7 Helpline</p>
                          <p className="text-base font-bold tracking-tight group-hover:text-purple-400 transition-colors">1800-SHRAM-HELP</p>
                       </div>
                    </a>
                 </div>
              </div>

              {/* System Status Block */}
              <a href="/dashboard" className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group cursor-pointer block">
                 <div>
                    <h4 className="text-lg font-bold tracking-tight text-slate-800 mb-1">System Status</h4>
                    <p className="text-xs font-medium text-slate-500">Live IMD Sync & Telemetry</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Optimal</span>
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                 </div>
              </a>
           </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
