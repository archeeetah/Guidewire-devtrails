"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, User, Bot, Globe, ChevronDown, Activity, Settings, ShieldCheck, Search, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Trace {
  type: string;
  name: string;
  args: any;
}

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  trace?: Trace[];
}

type Language = "en" | "hi" | "ta" | "hinglish";

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: "hinglish", label: "HINGLISH" },
  { value: "en", label: "ENG" },
  { value: "hi", label: "हिंदी" },
  { value: "ta", label: "தமிழ்" },
];

const INTENTS: Record<Language, any> = {
  en: {
    title: "ShramShield AOL",
    status: "Autonomous Safety Agent",
    greeting: ["Hello! I'm your ShramShield AOL Liaison. How can I protect your earnings today?", "Hi! I'm monitoring live risks in your zone. How can I help?"],
    quick_replies: ["💰 Payout Status", "🌧️ How it works?", "🛡️ Guard My Zone"]
  },
  hinglish: {
    title: "ShramShield AOL",
    status: "Autonomous Sahayak",
    greeting: ["Namaste! Main ShramShield AOL Liaison hoon. Aaj aapki kamai protect karne mein kaise madad karun?", "Hello! Main aapke zone ke risks monitor kar raha hoon. Kya madad chahiye?"],
    quick_replies: ["💰 Payout Status", "🌧️ Kaise kaam karta hai?", "🛡️ Zone Guard"]
  },
  hi: {
    title: "श्रमशील्ड एओएल",
    status: "स्वचालित सहायक",
    greeting: ["नमस्ते! मैं श्रमशील्ड एओएल संपर्क हूँ। आज मैं आपकी कमाई की सुरक्षा में कैसे मदद कर सकता हूँ?", "नमस्ते! मैं आपके क्षेत्र में जोखिमों की निगरानी कर रहा हूँ।"],
    quick_replies: ["💰 भुगतान स्थिति", "🌧️ यह कैसे काम करता है?", "🛡️ ज़ोन सुरक्षा"]
  },
  ta: {
    title: "ஷிரம்ஷீல்டு AOL",
    status: "தானியங்கி உதவியாளர்",
    greeting: ["வணக்கம்! நான் ஷிரம்ஷீல்டு AOL லயசன். இன்று உங்கள் வருமானத்தை நான் எப்படி பாதுகாக்க முடியும்?", "வணக்கம்! உங்கள் பகுதியில் உள்ள அபாயங்களை நான் கண்காணித்து வருகிறேன்."],
    quick_replies: ["💰 பணம் செலுத்தும் நிலை", "🌧️ இது எப்படி வேலை செய்கிறது?", "🛡️ மண்டல பாதுகாப்பு"]
  }
};

const HIDDEN_ROUTES = ["/login", "/dashboard", "/how-it-works"];

