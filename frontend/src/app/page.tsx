"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import PersonaCard from "@/components/PersonaCard";
import ProtectionModal from "@/components/ProtectionModal";
import { Utensils, Package, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const PERSONAS = [
  {
    platform: "Zomato / Swiggy",
    icon: <Utensils className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: "#0284c7", // Adjusted to softer blue for SaaS theme
    description: "Food delivery partners facing extreme monsoon rain and heatwaves.",
    riskText: "High Flood Risk (July-Sept)"
  },
  {
    platform: "Amazon / Flipkart",
    icon: <Package className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: "#ea580c", // Adjusted to softer orange
    description: "Logistic partners affected by unplanned curfews and zone closures.",
    riskText: "Social Disruption Risk"
  },
  {
    platform: "Zepto / Blinkit",
    icon: <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />,
    color: "#059669", // Adjusted to emerald
    description: "Q-Commerce partners dealing with severe pollution and road closures.",
    riskText: "AQI & Traffic Volatility"
  }
];

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      <Navbar />
      
      <div>
        <Hero />
        
        <section id="platforms" className="container mx-auto px-6 py-16 sm:py-24 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 tracking-tight">Select Coverage Profile</h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-medium">
              Choose your primary delivery segment to view automated parametric coverage options.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
      <Footer />
    </main>
  );
}
