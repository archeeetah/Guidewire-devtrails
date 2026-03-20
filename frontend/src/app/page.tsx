"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PersonaCard from "@/components/PersonaCard";
import ProtectionModal from "@/components/ProtectionModal";
import { Utensils, Package, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const PERSONAS = [
  {
    platform: "Zomato / Swiggy",
    icon: <Utensils className="w-8 h-8" />,
    color: "#ff4d4d",
    description: "Food delivery partners facing extreme monsoon rain and heatwaves.",
    riskText: "High Flood Risk (July-Sept)"
  },
  {
    platform: "Amazon / Flipkart",
    icon: <Package className="w-8 h-8" />,
    color: "#ff9900",
    description: "Logistic partners affected by unplanned curfews and zone closures.",
    riskText: "Social Disruption Risk"
  },
  {
    platform: "Zepto / Blinkit",
    icon: <ShoppingCart className="w-8 h-8" />,
    color: "#3c00ff",
    description: "Q-Commerce partners dealing with severe pollution and road closures.",
    riskText: "AQI & Traffic Volatility"
  }
];

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white text-brand-slate selection:bg-brand-yellow selection:text-brand-dark">
      <Navbar />
      
      <div>
        <Hero />
        
        <section id="platforms" className="container mx-auto px-4 py-24 border-t border-slate-100">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-4 text-brand-slate tracking-tighter">Choose Your Platform</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              Select your delivery segment to see how SafeZone protects your weekly income
              from local disruptions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PERSONAS.map((persona, index) => (
              <PersonaCard 
                key={persona.platform} 
                {...persona} 
                index={index} 
                onSelect={() => setSelectedPersona(persona.platform)}
              />
            ))}
          </div>
        </section>
      </div>

      <ProtectionModal 
        isOpen={!!selectedPersona}
        onClose={() => setSelectedPersona(null)}
        platform={selectedPersona || ""}
      />

      <footer className="border-t border-slate-100 py-12 text-center text-slate-400 text-sm font-medium">
        <p>© 2026 SafeZone. Built for Guidewire DEVTrails Hackathon.</p>
      </footer>
    </main>
  );
}
