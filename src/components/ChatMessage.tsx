
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/context/ChatContext';
import { UserIcon, Bot } from 'lucide-react';

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
          className="text-blue-400 hover:text-blue-300 underline font-medium hover:brightness-125 transition-all"
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
        "flex w-full max-w-2xl mx-auto px-4 py-6 animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%]",
          isUser ? "bg-neutral-800 text-white" : "bg-neutral-800 text-white",
          "rounded-2xl px-4 py-3"
        )}
      >
        <div className="prose prose-invert">
          {message.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-2 last:mb-0 text-sm">
              {formatTextWithLinks(paragraph)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
