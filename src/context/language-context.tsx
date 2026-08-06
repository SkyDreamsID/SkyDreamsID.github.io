"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionary, Language } from "@/locales/dictionary";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof dictionary.id;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_language") as Language;
    if (savedLang === "id" || savedLang === "en") {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
  };

  const t = dictionary[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback aman kalau dipakai di luar LanguageProvider (misal SSR boundary)
    if (process.env.NODE_ENV === "development") {
      console.warn("useLanguage: dipanggil di luar LanguageProvider, pakai default 'id'");
    }
    return {
      language: "id",
      setLanguage: () => {},
      t: dictionary["id"],
    };
  }
  return context;
}
