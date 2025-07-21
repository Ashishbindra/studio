'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translateUi } from '@/ai/flows/translate-ui';
import { uiContent, UIContentKeys } from '@/lib/localization';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  translations: Record<UIContentKeys, string>;
  setLanguage: (lang: Language) => void;
  t: (key: UIContentKeys) => string;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<UIContentKeys, string>>({ ...uiContent });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language | null;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    if (lang === language) return;

    setLoading(true);
    localStorage.setItem('language', lang);
    setLanguageState(lang);

    if (lang === 'en') {
      setTranslations({ ...uiContent });
      setLoading(false);
      return;
    }

    const cachedTranslations = localStorage.getItem(`translations_${lang}`);
    if (cachedTranslations) {
      setTranslations(JSON.parse(cachedTranslations));
      setLoading(false);
      return;
    }

    try {
      const newTranslations: Partial<Record<UIContentKeys, string>> = {};
      const translationPromises = Object.entries(uiContent).map(async ([key, value]) => {
        const result = await translateUi({ text: value, targetLanguage: lang });
        if (result.translatedText) {
          newTranslations[key as UIContentKeys] = result.translatedText;
        }
      });

      await Promise.all(translationPromises);

      const fullTranslations = { ...uiContent, ...newTranslations };
      setTranslations(fullTranslations);
      localStorage.setItem(`translations_${lang}`, JSON.stringify(fullTranslations));
    } catch (error) {
      console.error("Failed to translate UI:", error);
      // Fallback to English
      setTranslations({ ...uiContent });
    } finally {
      setLoading(false);
    }
  }, [language]);

  const t = useCallback((key: UIContentKeys): string => {
    return translations[key] || uiContent[key];
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage, t, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
