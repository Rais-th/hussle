
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatInput: React.FC = () => {
  const { sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      await sendMessage(input.trim());
      setInput('');
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Handle Enter to send, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col glass-panel shadow-lg transition-all duration-200 overflow-hidden"
      >
        <div className="relative flex">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez votre message ici..."
            rows={1}
            className="w-full resize-none bg-transparent p-4 pr-12 focus:outline-none text-sm sm:text-base"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-3 bottom-3 p-2 rounded-full transition-all duration-300 flex justify-center items-center",
              input.trim() && !isLoading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 dark:bg-gray-700 cursor-not-allowed"
            )}
          >
            <SendHorizontal size={18} className={cn(isLoading && "opacity-50")} />
          </button>
        </div>
        
        <div className="px-4 pb-2 text-xs text-muted-foreground flex justify-between items-center">
          <div className="flex-1">
            {isLoading ? (
              <span className="text-blue-500 dark:text-blue-400 animate-pulse">
                L'IA réfléchit...
              </span>
            ) : (
              <span>Appuyez sur Entrée pour envoyer, Maj+Entrée pour un saut de ligne</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
