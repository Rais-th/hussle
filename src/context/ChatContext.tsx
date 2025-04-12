import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getChatCompletion, getAssistantResponse } from '@/utils/apiService';
import { useLanguage } from './LanguageContext';
import { trackInteraction } from '@/utils/interactionTracker';

export type Message = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface UserInfo {
  nom: string;
  postnom: string;
  numero: string;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  addMessage: (message: Message) => void;
  setIsLoading: (loading: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Store the default API key - ensure this is the exact, complete key
const DEFAULT_API_KEY = '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';

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey] = useState<string>(DEFAULT_API_KEY);
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const { language } = useLanguage();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Load thread ID from localStorage on initial render
  useEffect(() => {
    // Load thread ID from localStorage if exists
    const savedThreadId = localStorage.getItem('openai_thread_id');
    if (savedThreadId) {
      setThreadId(savedThreadId);
    }
    
    // Track that the chat was started/loaded
    trackInteraction({ 
      interactionType: 'chat_started',
      metadata: { language }
    });
  }, [language]);

  // Save thread ID to localStorage whenever it changes
  useEffect(() => {
    if (threadId) {
      localStorage.setItem('openai_thread_id', threadId);
    }
  }, [threadId]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Create a new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Track the user message
    trackInteraction({ 
      interactionType: 'message_sent',
      messageId: userMessage.id,
      metadata: { content_length: content.length, language }
    });

    try {
      console.log('Using API key:', `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`); // Log masked key for debugging
      
      // Add language instruction to the message
      const contentWithLanguage = `[Respond in ${language === 'fr' ? 'French' : 'English'}] ${content}`;
      
      // Get assistant response instead of chat completion
      const { content: assistantContent, threadId: newThreadId } = await getAssistantResponse(
        apiKey, 
        contentWithLanguage,
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

      // Track the assistant response
      trackInteraction({ 
        interactionType: 'message_received',
        messageId: assistantMessage.id,
        metadata: { 
          content_length: assistantContent.length,
          language,
          threadId: newThreadId
        }
      });
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
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        userInfo,
        setUserInfo,
        addMessage,
        setIsLoading,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
