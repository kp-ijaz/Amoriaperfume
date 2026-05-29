'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Lang, tr, trArray, type TranslationKey } from '@/lib/i18n/translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  tArr: (key: TranslationKey) => string[];
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => tr(key, 'en'),
  tArr: (key) => trArray(key, 'en'),
  isRTL: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('amoria_lang') as Lang | null;
    if (saved === 'en' || saved === 'ar') {
      setLangState(saved);
      applyDirection(saved);
    }
  }, []);

  function setLang(newLang: Lang) {
    setLangState(newLang);
    localStorage.setItem('amoria_lang', newLang);
    applyDirection(newLang);
  }

  const isRTL = lang === 'ar';

  const value: LanguageContextValue = {
    lang,
    setLang,
    t: (key) => tr(key, lang),
    tArr: (key) => trArray(key, lang),
    isRTL,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function applyDirection(lang: Lang) {
  const html = document.documentElement;
  if (lang === 'ar') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
  }
}

export function useLanguage() {
  return useContext(LanguageContext);
}
