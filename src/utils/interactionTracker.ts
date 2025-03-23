
import { supabase } from "@/integrations/supabase/client";

// Types of interactions that can be tracked
export type InteractionType = 
  | 'message_sent' 
  | 'message_received' 
  | 'chat_started' 
  | 'language_changed';

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

    // Add timestamp to metadata
    const enrichedMetadata = {
      ...metadata,
      timestamp_client: new Date().toISOString(),
      browser: navigator.userAgent,
    };

    // Store the interaction
    const { data, error } = await supabase.from('user_interactions').insert({
      user_id: userId || null, // Will be null for unauthenticated users
      interaction_type: interactionType,
      message_id: messageId,
      metadata: enrichedMetadata
    });

    if (error) {
      console.error('Error storing interaction:', error);
    } else {
      console.log(`Tracked interaction: ${interactionType}`, { 
        messageId,
        metadata: enrichedMetadata
      });
    }
  } catch (error) {
    // Don't let tracking errors affect the application
    console.error('Error tracking interaction:', error);
  }
}

/**
 * Utility to debug interaction tracking
 */
export async function getRecentInteractions(limit = 10): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('user_interactions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error retrieving interactions:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error retrieving interactions:', error);
    return [];
  }
}
