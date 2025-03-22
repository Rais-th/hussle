
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getChatCompletion } from '@/utils/apiService';

export type Message = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface ChatContextProps {
  messages: Message[];
  isLoading: boolean;
  apiKey: string;
  setApiKey: (key: string) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// Store the default API key
const DEFAULT_API_KEY = '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';

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(DEFAULT_API_KEY);

  // Load API key from localStorage on initial render
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      // If no API key in localStorage, use the default one and save it
      localStorage.setItem('openai_api_key', DEFAULT_API_KEY);
    }
  }, []);

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
    }
  }, [apiKey]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key in the settings.",
        variant: "destructive",
      });
      return;
    }

    // Create a new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      const response = await getChatCompletion(apiKey, [
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content }
      ]);

      // Create an assistant message with the response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting chat completion:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, apiKey, setApiKey, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
