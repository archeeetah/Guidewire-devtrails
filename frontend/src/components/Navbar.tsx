"use client";

import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="relative z-50 border-b border-black/5 bg-white">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center shadow-lg shadow-brand-yellow/10">
            <ShieldCheck className="text-black w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase text-brand-slate">SafeZone</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-brand-slate transition-colors">Pricing</a>
          <a href="#" className="hover:text-brand-slate transition-colors">How it works</a>
          <a href="#" className="hover:text-brand-slate transition-colors">Support</a>
        </div>

        <div>
          <button className="px-5 py-2.5 rounded-full bg-brand-slate text-white font-bold text-sm hover:bg-brand-yellow hover:text-brand-dark transition-all">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
