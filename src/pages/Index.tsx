import React, { useEffect, useRef } from 'react';
import { ChatProvider, useChat } from '@/context/ChatContext';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Languages } from 'lucide-react';

const ChatContainer: React.FC = () => {
  const { messages, isLoading } = useChat();
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a]">
      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-hide pb-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 text-center py-[120px]">
            <h2 className="text-2xl font-normal mb-5 text-white">
              {t('welcome')}
            </h2>
            <div className="flex items-center text-white/70 mb-3">
              <Languages className="h-4 w-4 mr-2" />
              <p>{t('select.language')}</p>
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
        <main>
          <ChatContainer />
        </main>
      </div>
    </ChatProvider>
  );
};

export default Index;
