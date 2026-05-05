'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import fr from '@/locales/fr.json';
import en from '@/locales/en.json';
import de from '@/locales/de.json';

type Translations = typeof fr;

interface LanguageContextType {
  t: (path: string) => string;
  language: string;
  setLanguage: (lang: string) => void;
}

const translations: Record<string, any> = { fr, en, de };
const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // On initialise avec une valeur temporaire pour éviter les erreurs de montage
  const [language, setLanguageState] = useState('fr');

  useEffect(() => {
    // 1. Check localStorage
    const saved = localStorage.getItem('app_lang');
    if (saved && translations[saved]) {
      setLanguageState(saved);
    } else {
      // 2. Check navigateur (ex: "fr-FR" -> "fr")
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('app_lang', lang);
    }
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      if (!result || result[key] === undefined) return path;
      result = result[key];
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) return { t: (s: string) => s, language: 'fr', setLanguage: () => {} };
  return context;
}