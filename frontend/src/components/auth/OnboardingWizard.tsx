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

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl shadow-xl overflow-y-auto border border-slate-200 p-8 sm:p-12 max-h-[85vh] sm:min-h-[550px] flex flex-col relative overscroll-contain font-sans">
      
      {/* Progress Bar */}
      {step < 7 && (
        <div className="w-full h-1.5 bg-slate-100 mb-8 rounded-full overflow-hidden shrink-0 relative">
          <motion.div 
            className="h-full bg-blue-600 rounded-full"
            animate={{ width: `${(step / 7) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>
      )}

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Phone */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Create Account</h2>
              <p className="text-slate-500 mb-8 font-medium">We'll send you an OTP to verify your identity.</p>
              
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-300">
                <span className="text-slate-400 font-semibold text-xl">+91</span>
                <input 
                  type="text"
                  maxLength={10}
                  placeholder="Enter mobile number"
                  className="bg-transparent w-full text-xl font-semibold text-slate-900 border-none focus:outline-none placeholder:text-slate-300"
                  value={formData.phone_number}
                  onChange={(e) => updateForm("phone_number", e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={formData.phone_number.length < 10}
                className="w-full mt-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* STEP 2: OTP */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Verify Code</h2>
              <p className="text-slate-500 mb-8 font-medium">Enter the 4-digit code sent to +91 {formData.phone_number}</p>
              
              <div className="flex justify-between gap-4 max-w-xs mx-auto mb-8">
                {[1,2,3,4].map(idx => (
                  <input key={idx} type="text" maxLength={1} defaultValue="1" className="w-14 h-16 text-center text-2xl font-bold bg-white border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-shadow" />
                ))}
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full py-4 bg-slate-900 text-white text-lg font-semibold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center shadow-sm"
              >
                Verify & Proceed
              </motion.button>
            </motion.div>
          )}

          {/* STEP 3: Profile */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 tracking-tight">Professional Details</h2>
              
              <div className="space-y-5">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Legal Name</label>
                    <input 
                      type="text"
                      placeholder="As per government ID"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={formData.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                    />
                 </div>

                 <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Primary App Provider</label>
                    <input 
                      type="text"
                      placeholder="e.g. Swiggy, Uber..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={platformSearch}
                      onFocus={() => setShowDropdown(true)}
                      onChange={(e) => {
                         setPlatformSearch(e.target.value);
                         updateForm("platform", e.target.value);
                         setShowDropdown(true);
                      }}
                    />
                    
                    {showDropdown && platformSearch && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                        {filteredCompanies.length > 0 ? (
                          filteredCompanies.map(c => (
                            <div 
                               key={c}
                               onClick={() => selectPlatform(c)}
                               className="p-3 cursor-pointer hover:bg-slate-50 border-b border-slate-100 text-slate-700 font-semibold text-sm last:border-b-0"
                            >
                              {c}
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-slate-500 font-medium text-sm">
                             Use "{platformSearch}" manually
                          </div>
                        )}
                      </div>
                    )}
                 </div>

                 <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Platform Worker ID</label>
                    <input 
                       type="text"
                       placeholder="e.g. 9102-ABC"
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                       value={formData.platform_worker_id}
                       onChange={(e) => updateForm("platform_worker_id", e.target.value)}
                    />
                 </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setStep(4);
                  setTimeout(() => setStep(5), 2500);
                }}
                disabled={!formData.name || !formData.platform || !formData.platform_worker_id}
                className="w-full mt-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
               key="step4" 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="flex flex-col items-center justify-center py-20 text-center"
            >
               <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
               <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Verifying Partner Identity</h2>
               <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                 Securely validating worker credentials with {formData.platform || "Platform"} database.
               </p>
            </motion.div>
          )}

          {/* STEP 5: Zone */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Operating Context</h2>
              <p className="text-slate-500 mb-8 font-medium">Define your primary delivery zone for localized risk telemetry.</p>
              
              <div className="flex flex-col gap-5">
                <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-2">City / Zone</label>
                   <input 
                     type="text"
                     placeholder="e.g. Bandra, Mumbai"
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                     value={formData.primary_zone}
                     onChange={(e) => updateForm("primary_zone", e.target.value)}
                   />
                </div>
                
                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={autoDetectLocation}
                  disabled={isDetecting}
                  className="w-full p-4 rounded-xl font-semibold text-slate-700 transition-all border border-slate-200 bg-white hover:bg-slate-50 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isDetecting ? (
                    <><Loader2 className="w-5 h-5 animate-spin"/> Locating Satellite...</>
                  ) : (
                    <>📍 Auto-Detect Location</>
                  )}
                </motion.button>
              </div>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(6)}
                disabled={!formData.primary_zone}
                className="w-full mt-8 py-4 bg-slate-900 text-white text-lg font-semibold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                Continue
              </motion.button>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Financial Routing</h2>
              <p className="text-slate-500 mb-8 font-medium">Link your active UPI ID to receive instant parametric payouts.</p>
              
              <div className="mb-8">
                 <label className="block text-sm font-semibold text-slate-700 mb-2">Registered UPI ID</label>
                 <input 
                    type="email"
                    placeholder="name@okicici"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-semibold text-slate-900 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    value={formData.upi_id}
                    onChange={(e) => updateForm("upi_id", e.target.value.toLowerCase())}
                 />
              </div>
              
              <motion.button 
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!formData.upi_id.includes("@") || isSubmitting}
                className="w-full py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Finalizing Profile...</>
                ) : (
                  <>Activate Protection</>
                )}
              </motion.button>
              
              {error && (
                <p className="text-rose-500 text-sm font-semibold text-center mt-4 bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>
              )}
            </motion.div>
          )}

          {step === 7 && successData && (
            <motion.div key="step7" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-4">
               <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
               </div>
               
               <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                 Registration Complete
               </h2>
               <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                 Welcome {formData.name.split(' ')[0]}. Your automated coverage is ready.
               </p>

               <div className="bg-slate-50 rounded-2xl p-8 w-full border border-slate-200 text-left mb-8">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Risk-Adjusted Policy</p>
                  
                  <div className="flex items-baseline gap-2 mb-6 border-b border-slate-200 pb-6">
                     <span className="text-5xl font-bold tracking-tight text-slate-900">₹{successData.quote.final_weekly_premium}</span>
                     <span className="text-slate-500 font-medium text-lg">/week</span>
                  </div>
                  
                  <div className="space-y-3">
                     {successData.quote.risk_factors.map((f: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                           <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> 
                           <span>{f}</span>
                        </div>
                     ))}
                  </div>
               </div>
               
               <a href="/portal" className="w-full">
                  <motion.button 
                     whileTap={{ scale: 0.98 }}
                     className="w-full py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                     Go to Worker Portal <ArrowRight className="w-4 h-4 text-slate-400" />
                  </motion.button>
               </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
