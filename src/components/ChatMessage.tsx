import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/context/ChatContext';
import { UserIcon, Bot } from 'lucide-react';
interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}
const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLatest
}) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === 'user';

  // Scroll to this message if it's the latest
  useEffect(() => {
    if (isLatest && messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [isLatest]);
  return <div ref={messageRef} className={cn("flex w-full max-w-4xl mx-auto px-4 py-6 animate-slide-up", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex items-start gap-3 max-w-[85%]", isUser && "flex-row-reverse")}>
        <div className={cn("flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center", isUser ? "bg-blue-100 dark:bg-blue-900" : "bg-neutral-100 dark:bg-neutral-800")}>
          {isUser ? <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <Bot className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />}
        </div>
        
        <div className="bg-zinc-300 rounded-sm">
          <div className="prose dark:prose-invert">
            {message.content.split('\n').map((paragraph, index) => <p key={index} className="mb-2 last:mb-0 text-sm sm:text-base">
                {paragraph}
              </p>)}
          </div>
        </div>
      </div>
    </div>;
};
export default ChatMessage;