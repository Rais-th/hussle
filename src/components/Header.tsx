
import React from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ModeToggle } from '@/components/ModeToggle';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="font-semibold text-lg">
          HUSSLE AI
        </div>
        <div className="flex items-center space-x-2">
          <LanguageSelector />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
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
