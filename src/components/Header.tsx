
import React from 'react';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#1a1a1a]">
      <div className="container mx-auto flex h-12 items-center justify-between">
        <div className="font-normal text-sm text-white/70">
          HUSSLE AI
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
