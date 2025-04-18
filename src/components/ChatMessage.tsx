
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/context/ChatContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

// Function to detect URLs in text and convert them to clickable links
const formatTextWithLinks = (text: string) => {
  // URL regex pattern
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split the text by URLs
  const parts = text.split(urlRegex);
  
  // Find all URLs in the text
  const urls = text.match(urlRegex) || [];
  
  // Combine parts and URLs
  const result = [];
  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);
    if (i < urls.length) {
      result.push(
        <a 
          key={i} 
          href={urls[i]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-400 underline font-semibold hover:brightness-125 transition-all cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            window.open(urls[i], '_blank', 'noopener,noreferrer');
          }}
        >
          {urls[i]}
        </a>
      );
    }
  }
  return result;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === 'user';
  const isMobile = useIsMobile();
  
  // Scroll to this message if it's the latest
  useEffect(() => {
    if (isLatest && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLatest]);

  return (
    <div
      ref={messageRef}
      className={cn(
        "flex w-full max-w-2xl mx-auto px-3 sm:px-4 py-3 sm:py-6 animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[90%] sm:max-w-[85%]",
          isUser ? "bg-neutral-800 text-white" : "bg-neutral-800 text-white",
          "rounded-2xl px-3 sm:px-4 py-2 sm:py-3"
        )}
      >
        <div className="prose prose-invert prose-sm sm:prose-base pointer-events-auto relative z-10">
          {message.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-1.5 sm:mb-2 last:mb-0 text-xs sm:text-sm">
              {formatTextWithLinks(paragraph)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
