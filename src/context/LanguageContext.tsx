import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const translations = {
  fr: {
    'welcome': 'Bienvenue sur HUSSLE AI',
    'start.conversation': 'Commencez une conversation en tapant un message ci-dessous. Votre historique de conversation apparaîtra ici.',
    'ai.thinking': 'L\'IA réfléchit...',
    'enter.to.send': 'Appuyez sur Entrée pour envoyer, Maj+Entrée pour un saut de ligne',
    'type.message': 'Tapez votre message ici...',
    'select.language': 'Langue',
    'what.help': 'Comment puis-je vous aider?',
    'join.community': 'Rejoindre la communauté AI gratuite',
  },
  en: {
    'welcome': 'Welcome to HUSSLE AI',
    'start.conversation': 'Start a conversation by typing a message below. Your conversation history will appear here.',
    'ai.thinking': 'AI is thinking...',
    'enter.to.send': 'Press Enter to send, Shift+Enter for a new line',
    'type.message': 'Type your message here...',
    'select.language': 'Language',
    'what.help': 'How can I help?',
    'join.community': 'Join the Free AI Community',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      return savedLanguage;
    }
    
    const browserLanguage = navigator.language.split('-')[0];
    if (browserLanguage === 'en') {
      return 'en';
    }
    
    return 'fr';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
