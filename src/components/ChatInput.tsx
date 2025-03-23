
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { ArrowUp, Plus, Globe, MoreHorizontal, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

const ChatInput: React.FC = () => {
  const { sendMessage, isLoading } = useChat();
  const { t } = useLanguage();
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
    <div className="w-full max-w-2xl mx-auto">
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
            className="w-full resize-none bg-transparent p-3 pr-12 focus:outline-none text-sm sm:text-base text-white/90 placeholder:text-white/40"
            disabled={isLoading}
          />
          <div className="absolute right-2 bottom-2 flex space-x-1">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-1.5 rounded-full transition-all flex justify-center items-center",
                input.trim() && !isLoading
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              )}
            >
              <ArrowUp size={18} strokeWidth={2.5} className={cn(isLoading && "opacity-50")} />
            </button>
          </div>
        </div>
        
        <div className="p-2 border-t border-white/5 flex items-center justify-between">
          <div className="flex space-x-1">
            <button type="button" className="p-1.5 rounded-full text-white/50 hover:bg-white/10">
              <Plus size={18} />
            </button>
            <button type="button" className="p-1.5 rounded-full text-white/50 hover:bg-white/10">
              <Globe size={18} />
            </button>
          </div>
          
          <button type="button" className="p-1.5 rounded-full text-white/50 hover:bg-white/10">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </form>
      
      {/* Community Join Button */}
      <div className="flex justify-center mb-4">
        <Button 
          onClick={() => window.open('https://skool.com/educs-ai-9369', '_blank')}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-all duration-200 w-full max-w-sm"
        >
          <Users className="mr-2" size={18} />
          Join the Free AI Community
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
