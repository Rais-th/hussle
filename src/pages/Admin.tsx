
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Interaction, getMetadataValue } from "@/utils/interactionTracker";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function Admin() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInteractions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (error) throw error;
      
      // Safely type the data using the Interaction interface
      setInteractions(data as unknown as Interaction[]);
    } catch (err) {
      console.error('Error fetching interactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch interactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  // Group related messages (user input and AI output)
  const groupMessages = () => {
    const result: { userMessage?: Interaction; aiResponse?: Interaction }[] = [];
    const tempMap: Record<string, number> = {};
    
    interactions.forEach(interaction => {
      if (interaction.interaction_type === 'message_sent') {
        const index = result.length;
        result.push({ userMessage: interaction });
        if (interaction.message_id) {
          tempMap[interaction.message_id] = index;
        }
      } else if (interaction.interaction_type === 'message_received') {
        if (interaction.message_id && tempMap[interaction.message_id] !== undefined) {
          // Add AI response to existing entry
          result[tempMap[interaction.message_id]].aiResponse = interaction;
        } else {
          // Create new entry for AI response without a matching user message
          result.push({ aiResponse: interaction });
        }
      }
    });
    
    return result;
  };
  
  const messageGroups = groupMessages();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Interactions</h1>
        <Button onClick={fetchInteractions} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : messageGroups.length === 0 ? (
        <div className="text-center p-8 border rounded-lg bg-muted">
          <p>No interactions found</p>
        </div>
      ) : (
        <Table>
          <TableCaption>List of recent user interactions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>User Input</TableHead>
              <TableHead>AI Output</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messageGroups.map((group, index) => (
              <TableRow key={index}>
                <TableCell>
                  {group.userMessage 
                    ? new Date(group.userMessage.timestamp).toLocaleString() 
                    : group.aiResponse 
                      ? new Date(group.aiResponse.timestamp).toLocaleString()
                      : ''}
                </TableCell>
                <TableCell>
                  {group.userMessage ? 'User → AI' : 'AI Only'}
                </TableCell>
                <TableCell>
                  {group.userMessage && (
                    <div className="max-w-md break-words">
                      {getMetadataValue(group.userMessage.metadata, 'content_preview') || 
                       getMetadataValue(group.userMessage.metadata, 'content') || 
                       '[No content]'}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {group.aiResponse && (
                    <div className="max-w-md break-words">
                      {getMetadataValue(group.aiResponse.metadata, 'content_preview') || 
                       getMetadataValue(group.aiResponse.metadata, 'content') || 
                       '[No content]'}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
