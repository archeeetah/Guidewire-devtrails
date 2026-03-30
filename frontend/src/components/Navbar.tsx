"use client";

import { useState } from "react";
import { ShieldCheck, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 border-b border-black/5 bg-white">
      <div className="container mx-auto px-4 h-14 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 min-h-[44px]">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-yellow rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-brand-yellow/10">
            <ShieldCheck className="text-black w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-lg sm:text-2xl font-black tracking-tighter uppercase text-brand-slate">ShramShield</span>
        </a>
        
        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-brand-slate transition-colors">Pricing</a>
          <a href="#" className="hover:text-brand-slate transition-colors">How it works</a>
          <a href="#" className="hover:text-brand-slate transition-colors">Support</a>
        </div>

        {/* Right side: Login + Hamburger */}
        <div className="flex items-center gap-2">
          <a href="/login">
            <button className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-brand-slate text-white font-bold text-xs sm:text-sm hover:bg-brand-yellow hover:text-brand-dark transition-all shadow-md active:scale-95">
              Login
            </button>
          </a>
          
          {/* Mobile hamburger */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              <a href="#" onClick={() => setMenuOpen(false)} className="block py-3 px-3 text-sm font-medium text-slate-600 hover:text-brand-slate hover:bg-slate-50 rounded-xl transition-colors active:bg-slate-100">Pricing</a>
              <a href="#" onClick={() => setMenuOpen(false)} className="block py-3 px-3 text-sm font-medium text-slate-600 hover:text-brand-slate hover:bg-slate-50 rounded-xl transition-colors active:bg-slate-100">How it works</a>
              <a href="#" onClick={() => setMenuOpen(false)} className="block py-3 px-3 text-sm font-medium text-slate-600 hover:text-brand-slate hover:bg-slate-50 rounded-xl transition-colors active:bg-slate-100">Support</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
