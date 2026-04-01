"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, User, Bot, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

type Language = "en" | "hi" | "ta" | "hinglish";

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: "hinglish", label: "HINGLISH" },
  { value: "en", label: "ENG" },
  { value: "hi", label: "हिंदी" },
  { value: "ta", label: "தமிழ்" },
];

const INTENTS = {
  en: {
    title: "ShramShield AI",
    status: "Active Safety Bot",
    greeting: ["Hello! I'm your ShramShield AI Assistant. How can I help you protect your earnings today?", "Hi there! I'm here to help with your weekly coverage and payouts. What's on your mind?"],
    payout_status: {
      ask_number: "To check your parametric payout status, please provide your 10-digit registered phone number (e.g., 9876543210).",
      success: "I've checked the parametric ledger. Your payout was triggered by the rainfall sensors and is currently in the UPI processing queue. You should see it in your account within 2-4 hours!",
      not_found: "I couldn't find an active trigger for that number. Please ensure your weekly plan is active or check if the weather threshold (30mm rain) was met in your zone."
    },
    how_it_works: "ShramShield uses real-time weather sensors. If it rains >30mm or heat crosses 45°C in your zone while you're active, we send money to your UPI instantly—no claims needed!",
    pricing: "Our plans are dynamic! Flex Lite starts at ₹49/week (₹1,500 payout) and our Gig Pro plan is ₹99/week (₹2,500 payout). The exact price depends on your zone's risk history for the upcoming week.",
    vision_ai: "To verify your ID, please go to the Onboarding page. Our Vision AI will scan your Aadhaar or DL automatically. Make sure the lighting is good!",
    safety: "Your safety is priority. If AQI is above 400 or rain is heavy, our Risk Radar will alert you. Stay safe, we'll cover the income loss.",
    clarify: "I'm still learning! Could you ask about payouts, pricing, or how the weather triggers work?",
    quick_replies: ["💰 Payout Status", "🌧️ How it works?", "📉 Check Prices", "🛡️ Vision AI Help"]
  },
  hinglish: {
    title: "ShramShield AI",
    status: "24/7 Sahayak",
    greeting: ["Namaste! Main ShramShield AI Assistant hoon. Aaj aapki kamai protect karne mein kaise madad karun?", "Hello! Coverage ya payouts se juda koi bhi sawal ho, toh bejhijhak puchein."],
    payout_status: {
      ask_number: "Apna payout status check karne ke liye, please apna 10-digit registered phone number type karein.",
      success: "Maine ledger check kiya hai. Aapka payout rainfall sensor se trigger ho chuka hai aur abhi UPI queue mein hai. 2-4 hours mein aapke account mein aa jayega!",
      not_found: "Is number par koi active trigger nahi mila. Check karein ki aapka weekly plan active hai ya nahi, aur weather conditions thresholds se upar thi ya nahi."
    },
    how_it_works: "ShramShield real-time weather sensors use karta hai. Agar aapke zone mein 30mm se zyada baarish ya 45°C garmi hoti hai, toh hum turant UPI payout bhejte hain!",
    pricing: "Humare plans dynamic hain! Flex Lite ₹49/week (₹1,500 payout) se shuru hota hai aur Gig Pro ₹99/week (₹2,500 payout) hai. Exact price aapke zone ke risk par depend karta hai.",
    vision_ai: "ID verify karne ke liye Onboarding page par jayein. Humara Vision AI aapka Aadhaar ya DL automatically scan kar lega. Lighting achi honi chahiye!",
    safety: "Aapki safety sabse pehle hai. Agar AQI 400 se upar hai ya baarish tez hai, toh Risk Radar aapko alert karega. Tension na lein, income loss hum handle karenge.",
    clarify: "Maafi chahte hain! Kya aap payouts, pricing ya parametric triggers ke baare mein pooch sakte hain?",
    quick_replies: ["💰 Payout Status", "🌧️ Kaise kaam karta hai?", "📉 Plan ki Kimat", "🛡️ ID Verification"]
  },
  hi: {
    title: "श्रमशील्ड एआई",
    status: "एआई सहायक",
    greeting: ["नमस्ते! मैं श्रमशील्ड एआई सहायक हूँ। आज आपकी कमाई सुरक्षित करने में मैं आपकी कैसे मदद कर सकता हूँ?", "नमस्ते! आपकी साप्ताहिक कवरेज और भुगतान के बारे में मदद के लिए मैं यहाँ हूँ।"],
    payout_status: {
      ask_number: "अपने भुगतान की स्थिति जांचने के लिए, कृपया अपना 10 अंकों का पंजीकृत फोन नंबर प्रदान करें।",
      success: "मैंने लेज़र की जाँच की है। आपका भुगतान वर्षा सेंसर द्वारा शुरू किया गया था और वर्तमान में UPI प्रोसेसिंग कतार में है। आपको यह 2-4 घंटों में मिल जाना चाहिए!",
      not_found: "मुझे उस नंबर के लिए कोई सक्रिय ट्रिगर नहीं मिला। कृपया सुनिश्चित करें कि आपकी योजना सक्रिय है।"
    },
    how_it_works: "श्रमशील्ड वास्तविक समय के मौसम सेंसर का उपयोग करता है। यदि आपके क्षेत्र में 30mm से अधिक बारिश होती है, तो हम तुरंत भुगतान भेजते हैं!",
    pricing: "हमारी योजनाएं गतिशील हैं! फ्लेक्स लाइट ₹49/सप्ताह (₹1,500 भुगतान) से शुरू होती है और गिग प्रो ₹99/सप्ताह (₹2,500 भुगतान) है।",
    vision_ai: "अपनी आईडी सत्यापित करने के लिए ऑनबोर्डिंग पेज पर जाएं। हमारा विजन एआई आपके दस्तावेज़ को स्वचालित रूप से स्कैन करेगा।",
    safety: "आपकी सुरक्षा हमारी प्राथमिकता है। यदि एक्यूआई 400 से ऊपर है, तो रिस्क रडार आपको सचेत करेगा। सुरक्षित रहें, हम आय के नुकसान की भरपाई करेंगे।",
    clarify: "मैं अभी सीख रहा हूँ! क्या आप भुगतान, मूल्य निर्धारण या मौसम ट्रिगर के बारे में पूछ सकते हैं?",
    quick_replies: ["💰 भुगतान की स्थिति", "🌧️ यह कैसे काम करता है?", "📉 कीमतों की जांच", "🛡️ आईडी सहायता"]
  },
  ta: {
    title: "ஷிரம்ஷீல்டு AI",
    status: "24/7 உதவி",
    greeting: ["வணக்கம்! நான் ஷிரம்ஷீல்டு AI உதவியாளர். உங்கள் வருமானத்தைப் பாதுகாக்க நான் இன்று உங்களுக்கு எப்படி உதவ முடியும்?", "வணக்கம்! உங்கள் வாராந்திர கவரேஜ் மற்றும் பணம் செலுத்துதலில் உதவ நான் இங்கே இருக்கிறேன்."],
    payout_status: {
      ask_number: "உங்கள் பணம் செலுத்தும் நிலையைச் சரிபார்க்க, உங்கள் 10 இலக்க பதிவு செய்யப்பட்ட தொலைபேசி எண்ணை வழங்கவும்.",
      success: "நான் லெட்ஜரைச் சரிபார்த்தேன். உங்கள் கட்டணம் மழைக்கால சென்சார்களால் தூண்டப்பட்டது, தற்போது UPI வரிசையில் உள்ளது. 2-4 மணி நேரத்திற்குள் உங்கள் கணக்கிற்கு வரும்!",
      not_found: "அந்த எண்ணிற்கான செயலில் உள்ள ட்ரிக்கர் எதையும் என்னால் கண்டுபிடிக்க முடியவில்லை."
    },
    how_it_works: "ஷிரம்ஷீல்டு நிகழ்நேர வானிலை சென்சார்களைப் பயன்படுத்துகிறது. உங்கள் மண்டலத்தில் 30 மிமீக்கு மேல் மழை பெய்தால், நாங்கள் உடனடியாக பணம் செலுத்துவோம்!",
    pricing: "எங்கள் திட்டங்கள் Flex Lite வாரத்திற்கு ₹49 (₹1,500 payout) மற்றும் Gig Pro வாரத்திற்கு ₹99 (₹2,500 payout) ஆகும்.",
    vision_ai: "உங்கள் ஐடியைச் சரிபார்க்க, ஆன்போர்டிங் பக்கத்திற்குச் செல்லவும். எங்கள் விஷன் AI உங்கள் ஆவணத்தை தானாகவே ஸேன் செய்யும்.",
    safety: "உங்கள் பாதுகாப்பு முன்னுரிமை. AQI 400க்கு மேல் இருந்தால், ரிஸ்க் ரேடார் உங்களை எச்சரிக்கும். பாதுகாப்பாக இருங்கள்.",
    clarify: "நான் இன்னும் கற்றுக்கொண்டிருக்கிறேன்! பணம் செலுத்துதல் அல்லது வானிலை பற்றி கேட்க முடியுமா?",
    quick_replies: ["💰 நிலையைச் சரிபார்க்க", "🌧️ இது எப்படி வேலை செய்கிறது?", "📉 விலையைச் சரிபார்க்க", "🛡️ ஐடி உதவி"]
  }
};

