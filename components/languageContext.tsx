'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../lib/i18n';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.vi;
}
const languageContext = createContext<LanguageContextType | undefined>(undefined);
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('vi');
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  const t = translations[language];
  return (
    <languageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </languageContext.Provider>
  );
}
export function useLanguage() {
  const context = useContext(languageContext);
  if (context === undefined) {
    throw new Error('useLanguage Must Be Used Within A LanguageProvider');
  }
  return context;
}