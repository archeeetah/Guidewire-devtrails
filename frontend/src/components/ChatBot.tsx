"use client";

import { useState, useRef, useEffect } from "react";
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

const TRANSLATIONS = {
  en: {
    title: "ShramShield AI",
    status: "Available 24/7",
    placeholder: "Ask about coverage or payouts...",
    footer: "AI Verified Parametric System",
    greeting: "Hello! I'm the ShramShield AI Assistant. You can ask me general questions about coverage, or check your payment/delay status by providing your registered phone number.",
    clarify: "I'm sorry, I didn't quite catch that. Could you clarify your question about coverage or payouts?",
    payment_processed: "I have checked the system for the provided number. Your payment was processed automatically via the IMD rainfall trigger but is currently pending in the UPI gateway queue. It should reflect in your account within the next 2-4 hours. We apologize for the delay!",
    payment_ask_number: "To check on a delayed payment or specific transaction status, please type your registered 10-digit phone number so I can look it up in the parametric ledger.",
    how_it_works: "ShramShield works by monitoring live satellite and weather data. If extreme weather or a curfew happens in your zone, we automatically trigger a payout to your UPI ID!",
    pricing: "Our plans start at just ₹49/week for our Flex Lite protection, passing up to ₹99/week for the Gig Pro coverage.",
    support: "If you need human assistance, you can email us at help@shramshield.in or call our 24/7 hotline at 1800-SHRAM-HELP.",
    hello: "Hi there! How can I assist you with your ShramShield protection today?"
  },
  hinglish: {
    title: "ShramShield AI",
    status: "24/7 Available",
    placeholder: "Coverage ya payment ke baare mein puchein...",
    footer: "AI Verified Parametric System",
    greeting: "Hello! Main ShramShield AI Assistant hoon. Aap coverage ke baare mein sawal pooch sakte hain, ya apna registered phone number bata kar payment ka status check kar sakte hain.",
    clarify: "Sorry, mujhe theek se samajh nahi aaya. Kya aap apna sawal thoda clear kar sakte hain?",
    payment_processed: "Maine system mein aapka number check kar liya hai. Aapka payment auto-process ho gaya tha IMD rain trigger se, par abhi UPI gateway mein pending hai. Ye agle 2-4 hours mein aapke account mein aa jayega. Delay ke liye maafi chahte hain!",
    payment_ask_number: "Apna delayed payment ya transaction status check karne ke liye, please apna 10-digit registered phone number type karein taaki main ledger mein check kar sakun.",
    how_it_works: "ShramShield live satellite aur weather data monitor karta hai. Agar aapke zone mein extreme weather ya curfew hota hai, toh hum automatically aapke UPI ID par payout bhej dete hain!",
    pricing: "Hamare plans bas ₹49/week se start hote hain Flex Lite list ke liye, aur ₹99/week tak jaate hain Gig Pro coverage ke liye.",
    support: "Agar aapko kisi ki help chahiye, toh aap help@shramshield.in par email kar sakte hain ya hamare 24/7 hotline 1800-SHRAM-HELP par call kar sakte hain.",
    hello: "Hi! Main aaj aapki ShramShield protection mein kaise help kar sakta hoon?"
  },
  hi: {
    title: "श्रमशील्ड एआई",
    status: "24/7 उपलब्ध",
    placeholder: "कवरेज या भुगतान के बारे में पूछें...",
    footer: "एआई सत्यापित पैरामीट्रिक प्रणाली",
    greeting: "नमस्ते! मैं श्रमशील्ड एआई असिस्टेंट हूँ। आप कवरेज के बारे में पूछ सकते हैं, या अपना पंजीकृत फोन नंबर देकर भुगतान/देरी की स्थिति की जांच कर सकते हैं।",
    clarify: "क्षमा करें, मैं समझ नहीं पाया। क्या आप कवरेज या भुगतान के बारे में अपना प्रश्न स्पष्ट कर सकते हैं?",
    payment_processed: "मैंने दिए गए नंबर के लिए सिस्टम की जांच की है। आपका भुगतान बारिश ट्रिगर के माध्यम से स्वचालित रूप से किया गया था, लेकिन UPI गेटवे कतार में लंबित है। यह अगले 2-4 घंटों के भीतर आपके खाते में दिखाई देगा। देरी के लिए हमें खेद है!",
    payment_ask_number: "विलंबित भुगतान या लेनदेन की स्थिति की जांच करने के लिए, कृपया अपना पंजीकृत 10 अंकों का फोन नंबर टाइप करें ताकि मैं खाता बही में देख सकूं।",
    how_it_works: "श्रमशील्ड उपग्रह और मौसम डेटा की निगरानी करके काम करता है। यदि आपके क्षेत्र में अत्यधिक मौसम होता है, तो हम स्वचालित रूप से आपके UPI ID पर भुगतान करते हैं!",
    pricing: "हमारी योजनाएं फ्लेक्स लाइट के लिए ₹49/सप्ताह से शुरू होती हैं, और गिग प्रो कवरेज के लिए ₹99/सप्ताह तक जाती हैं।",
    support: "यदि आपको सहायता की आवश्यकता है, तो आप help@shramshield.in पर ईमेल कर सकते हैं या 1800-SHRAM-HELP पर कॉल कर सकते हैं।",
    hello: "नमस्ते! आज मैं आपकी श्रमशील्ड सुरक्षा में कैसे सहायता कर सकता हूँ?"
  },
  ta: {
    title: "ஷிரம்ஷீல்டு AI",
    status: "24/7 கிடைக்கும்",
    placeholder: "கவரேஜ் அல்லது பணம் செலுத்தல்கள் பற்றி கேளுங்கள்...",
    footer: "AI சரிபார்க்கப்பட்ட பாராமெட்ரிக் அமைப்பு",
    greeting: "வணக்கம்! நான் ஷிரம்ஷீல்டு AI உதவியாளர். நீங்கள் கவரேஜ் பற்றி பொதுவான கேள்விகளைக் கேட்கலாம், அல்லது உங்கள் பதிவு செய்யப்பட்ட தொலைபேசி எண்ணை வழங்கி உங்கள் கட்டணம்/தாமத நிலையைச் சரிபார்க்கலாம்.",
    clarify: "மன்னிக்கவும், எனக்கு புரியவில்லை. கவரேஜ் அல்லது பணம் செலுத்துதல் பற்றிய உங்கள் கேள்வியை தெளிவுபடுத்த முடியுமா?",
    payment_processed: "வழங்கப்பட்ட எண்ணிற்கான கணினியை நான் சரிபார்த்தேன். உங்கள் கட்டணம் மழையின் தூண்டுதல் மூலம் தானாகவே செயலாக்கப்பட்டது, ஆனால் தற்போது UPI கேட்வே வரிசையில் நிலுவையில் உள்ளது. இது அடுத்த 2-4 மணி நேரத்திற்குள் உங்கள் கணக்கில் பிரதிபலிக்கும். தாமதத்திற்கு வருந்துகிறோம்!",
    payment_ask_number: "தாமதமான கட்டணம் அல்லது குறிப்பிட்ட பரிவர்த்தனை நிலையைச் சரிபார்க்க, உங்கள் பதிவு செய்யப்பட்ட 10 இலக்க தொலைபேசி எண்ணை தட்டச்சு செய்யவும்.",
    how_it_works: "ஷிரம்ஷீல்டு நேரடி செயற்கைக்கோள் மற்றும் வானிலை தரவுகளை கண்காணிப்பதன் மூலம் செயல்படுகிறது. உங்கள் மண்டலத்தில் மோசமான வானிலை ஏற்பட்டால், உங்கள் UPI ஐடிக்கு தானாகவே பணம் செலுத்துவோம்!",
    pricing: "எங்கள் திட்டங்கள் Flex Lite பாதுகாப்பிற்காக வாரத்திற்கு ₹49 இல் தொடங்குகின்றன, Gig Pro கவரேஜுக்கு வாரத்திற்கு ₹99 வரை செல்கின்றன.",
    support: "உங்களுக்கு மனித உதவி தேவைப்பட்டால், நீங்கள் help@shramshield.in இல் எங்களுக்கு மின்னஞ்சல் அனுப்பலாம் அல்லது எங்களின் 24/7 ஹாட்லைனை 1800-SHRAM-HELP இல் அழைக்கலாம்.",
    hello: "வணக்கம்! இன்று உங்கள் ஷிரம்ஷீல்டு பாதுகாப்பிற்கு நான் எவ்வாறு உதவ முடியும்?"
  }
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("hinglish"); 
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", text: TRANSLATIONS["hinglish"].greeting }
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

  const handleLanguageSelect = (newLang: Language) => {
    setLanguage(newLang);
    setShowLangMenu(false);
    // Add translation notice
    setMessages(prev => [
      ...prev, 
      { id: Date.now().toString(), role: "bot", text: TRANSLATIONS[newLang].greeting }
    ]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), role: "user", text: inputMessage.trim() };
    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage("");
    setIsTyping(true);

    // AI Response Logic Simulation
    setTimeout(() => {
      let botResponse = TRANSLATIONS[language].clarify;
      const lowerInput = newUserMsg.text.toLowerCase();

      if (
        lowerInput.includes("payment") || lowerInput.includes("status") || lowerInput.includes("delay") ||
        lowerInput.includes("bhugtan") || lowerInput.includes("paisa") || lowerInput.includes("ruka") ||
        lowerInput.includes("kattanam") || lowerInput.includes("nilai") || lowerInput.includes("kab aayega")
      ) {
         if (lowerInput.match(/\d{10}/)) {
           botResponse = TRANSLATIONS[language].payment_processed;
         } else {
           botResponse = TRANSLATIONS[language].payment_ask_number;
         }
      } else if (
        (lowerInput.includes("how") && lowerInput.includes("work")) || 
        lowerInput.includes("kaise") || lowerInput.includes("eppadi") || lowerInput.includes("kya hai")
      ) {
         botResponse = TRANSLATIONS[language].how_it_works;
      } else if (
        lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("premium") || 
        lowerInput.includes("daam") || lowerInput.includes("kitna") || lowerInput.includes("vilai") || lowerInput.includes("plan")
      ) {
         botResponse = TRANSLATIONS[language].pricing;
      } else if (
        lowerInput.includes("help") || lowerInput.includes("human") || lowerInput.includes("support") || 
        lowerInput.includes("madad") || lowerInput.includes("udhavi") || lowerInput.includes("baat")
      ) {
         botResponse = TRANSLATIONS[language].support;
      } else if (
        lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("namaste") || lowerInput.includes("vanakkam")
      ) {
         botResponse = TRANSLATIONS[language].hello;
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: "bot", text: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[340px] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col mb-4 overflow-hidden font-sans relative"
          >
            {/* Custom Language Dropdown Menu */}
            <AnimatePresence>
              {showLangMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="absolute inset-0 z-40 bg-slate-900/10"
                    onClick={() => setShowLangMenu(false)}
                  />
                  {/* Dropdown Card */}
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
                         className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${language === opt.value ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                       >
                         {opt.label}
                       </button>
                     ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between shrink-0 relative z-30">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm leading-tight">{TRANSLATIONS[language].title}</h3>
                    <p className="text-blue-300 text-[10px] font-medium uppercase tracking-widest">{TRANSLATIONS[language].status}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                  {/* Custom Language Button */}
                  <button 
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg px-2.5 py-1.5 border border-slate-700"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-[11px] font-semibold text-white tracking-widest uppercase">
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
            <div className="flex-grow p-5 space-y-4 overflow-y-auto bg-slate-50 relative z-20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 w-full ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-slate-200" : "bg-blue-100"}`}>
                    {msg.role === "user" ? <User className="w-3.5 h-3.5 text-slate-600" /> : <Bot className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm font-medium leading-relaxed max-w-[80%] ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"}`}>
                     {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3 w-full flex-row">
                  <div className="w-7 h-7 rounded-full shrink-0 bg-blue-100 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[42px]">
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                     <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

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
                   placeholder={TRANSLATIONS[language].placeholder}
                   className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-800"
                 />
                 <button 
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-400 transition-colors shrink-0"
                 >
                    <Send className="w-4 h-4 ml-0.5" />
                 </button>
               </form>
               <div className="text-center mt-3">
                 <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                   {TRANSLATIONS[language].footer}
                 </p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-slate-900 border border-slate-800 text-white rounded-full flex items-center justify-center shadow-lg shadow-slate-900/20 z-50 transition-colors hover:bg-slate-800"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>

    </div>
  );
}
