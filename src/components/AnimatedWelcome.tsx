
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const AnimatedWelcome: React.FC = () => {
  const { language, t } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedText, setDisplayedText] = useState<string>('');

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
    }, 600);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [language, t]);

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
