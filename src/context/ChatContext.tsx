import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getChatCompletion, getAssistantResponse } from '@/utils/apiService';

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

// Store the default API key - make sure it's properly formatted without any whitespace
const DEFAULT_API_KEY = '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';

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [threadId, setThreadId] = useState<string | undefined>(undefined);

  // Load API key from localStorage on initial render
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      // If no API key in localStorage, use the default one and save it
      setApiKey(DEFAULT_API_KEY);
      localStorage.setItem('openai_api_key', DEFAULT_API_KEY);
    }
    
    // Load thread ID from localStorage if exists
    const savedThreadId = localStorage.getItem('openai_thread_id');
    if (savedThreadId) {
      setThreadId(savedThreadId);
    }
  }, []);

  // Save API key to localStorage whenever it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('openai_api_key', apiKey);
    }
  }, [apiKey]);

  // Save thread ID to localStorage whenever it changes
  useEffect(() => {
    if (threadId) {
      localStorage.setItem('openai_thread_id', threadId);
    }
  }, [threadId]);

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
      // Get assistant response instead of chat completion
      const { content: assistantContent, threadId: newThreadId } = await getAssistantResponse(
        apiKey, 
        content,
        threadId
      );
      
      // Update thread ID if it's new
      if (newThreadId !== threadId) {
        setThreadId(newThreadId);
      }

      // Create an assistant message with the response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting assistant response:', error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from assistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    // When clearing chat, we also clear the thread ID to start fresh
    setThreadId(undefined);
    localStorage.removeItem('openai_thread_id');
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
