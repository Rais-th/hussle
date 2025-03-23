
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const AnimatedWelcome: React.FC = () => {
  const { language, t } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [hasSelected, setHasSelected] = useState(false);

  // Check if user has already selected a language manually
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    // If language is in localStorage, user has made a selection before
    if (savedLanguage) {
      setHasSelected(true);
    }
  }, []);

  // Handle language change animation
  useEffect(() => {
    // Start animation when language changes
    setIsAnimating(true);
    
    // First fade out
    const timer1 = setTimeout(() => {
      setDisplayedText(t('welcome'));
    }, 300);
    
    // Then fade in with new text
    const timer2 = setTimeout(() => {
      setIsAnimating(false);
      // Mark as selected after user changes language
      setHasSelected(true);
    }, 600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [language, t]);

  // Continuous animation until user selects language
  useEffect(() => {
    // Only animate if user hasn't selected a language yet
    if (!hasSelected) {
      const animationInterval = setInterval(() => {
        setIsAnimating(true);
        
        setTimeout(() => {
          setDisplayedText(language === 'en' ? 'Welcome to HUSSLE AI' : 'Bienvenue sur HUSSLE AI');
        }, 300);
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 600);
        
        setTimeout(() => {
          setIsAnimating(true);
        }, 2500);
        
        setTimeout(() => {
          setDisplayedText(language === 'en' ? 'Bienvenue sur HUSSLE AI' : 'Welcome to HUSSLE AI');
        }, 2800);
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 3100);
      }, 5000);
      
      return () => clearInterval(animationInterval);
    }
  }, [hasSelected, language]);

  // Initialize text on first render
  useEffect(() => {
    setDisplayedText(t('welcome'));
  }, []);

  return (
    <h2 
      className={`text-xl sm:text-2xl font-normal mb-3 text-white transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
    >
      {displayedText}
    </h2>
  );
};

export default AnimatedWelcome;
