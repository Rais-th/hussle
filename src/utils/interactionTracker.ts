
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
