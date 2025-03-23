
import React, { useEffect, useRef } from 'react';
import { ChatProvider, useChat } from '@/context/ChatContext';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';

const ChatContainer: React.FC = () => {
  const { messages, isLoading } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      // No need to add a welcome message here, as it will be empty until the user sends something
    }
  }, [messages.length]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto scrollbar-hide pb-6"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-subtle animate-pulse-subtle mb-6 flex items-center justify-center">
              <span className="text-white font-semibold text-2xl">AI</span>
            </div>
            <h2 className="text-2xl font-medium mb-3">Welcome to HUSSLE AI</h2>
            <p className="text-muted-foreground max-w-md">
              Start a conversation by typing a message below. Your chat history will appear here.
            </p>
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
          <div className="flex w-full max-w-4xl mx-auto px-4 py-6 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 animate-pulse-subtle">
                <span className="text-neutral-600 dark:text-neutral-400 text-xs">AI</span>
              </div>
              <div className="glass-panel rounded-2xl rounded-tl-none px-4 py-3 animate-pulse-subtle">
                <span className="text-sm sm:text-base">Thinking<span className="typing-indicator"></span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="sticky bottom-0 bg-gradient-to-t from-background to-transparent py-6">
        <ChatInput />
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ChatProvider>
      <div className="bg-gradient-radial from-background to-background/90 min-h-screen">
        <Header />
        <main className="container mx-auto">
          <ChatContainer />
        </main>
      </div>
    </ChatProvider>
  );
};

export default Index;
