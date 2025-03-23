
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
    'select.language': 'Sélectionnez votre langue préférée en haut à droite',
    'what.help': 'Comment puis-je vous aider aujourd\'hui?',
  },
  en: {
    'welcome': 'Welcome to HUSSLE AI',
    'start.conversation': 'Start a conversation by typing a message below. Your conversation history will appear here.',
    'ai.thinking': 'AI is thinking...',
    'enter.to.send': 'Press Enter to send, Shift+Enter for a new line',
    'type.message': 'Type your message here...',
    'select.language': 'Select your preferred language in the top right',
    'what.help': 'What can I help you with today?',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language from localStorage or use browser language or fallback to French
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      return savedLanguage;
    }
    
    // Check browser language
    const browserLanguage = navigator.language.split('-')[0];
    if (browserLanguage === 'en') {
      return 'en';
    }
    
    // Default to French
    return 'fr';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Function to set language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  useEffect(() => {
    // Set HTML lang attribute
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
