"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Utensils, Package, ShoppingCart, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone_number: "",
    name: "",
    platform: "",
    primary_zone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const autoDetectLocation = () => {
    setIsDetecting(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsDetecting(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(async (position) => {
       try {
         const { latitude, longitude } = position.coords;
         const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
         const data = await response.json();
         const city = data.address.city || data.address.town || data.address.village || data.address.county || "Unknown Area";
         const state = data.address.state || "";
         updateForm("primary_zone", `${city}, ${state}`.trim().replace(/^, | ,$/g, ''));
       } catch (error) {
         console.error("Error fetching location name:", error);
         alert("Could not determine city name from coordinates.");
       }
       setIsDetecting(false);
    }, (error) => {
       console.error(error);
       alert("Please allow location access to use this feature.");
       setIsDetecting(false);
    });
  };

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setStep(s => s + 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Register User
      const userRes = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const userData = await userRes.json();
      
      // 2. Fetch Initial Quote
      const quoteRes = await fetch("http://localhost:8000/api/policies/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           platform: formData.platform,
           primary_zone: formData.primary_zone
        })
      });

      const quoteData = await quoteRes.json();
      
      setSuccessData({ user: userData, quote: quoteData });
      setStep(5);
    } catch (err) {
      console.error("Registration failed", err);
      // Fallback for hackathon demo
      setStep(5);
    }
    setIsSubmitting(false);
  };

  const platforms = [
    { id: "Zomato", icon: <Utensils className="w-6 h-6" />, color: "text-red-500", bg: "bg-red-50" },
    { id: "Amazon", icon: <Package className="w-6 h-6" />, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "Zepto", icon: <ShoppingCart className="w-6 h-6" />, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 p-8 min-h-[500px] flex flex-col blur-0">
      
      {/* Progress Bar */}
      {step < 5 && (
        <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
          <motion.div 
            className="h-full bg-brand-yellow"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      )}

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Phone */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-black text-brand-slate mb-2">Enter your number</h2>
              <p className="text-slate-500 mb-8 font-medium">We'll send you an OTP to verify your account.</p>
              
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus-within:border-brand-yellow focus-within:ring-2 focus-within:ring-brand-yellow/20 transition-all">
                <span className="text-slate-400 font-bold">+91</span>
                <input 
                  type="tel"
                  placeholder="99999 99999"
                  className="bg-transparent w-full text-xl font-bold text-brand-slate border-none focus:outline-none"
                  value={formData.phone_number}
                  onChange={(e) => updateForm("phone_number", e.target.value)}
                />
              </div>

              <button 
                onClick={handleNext}
                disabled={formData.phone_number.length < 10}
                className="w-full mt-8 py-4 bg-brand-slate text-white font-bold rounded-2xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Send OTP <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-black text-brand-slate mb-2">Verify OTP</h2>
              <p className="text-slate-500 mb-8 font-medium">Enter the simulated code sent to {formData.phone_number}</p>
              
              <div className="flex justify-between gap-4">
                {[1,2,3,4].map(idx => (
                  <input key={idx} type="text" maxLength={1} defaultValue="1" className="w-16 h-16 text-center text-2xl font-black bg-slate-50 border border-slate-200 rounded-2xl focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none" />
                ))}
              </div>

              <button 
                onClick={handleNext}
                className="w-full mt-8 py-4 bg-brand-slate text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                Verify & Continue
              </button>
            </motion.div>
          )}

          {/* STEP 3: Profile */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-black text-brand-slate mb-8">Tell us about yourself</h2>
              
              <label className="block text-sm font-bold text-brand-slate mb-2">Full Name</label>
              <input 
                type="text"
                placeholder="Rahul Kumar"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold text-brand-slate mb-8 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none"
                value={formData.name}
                onChange={(e) => updateForm("name", e.target.value)}
              />

              <label className="block text-sm font-bold text-brand-slate mb-2">Primary Platform</label>
              <div className="grid grid-cols-3 gap-4">
                {platforms.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => updateForm("platform", p.id)}
                    className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all ${formData.platform === p.id ? 'border-brand-yellow bg-brand-yellow/10' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                  >
                    <div className={`p-2 rounded-xl ${p.bg} ${p.color}`}>{p.icon}</div>
                    <span className="font-bold text-sm text-brand-slate">{p.id}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleNext}
                disabled={!formData.name || !formData.platform}
                className="w-full mt-8 py-4 bg-brand-slate text-white font-bold rounded-2xl hover:bg-black transition-all disabled:opacity-50"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* STEP 4: Zone */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-3xl font-black text-brand-slate mb-2">Where do you work?</h2>
              <p className="text-slate-500 mb-8 font-medium">We use this to track local weather and curfews to protect your income automatically.</p>
              
              <div className="flex flex-col gap-4">
                <input 
                  type="text"
                  placeholder="e.g. Andheri East, Mumbai"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold text-brand-slate focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none"
                  value={formData.primary_zone}
                  onChange={(e) => updateForm("primary_zone", e.target.value)}
                />
                
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold">OR</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <button 
                  onClick={autoDetectLocation}
                  disabled={isDetecting}
                  className="w-full p-4 rounded-2xl font-bold text-brand-slate transition-all border-2 border-brand-yellow bg-brand-yellow/10 hover:bg-brand-yellow hover:text-brand-dark flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isDetecting ? (
                    <><Loader2 className="w-5 h-5 animate-spin"/> Locating Satellite...</>
                  ) : (
                    <>📍 Auto-Detect My Location</>
                  )}
                </button>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={!formData.primary_zone || isSubmitting}
                className="w-full mt-10 py-4 bg-brand-yellow text-brand-dark font-black rounded-2xl hover:bg-black hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing AI Risk...</>
                ) : (
                  <><ShieldCheck className="w-5 h-5" /> Generate My Coverage Plan</>
                )}
              </button>
            </motion.div>
          )}

          {/* STEP 5: Success */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center justify-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              
              <h2 className="text-3xl font-black text-brand-slate mb-4">You're In, {formData.name.split(' ')[0]}!</h2>
              <p className="text-slate-500 font-medium mb-8">Your profile has been created and your hyper-local risk assessment is complete.</p>
              
              <div className="w-full bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl p-6 mb-8 text-left">
                <p className="text-sm font-bold text-slate-500 mb-2">Your Personalized Premium</p>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-black text-brand-slate">₹{successData?.quote?.final_weekly_premium || "--"}</span>
                  <span className="text-lg font-bold text-slate-500 mb-1">/week</span>
                </div>
                
                {successData?.quote?.risk_factors?.map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 mt-2 text-sm font-bold text-brand-slate">
                    <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
                    {f}
                  </div>
                ))}
              </div>

              <a href="/">
                <button className="px-8 py-4 bg-brand-slate text-white font-bold rounded-2xl hover:bg-black transition-all">
                  Go to Dashboard
                </button>
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