export default function ChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("hinglish"); 
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  // State
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", text: INTENTS["hinglish"].greeting[0] }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTrace, setCurrentTrace] = useState<Trace[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, currentTrace]);

  if (HIDDEN_ROUTES.includes(pathname)) return null;

  const handleLanguageSelect = (newLang: Language) => {
    setLanguage(newLang);
    setShowLangMenu(false);
    setMessages(prev => [
      ...prev, 
      { id: Date.now().toString(), role: "bot", text: INTENTS[newLang].greeting[0] }
    ]);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || inputMessage;
    if (!text.trim()) return;

    const newUserMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage("");
    setIsTyping(true);
    setCurrentTrace([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/agent/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, session_id: sessionId })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Handle Trace viz (Investor Pitch Feature)
        if (data.trace && data.trace.length > 0) {
           setCurrentTrace(data.trace);
           // Brief delay for tool-viz effect
           await new Promise(r => setTimeout(r, 1500));
        }

        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: "bot", 
          text: data.text,
          trace: data.trace 
        }]);
      } else {
        throw new Error(data.message || "AOL Reasoning Failure");
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: "bot", 
        text: "I'm having trouble reasoning with my safety tools right now. Please check if the backend is running at http://127.0.0.1:8000." 
      }]);
    } finally {
      setIsTyping(false);
      setCurrentTrace([]);
    }
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
            className="w-screen sm:w-[420px] h-[100dvh] sm:h-[650px] bg-slate-950 sm:rounded-2xl shadow-2xl border border-slate-800 flex flex-col sm:mb-4 overflow-hidden font-sans relative"
          >
            {/* Header */}
            <div className="bg-slate-900 px-5 py-4 flex items-center justify-between shrink-0 relative z-30 border-b border-slate-800">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                    <Activity className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-sm leading-tight flex items-center gap-1.5">
                      {INTENTS[language].title}
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    </h3>
                    <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest leading-none mt-1.5 font-sans italic">{INTENTS[language].status}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg px-2.5 py-1.5 border border-slate-700"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-300" />
                    <span className="hidden sm:inline text-[10px] font-bold text-white tracking-widest uppercase">
                       {LANG_OPTIONS.find(l => l.value === language)?.label}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 bg-slate-800 rounded-lg">
                     <X className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Language Menu Popover */}
            <AnimatePresence>
              {showLangMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 right-16 z-50 bg-slate-900 border border-slate-800 shadow-2xl rounded-xl w-36 overflow-hidden py-1"
                >
                  {LANG_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleLanguageSelect(opt.value)}
                      className={`w-full text-left px-4 py-2 text-[10px] font-bold tracking-widest transition-colors ${language === opt.value ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Area */}
            <div className="flex-grow p-4 space-y-6 overflow-y-auto bg-slate-950 scroll-smooth no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`flex items-start gap-2.5 max-w-[90%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border ${msg.role === "user" ? "bg-slate-800 border-slate-700" : "bg-blue-600/10 border-blue-500/30"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-slate-300" /> : <ShieldCheck className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-[13px] font-medium leading-relaxed tracking-wide ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-900/20" : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl shadow-black/40"}`}>
                       {msg.text}
                       
                       {/* Embedded Trace Logic for bot messages */}
                       {msg.trace && msg.trace.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col gap-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                              <Settings className="w-3 h-3 text-blue-500" /> Autonomous Reasoning execution
                            </p>
                            <div className="flex flex-wrap gap-2">
                               {msg.trace.map((t, i) => (
                                 <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-md border border-slate-700 text-[10px] font-mono text-blue-300">
                                   <Search className="w-3 h-3" /> {t.name}
                                 </div>
                               ))}
                            </div>
                          </div>
                       )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Active Reasoning Terminal (Live Thinking) */}
              {isTyping && (
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 w-full flex-row">
                    <div className="w-8 h-8 rounded-full shrink-0 bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none w-full max-w-[85%] shadow-xl shadow-black/40">
                       <div className="flex items-center gap-3 mb-3">
                         <div className="flex gap-1">
                           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                         </div>
                         <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">AOL brain is reasoning...</p>
                       </div>
                       
                       {currentTrace.length > 0 && (
                         <div className="space-y-2 border-l-2 border-blue-500/20 pl-4 py-1">
                           {currentTrace.map((t, i) => (
                             <motion.div 
                               initial={{ opacity: 0, x: -10 }}
                               animate={{ opacity: 1, x: 0 }}
                               key={i} 
                               className="text-[11px] font-mono text-slate-400 flex items-center gap-2"
                             >
                               <span className="text-blue-500">▶</span>
                               <span className="text-slate-300">Executing</span> 
                               <span className="text-blue-200">[{t.name}]</span>
                             </motion.div>
                           ))}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Chips */}
            {!isTyping && (
              <div className="px-4 py-3 bg-slate-950 border-t border-slate-900 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
                {INTENTS[language].quick_replies.map((reply: string) => (
                  <button
                    key={reply}
                    onClick={() => handleSendMessage(reply)}
                    className="whitespace-nowrap px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-bold text-slate-300 hover:border-blue-500/50 hover:text-blue-400 transition-all shadow-lg shadow-black/20 active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0 relative z-20">
               <form 
                 onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                 className="flex items-center gap-3"
               >
                 <input 
                   type="text" 
                   value={inputMessage}
                   onChange={(e) => setInputMessage(e.target.value)}
                   placeholder="Query autonomous safety grid..."
                   className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-200 placeholder:text-slate-600"
                 />
                 <button 
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="w-12 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-800 shadow-xl shadow-blue-500/20 flex items-center justify-center transition-all active:scale-90"
                 >
                    <Send className="w-5 h-5" />
                 </button>
               </form>
               <div className="flex items-center justify-between mt-3 px-1">
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                   <ShieldCheck className="w-3 h-3 text-green-500/70" /> SECURE AGENTIC LINK
                 </p>
                 <div className="text-[9px] font-bold text-slate-600 uppercase">
                    Session: {sessionId}
                 </div>
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
          className="w-16 h-16 bg-slate-900 border border-slate-800 text-white rounded-full flex items-center justify-center shadow-2xl shadow-black/60 z-50 transition-all hover:bg-slate-800 m-4 sm:m-0 relative group"
        >
          <Activity className="w-7 h-7 text-blue-500 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-slate-950 animate-pulse" />
        </motion.button>
      )}

    </div>
  );
}
