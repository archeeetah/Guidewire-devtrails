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
    icon: <Utensils className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: "#ff4d4d",
    description: "Food delivery partners facing extreme monsoon rain and heatwaves.",
    riskText: "High Flood Risk (July-Sept)"
  },
  {
    platform: "Amazon / Flipkart",
    icon: <Package className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: "#ff9900",
    description: "Logistic partners affected by unplanned curfews and zone closures.",
    riskText: "Social Disruption Risk"
  },
  {
    platform: "Zepto / Blinkit",
    icon: <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />,
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
        
        <section id="platforms" className="container mx-auto px-3 sm:px-4 py-12 sm:py-24 border-t border-slate-100">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl font-black mb-3 sm:mb-4 text-brand-slate tracking-tighter">Choose Your Platform</h2>
            <p className="text-slate-500 text-sm sm:text-lg max-w-2xl mx-auto font-medium px-2">
              Select your delivery segment to see how ShramShield protects your weekly income
              from local disruptions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8">
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
    </main>
  );
}
