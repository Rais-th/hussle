
import React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ModeToggle } from '@/components/ModeToggle';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  return (
    <header className="border-b border-white/10">
      <div className="container mx-auto flex h-12 items-center justify-between">
        <div className="font-normal text-sm text-white/70">
          HUSSLE AI
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ModeToggle />
          </ThemeProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
