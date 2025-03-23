
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

// Types of interactions that can be tracked
export type InteractionType = 
  | 'message_sent' 
  | 'message_received' 
  | 'chat_started' 
  | 'language_changed';

// Define the structure for interaction metadata
export interface InteractionMetadata {
  content_preview?: string;
  content_length?: number;
  timestamp_client?: string;
  language?: string;
  [key: string]: any; // Allow additional properties
}

export interface Interaction {
  id: string;
  user_id: string | null;
  interaction_type: InteractionType;
  message_id: string | null;
  metadata: InteractionMetadata | Json;
  timestamp: string;
}

interface TrackInteractionProps {
  interactionType: InteractionType;
  messageId?: string;
  metadata?: Record<string, any>;
}

/**
 * Tracks a user interaction by storing it in Supabase
 */
export async function trackInteraction({ 
  interactionType, 
  messageId, 
  metadata = {} 
}: TrackInteractionProps): Promise<void> {
  try {
    // Get current user session (if authenticated)
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    // Store the interaction
    await supabase.from('user_interactions').insert({
      user_id: userId || null, // Will be null for unauthenticated users
      interaction_type: interactionType,
      message_id: messageId,
      metadata
    });

    console.log(`Tracked interaction: ${interactionType}`);
  } catch (error) {
    // Don't let tracking errors affect the application
    console.error('Error tracking interaction:', error);
  }
}

// Helper function to safely access metadata fields
export function getMetadataValue(metadata: InteractionMetadata | Json | null, key: string): any {
  if (!metadata) return null;
  
  // Handle both object and string formats
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return parsed[key];
    } catch (e) {
      return null;
    }
  }
  
  // Handle object format
  return (metadata as any)[key];
}