const HIDDEN_ROUTES = ["/login", "/dashboard", "/how-it-works"];

export default function ChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("hinglish"); 
  const [showLangMenu, setShowLangMenu] = useState(false);

  // State
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", text: INTENTS["hinglish"].greeting[0] }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (HIDDEN_ROUTES.includes(pathname)) return null;

  const generateResponse = (input: string, lang: Language) => {
    const lower = input.toLowerCase();
    const data = INTENTS[lang];

    // Payout / Number check
    if (lower.match(/\d{10}/)) return data.payout_status.success;
    if (lower.includes("payment") || lower.includes("payout") || lower.includes("status") || lower.includes("paisa") || lower.includes("ruka") || lower.includes("kab aayega") || lower.includes("kattanam")) {
      return data.payout_status.ask_number;
    }

    // How it works
    if (lower.includes("how") || lower.includes("work") || lower.includes("kaise") || lower.includes("eppadi") || lower.includes("kya hai")) {
      return data.how_it_works;
    }

    // Pricing
    if (lower.includes("price") || lower.includes("cost") || lower.includes("premium") || lower.includes("daam") || lower.includes("kitna") || lower.includes("plan") || lower.includes("vilai")) {
      return data.pricing;
    }

    // Vision AI / ID
    if (lower.includes("id") || lower.includes("verify") || lower.includes("document") || lower.includes("aadhar") || lower.includes("scan") || lower.includes("verification")) {
      return data.vision_ai;
    }

    // Safety / AQI
    if (lower.includes("safe") || lower.includes("rain") || lower.includes("aqi") || lower.includes("weather") || lower.includes("danger") || lower.includes("suraksha")) {
      return data.safety;
    }

    // Greetings
    if (lower.includes("hi") || lower.includes("hello") || lower.includes("namaste") || lower.includes("hey") || lower.includes("vanakkam")) {
      return data.greeting[Math.floor(Math.random() * data.greeting.length)];
    }

    return data.clarify;
  };

  const handleLanguageSelect = (newLang: Language) => {
    setLanguage(newLang);
    setShowLangMenu(false);
    setMessages(prev => [
      ...prev, 
      { id: Date.now().toString(), role: "bot", text: INTENTS[newLang].greeting[0] }
    ]);
  };

  const handleSendMessage = (textOverride?: string) => {
    const text = textOverride || inputMessage;
    if (!text.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text, language);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "bot", text: response }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-screen sm:w-[400px] h-[100dvh] sm:h-[550px] bg-white sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col sm:mb-4 overflow-hidden font-sans relative"
          >
            {/* Custom Language Dropdown Menu */}
            <AnimatePresence>
              {showLangMenu && (
                <>
                  <div 
                    className="absolute inset-0 z-40 bg-slate-900/10"
                    onClick={() => setShowLangMenu(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-16 right-10 z-50 bg-white border border-slate-200 shadow-xl rounded-xl w-36 overflow-hidden py-1"
                  >
                     {LANG_OPTIONS.map((opt) => (
                       <button
                         key={opt.value}
                         onClick={() => handleLanguageSelect(opt.value)}
                         className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${language === opt.value ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                       >
                         {opt.label}
                       </button>
                     ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between shrink-0 relative z-30 shadow-lg">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-sm leading-tight truncate">{INTENTS[language].title}</h3>
                    <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest leading-none mt-1.5 font-sans italic">{INTENTS[language].status}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg px-2 py-1.5 border border-slate-700"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-300" />
                    <span className="hidden sm:inline text-[10px] font-bold text-white tracking-widest uppercase">
                       {LANG_OPTIONS.find(l => l.value === language)?.label}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1">
                     <X className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50 relative z-20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-2.5 w-full ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-slate-200" : "bg-blue-600"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`p-3.5 rounded-2xl text-[13px] font-medium leading-relaxed max-w-[85%] shadow-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"}`}>
                     {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-2.5 w-full flex-row">
                  <div className="w-8 h-8 rounded-full shrink-0 bg-blue-600 flex items-center justify-center shadow-sm">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 h-[42px]">
                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips */}
            {!isTyping && (
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
                {INTENTS[language].quick_replies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSendMessage(reply)}
                    className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0 relative z-20">
               <form 
                 onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                 className="flex items-center gap-2"
               >
                 <input 
                   type="text" 
                   value={inputMessage}
                   onChange={(e) => setInputMessage(e.target.value)}
                   placeholder={language === 'en' ? "Type your query here..." : "Yahan puchein..."}
                   className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-slate-800"
                 />
                 <button 
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="w-11 h-11 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 shadow-md shadow-blue-500/20 flex items-center justify-center transition-all active:scale-95"
                 >
                    <Send className="w-4 h-4" />
                 </button>
               </form>
               <div className="text-center mt-3">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                   SECURE PARAMETRIC ASSISTANT
                 </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-slate-900 border border-slate-800 text-white rounded-full flex items-center justify-center shadow-lg shadow-slate-900/40 z-50 transition-colors hover:bg-slate-800 m-4 sm:m-0"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

    </div>
  );
}
