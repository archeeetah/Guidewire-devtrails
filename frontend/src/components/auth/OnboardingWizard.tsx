"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Utensils, Package, ShoppingCart, CheckCircle2, ShieldCheck, Loader2, UploadCloud, ScanSearch } from "lucide-react";

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone_number: "",
    name: "",
    platform: "",
    platform_worker_id: "",
    primary_zone: "",
    upi_id: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [platformSearch, setPlatformSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const gigCompanies = ["Zomato", "Swiggy", "Blinkit", "Zepto", "Amazon", "Flipkart", "Uber", "Ola", "Rapido", "Porter", "Dunzo", "Shadowfax", "UrbanCompany"];
  const filteredCompanies = gigCompanies.filter(c => c.toLowerCase().includes(platformSearch.toLowerCase()));

  const selectPlatform = (company: string) => {
     updateForm("platform", company);
     setPlatformSearch(company);
     setShowDropdown(false);
  };

  const handleFileUpload = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setHasScanned(true);
      }, 2500);
    }
  };

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
    setError(null);
    try {
      // 1. Register User
      const userRes = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (!userRes.ok) {
        const errData = await userRes.json().catch(() => ({}));
        throw new Error(errData.detail || "Registration failed");
      }
      
      const userData = await userRes.json();
      localStorage.setItem("worker_phone", formData.phone_number);
      
      // 2. Fetch Initial Quote
      const quoteRes = await fetch("/api/policies/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           platform: formData.platform,
           primary_zone: formData.primary_zone
        })
      });

      if (!quoteRes.ok) throw new Error("Risk Profile Generation Failed");

      const quoteData = await quoteRes.json();
      
      setSuccessData({ user: userData, quote: quoteData });
      setStep(7);
    } catch (err: any) {
      console.error("Registration failed", err);
      setError(err.message || "Connection failed. Please ensure the backend server is running.");
    }
    setIsSubmitting(false);
  };

  const platforms = [
    { id: "Zomato", icon: <Utensils className="w-6 h-6" />, color: "text-red-500", bg: "bg-red-50" },
    { id: "Amazon", icon: <Package className="w-6 h-6" />, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "Zepto", icon: <ShoppingCart className="w-6 h-6" />, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_20px_rgba(250,204,21,0.05)] overflow-y-auto border border-slate-100 p-6 sm:p-12 max-h-[85vh] sm:min-h-[550px] flex flex-col relative overscroll-contain">
      
      {/* Progress Bar with Glow */}
      {step < 7 && (
        <div className="w-full h-1.5 bg-slate-100/50 mt-4 rounded-full overflow-hidden shrink-0 relative">
          <motion.div 
            className="h-full bg-brand-yellow shadow-[0_0_15px_rgba(250,204,21,0.6)]"
            animate={{ width: `${(step / 7) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      )}

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Phone */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ willChange: "transform, opacity" }}>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-slate mb-2">Enter your number</h2>
              <p className="text-slate-500 mb-8 font-medium">We'll send you an OTP to verify your account.</p>
              
              <div className="flex items-center gap-4 bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 focus-within:border-brand-yellow focus-within:bg-white focus-within:shadow-[0_0_30px_rgba(250,204,21,0.15)] transition-all duration-300">
                <span className="text-slate-400 font-black text-xl tracking-tighter">+91</span>
                <input 
                  type="tel"
                  maxLength={10}
                  placeholder="99999 99999"
                  className="bg-transparent w-full text-2xl font-black text-brand-slate border-none focus:outline-none placeholder:text-slate-300"
                  value={formData.phone_number}
                  onChange={(e) => updateForm("phone_number", e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>

              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                disabled={formData.phone_number.length < 10}
                className="w-full mt-8 py-5 bg-brand-slate text-white text-lg font-black rounded-3xl hover:bg-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
              >
                Send OTP <ArrowRight className="w-6 h-6" />
              </motion.button>
            </motion.div>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ willChange: "transform, opacity" }}>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-slate mb-2">Verify OTP</h2>
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
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ willChange: "transform, opacity" }}>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-slate mb-6 sm:mb-8">Tell us about yourself</h2>
              
              <label className="block text-sm font-bold text-brand-slate mb-2">Full Name</label>
              <input 
                type="text"
                placeholder="Rahul Kumar"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold text-brand-slate mb-8 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none"
                value={formData.name}
                onChange={(e) => updateForm("name", e.target.value)}
              />

              <label className="block text-sm font-bold text-brand-slate mb-2">Primary Platform (Search or Type)</label>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="e.g. Swiggy, Uber, Porter..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold text-brand-slate focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none"
                  value={platformSearch}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                     setPlatformSearch(e.target.value);
                     updateForm("platform", e.target.value);
                     setShowDropdown(true);
                  }}
                />
                
                {showDropdown && platformSearch && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto">
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map(c => (
                        <div 
                           key={c}
                           onClick={() => selectPlatform(c)}
                           className="p-4 cursor-pointer hover:bg-slate-50 border-b border-slate-50 text-brand-slate font-bold last:border-b-0"
                        >
                          {c}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-slate-400 font-bold">
                         Press continue to use "{platformSearch}" natively!
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative flex items-center py-6 mt-2">
                 <div className="flex-grow border-t border-slate-100"></div>
                 <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Optional Fast-Track</span>
                 <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {!hasScanned ? (
                <div className={`relative border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center transition-all overflow-hidden ${isScanning ? 'border-brand-yellow bg-brand-yellow/5' : 'border-slate-200 hover:border-brand-yellow/50 bg-slate-50'}`}>
                  
                  {isScanning && (
                    <motion.div 
                      initial={{ top: "-10%" }} 
                      animate={{ top: "110%" }} 
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      style={{ willChange: "top" }}
                      className="absolute w-full h-1 bg-brand-yellow opacity-80 z-10"
                    />
                  )}

                  {isScanning ? (
                    <div className="flex flex-col items-center z-20">
                      <ScanSearch className="w-10 h-10 text-brand-yellow animate-pulse mb-3" />
                      <p className="font-bold text-brand-slate">ShramShield AI Vision</p>
                      <p className="text-sm font-medium text-slate-500">Scanning Document...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center z-20">
                      <UploadCloud className="w-10 h-10 text-slate-300 mb-3 group-hover:text-brand-yellow transition-colors" />
                      <p className="font-bold text-brand-slate text-center">Upload Partner App Screenshot</p>
                      <p className="text-sm font-medium text-slate-500 text-center mb-4">Drop image to Auto-Extract KYC</p>
                      <label className="cursor-pointer bg-white border border-slate-200 px-6 py-2 rounded-full text-sm font-bold text-brand-slate hover:bg-slate-50 transition-all shadow-sm">
                        Choose File
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </label>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="border border-green-200 bg-green-50 rounded-3xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex justify-center items-center shrink-0">
                     <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-green-900 border-b border-green-200/50 pb-1 mb-1">AI Profile Verified</p>
                    <p className="text-sm font-medium text-green-700">Extracted ID Tag: <span className="font-black bg-white px-2 py-0.5 rounded shadow-sm ml-1">{formData.platform_worker_id}</span></p>
                  </div>
                </motion.div>
              )}

              <label className="block text-sm font-black text-brand-slate uppercase tracking-widest mb-2 mt-8 opacity-40">Worker ID / Partner App Tag</label>
              <input 
                 type="text"
                 placeholder="e.g. ABC or Worker-9102"
                 className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 text-xl font-black text-brand-slate uppercase focus:border-brand-yellow focus:bg-white transition-all outline-none"
                 value={formData.platform_worker_id}
                 onChange={(e) => updateForm("platform_worker_id", e.target.value)}
              />

              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setStep(4);
                  setTimeout(() => setStep(5), 2500);
                }}
                disabled={!formData.name || !formData.platform || !formData.platform_worker_id}
                className="w-full mt-10 py-5 bg-brand-yellow text-brand-dark text-lg font-black rounded-3xl hover:bg-black hover:text-white transition-all disabled:opacity-30 flex items-center justify-center gap-2 shadow-xl shadow-brand-yellow/10"
              >
                Continue
              </motion.button>

              {(!formData.name || !formData.platform || !formData.platform_worker_id) && (
                <p className="text-center mt-4 text-xs font-black text-slate-300 uppercase tracking-widest">Please fill all fields to continue</p>
              )}
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ willChange: "opacity" }} className="flex flex-col items-center justify-center py-20 text-center">
               <Loader2 className="w-16 h-16 text-brand-yellow animate-spin mb-6 mx-auto" />
               <h2 className="text-2xl font-black text-brand-slate mb-2">Credential Verification</h2>
               <p className="text-slate-500 font-bold max-w-xs mx-auto">Authorizing employment credentials for worker ID: <span className="text-brand-slate uppercase">{formData.platform_worker_id}</span></p>
            </motion.div>
          )}

          {/* STEP 5: Zone */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ willChange: "transform, opacity" }}>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-slate mb-2">Where do you work?</h2>
              <p className="text-slate-500 mb-8 font-medium">We use this to track local weather and curfews to protect your income automatically.</p>
              
              <div className="flex flex-col gap-4">
                <input 
                  type="text"
                  placeholder="e.g. Bandra, Mumbai"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 text-xl font-black text-brand-slate focus:border-brand-yellow focus:bg-white transition-all outline-none"
                  value={formData.primary_zone}
                  onChange={(e) => updateForm("primary_zone", e.target.value)}
                />
                
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-black">OR</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={autoDetectLocation}
                  disabled={isDetecting}
                  className="w-full p-5 rounded-3xl font-black text-brand-slate transition-all border-2 border-brand-yellow bg-brand-yellow/5 hover:bg-brand-yellow hover:text-brand-dark flex justify-center items-center gap-3 disabled:opacity-30"
                >
                  {isDetecting ? (
                    <><Loader2 className="w-6 h-6 animate-spin"/> Locating Satellite...</>
                  ) : (
                    <>📍 Auto-Detect My Location</>
                  )}
                </motion.button>
              </div>

              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep(6)}
                disabled={!formData.primary_zone}
                className="w-full mt-6 py-5 bg-brand-slate text-white text-lg font-black rounded-3xl hover:bg-black transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                Continue to Payouts
              </motion.button>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ willChange: "transform, opacity" }}>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-slate mb-2">Automated Payouts</h2>
              <p className="text-slate-500 mb-8 font-medium">Where should we route your Parametric Payouts (₹2500) instantly when disaster strikes?</p>
              
              <label className="block text-sm font-bold text-brand-slate mb-2">Active UPI ID</label>
              <input 
                 type="email"
                 placeholder="name@okicici"
                 className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold text-brand-slate mb-8 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/20 outline-none"
                 value={formData.upi_id}
                 onChange={(e) => updateForm("upi_id", e.target.value.toLowerCase())}
              />
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!formData.upi_id.includes("@") || isSubmitting}
                className="w-full py-5 bg-black text-white text-lg font-black rounded-3xl hover:bg-brand-yellow hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-brand-yellow/10"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Finalizing Protection...</>
                ) : (
                  <><ShieldCheck className="w-6 h-6" /> Lock & Generate Plan</>
                )}
              </motion.button>
              
              {error && (
                <p className="text-red-500 text-xs font-black uppercase text-center mt-4 tracking-wider animate-pulse">{error}</p>
              )}
            </motion.div>
          )}

          {/* STEP 7: Success */}
          {step === 7 && (
            <motion.div key="step7" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ willChange: "transform, opacity" }} className="flex flex-col items-center text-center justify-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-brand-slate mb-4">You're In, {formData.name.split(' ')[0]}!</h2>
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

              <a href="/portal">
                <button className="px-8 py-4 bg-brand-slate text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl">
                  Go to Worker Portal
                </button>
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
