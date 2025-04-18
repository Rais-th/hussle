
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { ArrowUp, Plus, Globe, MoreHorizontal, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const ChatInput: React.FC = () => {
  const { sendMessage, isLoading } = useChat();
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

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
      textarea.style.height = `${Math.min(textarea.scrollHeight, isMobile ? 120 : 200)}px`;
    }
  }, [input, isMobile]);

  // Handle Enter to send, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col bg-[#222222] border border-white/10 rounded-xl shadow-lg transition-all duration-200 overflow-hidden mb-3"
      >
        <div className="relative flex">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('type.message')}
            rows={1}
            className="w-full resize-none bg-transparent p-2 sm:p-3 pr-10 focus:outline-none text-sm sm:text-base text-white/90 placeholder:text-white/40"
            disabled={isLoading}
          />
          <div className="absolute right-1.5 bottom-1.5 flex space-x-1">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-1 rounded-full transition-all flex justify-center items-center",
                input.trim() && !isLoading
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              )}
            >
              <ArrowUp size={16} strokeWidth={2.5} className={cn(isLoading && "opacity-50")} />
            </button>
          </div>
        </div>
        
        <div className="p-1.5 border-t border-white/5 flex items-center justify-between">
          <div className="flex space-x-0.5">
            <button type="button" className="p-1 rounded-full text-white/50 hover:bg-white/10">
              <Plus size={16} />
            </button>
            <button type="button" className="p-1 rounded-full text-white/50 hover:bg-white/10">
              <Globe size={16} />
            </button>
          </div>
          
          <button type="button" className="p-1 rounded-full text-white/50 hover:bg-white/10">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </form>
      
      {/* Community Join Button - Only visible for French language */}
      {language === 'fr' && (
        <div className="flex justify-center mb-4">
          <Button 
            onClick={() => window.open('https://www.skool.com/educs-ai-9369/about?ref=9e56bf5b784046a39fc852300408a083', '_blank')}
            className="bg-black hover:bg-gray-800 text-white border border-white/20 transition-all duration-200 text-xs px-4 py-1 h-8 rounded-md w-auto min-w-[250px] max-w-[280px]"
            size="sm"
          >
            <Users className="mr-1" size={14} />
            {t('join.community')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
