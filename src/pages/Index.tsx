
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

const ChatContainer: React.FC = () => {
  const { messages, isLoading } = useChat();
  const { t, language, setLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] pt-12">
      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-hide pb-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 text-center py-[120px]">
            <h2 className="text-2xl font-normal mb-3 text-white">
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
            <h3 className="text-xl font-normal text-white/70">
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
          <div className="flex w-full max-w-2xl mx-auto px-4 py-6 animate-fade-in">
            <div className="bg-neutral-800 rounded-2xl px-4 py-3 animate-pulse-subtle">
              <span className="text-sm text-white/70">
                {t('ai.thinking').split('.')[0]}
                <span className="typing-indicator"></span>
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="sticky bottom-0 py-4">
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
