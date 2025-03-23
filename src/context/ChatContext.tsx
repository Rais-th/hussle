import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { getChatCompletion, getAssistantResponse } from '@/utils/apiService';
import { useLanguage } from './LanguageContext';
import { trackInteraction, getRecentInteractions } from '@/utils/interactionTracker';

export type Message = {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface ChatContextProps {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

// Store the default API key - ensure this is the exact, complete key
const DEFAULT_API_KEY = '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';

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey] = useState<string>(DEFAULT_API_KEY);
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const { language } = useLanguage();

  // Debug function to check interactions
  useEffect(() => {
    const debugInteractions = async () => {
      try {
        const recentInteractions = await getRecentInteractions(5);
        console.log('Recent interactions:', recentInteractions);
      } catch (error) {
        console.error('Error checking interactions:', error);
      }
    };
    
    // Run the debug function once on mount
    debugInteractions();
  }, []);

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
      metadata: { 
        language,
        threadId: savedThreadId || 'new_session',
        timestamp: new Date().toISOString()
      }
    });
  }, [language]);

  // Save thread ID to localStorage whenever it changes
  useEffect(() => {
    if (threadId) {
      localStorage.setItem('openai_thread_id', threadId);
    }
  }, [threadId]);

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

    // Track the user message with more content details
    trackInteraction({ 
      interactionType: 'message_sent',
      messageId: userMessage.id,
      metadata: { 
        content_length: content.length, 
        content_preview: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        language,
        timestamp: new Date().toISOString()
      }
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

      // Track the assistant response with more details
      trackInteraction({ 
        interactionType: 'message_received',
        messageId: assistantMessage.id,
        metadata: { 
          content_length: assistantContent.length,
          content_preview: assistantContent.substring(0, 50) + (assistantContent.length > 50 ? '...' : ''),
          language,
          threadId: newThreadId,
          response_time_ms: Date.now() - userMessage.timestamp.getTime()
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
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearChat }}>
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
