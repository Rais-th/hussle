import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/context/ChatContext';
import { UserIcon, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

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
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
