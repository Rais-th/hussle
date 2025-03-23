
import React, { useEffect, useRef } from 'react';
import { ChatProvider, useChat } from '@/context/ChatContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';

const ChatContainer: React.FC = () => {
  const { messages, isLoading } = useChat();
  const { t, language, setLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Ensure messages are scrolled into view when new ones are added
  useEffect(() => {
    if (containerRef.current && messages.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)] bg-[#1a1a1a] pt-6 sm:pt-12">
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto scrollbar-hide pb-4 sm:pb-6"
        style={{ maxHeight: 'calc(100vh - 140px)' }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 text-center py-[80px] sm:py-[120px]">
            <h2 className="text-xl sm:text-2xl font-normal mb-3 text-white">
              {t('welcome')}
            </h2>
            <div className="mb-2">
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as 'en' | 'fr')}
              >
                <SelectTrigger className="w-[140px] bg-neutral-800 border-neutral-700 text-white">
                  <Languages className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t('select.language')} />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectItem value="fr" className="hover:bg-neutral-700 focus:bg-neutral-700 cursor-pointer">
                    🇫🇷 Français
                  </SelectItem>
                  <SelectItem value="en" className="hover:bg-neutral-700 focus:bg-neutral-700 cursor-pointer">
                    🇬🇧 English
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <h3 className="text-base sm:text-xl font-normal text-white/70">
              {t('what.help')}
            </h3>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))
        )}
        
        {isLoading && messages.length > 0 && (
          <div className="flex w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-6 animate-fade-in">
            <div className="bg-neutral-800 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 animate-pulse-subtle">
              <span className="text-xs sm:text-sm text-white/70">
                {t('ai.thinking').split('.')[0]}
                <span className="typing-indicator"></span>
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="sticky bottom-0 py-2 sm:py-4 bg-[#1a1a1a]">
        <ChatInput />
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ChatProvider>
      <div className="bg-[#1a1a1a] min-h-screen">
        <Header />
        <main className="pt-12">
          <ChatContainer />
        </main>
      </div>
    </ChatProvider>
  );
};

export default Index;
