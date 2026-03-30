"use client";

import { useState } from "react";
import { ShieldCheck, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 border-b border-slate-200 bg-white shadow-sm font-sans">
      <div className="container mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 min-h-[44px]">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md shadow-blue-600/20">
            <ShieldCheck className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">ShramShield</span>
        </a>
        
        {/* Desktop nav links */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-medium text-slate-500">
          <a href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="/how-it-works" className="hover:text-blue-600 transition-colors">How it works</a>
          <a href="/support" className="hover:text-blue-600 transition-colors">Support</a>
        </div>

        {/* Right side: Login + Hamburger */}
        <div className="flex items-center gap-4">
          <a href="/login" className="hidden sm:block">
            <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-all shadow-sm active:scale-95">
              Sign In
            </button>
          </a>
          <a href="/login" className="sm:hidden">
            <button className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs transition-all shadow-sm active:scale-95">
              Login
            </button>
          </a>
          
          {/* Mobile hamburger */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
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
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden shadow-xl"
          >
            <div className="px-4 py-4 space-y-2">
              <a href="/pricing" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors active:bg-slate-100">Pricing</a>
              <a href="/how-it-works" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors active:bg-slate-100">How it works</a>
              <a href="/support" onClick={() => setMenuOpen(false)} className="block py-3 px-4 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-colors active:bg-slate-100">Support</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
