import { useState, useEffect, useCallback } from 'react';

type LanguageCode = 'en' | 'hi' | 'ta';

export const useVoiceAccessibility = (initialLang: LanguageCode = 'en') => {
  const [lang, setLang] = useState<LanguageCode>(initialLang);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  const getLanguageTag = (code: LanguageCode) => {
    switch (code) {
      case 'hi': return 'hi-IN';
      case 'ta': return 'ta-IN';
      default: return 'en-IN';
    }
  };

  const speak = useCallback((text: string, overrideLang?: LanguageCode) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;

    // Cancel existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = getLanguageTag(overrideLang || lang);
    utterance.lang = targetLang;
    
    // Attempt to find a native voice for the language
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === targetLang || v.lang.startsWith(targetLang.split('-')[0]));
    if (voice) utterance.voice = voice;

    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }, [lang, isVoiceEnabled]);

  return { lang, setLang, speak, isVoiceEnabled, setIsVoiceEnabled };
};
