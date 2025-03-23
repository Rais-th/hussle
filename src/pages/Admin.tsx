
import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

type Interaction = {
  id: string;
  user_id: string | null;
  interaction_type: string;
  message_id: string | null;
  timestamp: string;
  metadata: {
    content_preview?: string;
    content_length?: number;
    timestamp_client?: string;
    language?: string;
    [key: string]: any;
  };
};

const Admin: React.FC = () => {
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
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) {
        throw error;
      }
      
      setInteractions(data || []);
    } catch (err) {
      console.error('Error fetching interactions:', err);
      setError('Failed to load interactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  // Group interactions by conversation
  const messagesByConversation = interactions.reduce((acc: Record<string, any[]>, interaction) => {
    if (interaction.interaction_type === 'message_sent' || interaction.interaction_type === 'message_received') {
      // Use timestamp as a rough grouping mechanism when no message_id is available
      const key = interaction.message_id || interaction.timestamp;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(interaction);
    }
    return acc;
  }, {});

  // Create message pairs (user input + AI output)
  const messagePairs: [Interaction | null, Interaction | null][] = [];
  
  // First collect all user messages
  const userMessages = interactions.filter(i => i.interaction_type === 'message_sent');
  
  // For each user message, find the corresponding AI response
  userMessages.forEach(userMsg => {
    const timestamp = new Date(userMsg.timestamp).getTime();
    
    // Find the first AI response after this user message
    const aiResponse = interactions.find(i => 
      i.interaction_type === 'message_received' && 
      new Date(i.timestamp).getTime() > timestamp
    ) || null;
    
    messagePairs.push([userMsg, aiResponse]);
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">User Interactions</h1>
        <Button 
          onClick={fetchInteractions} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-700 p-4 mb-6 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-card rounded-md shadow">
        <Table>
          <TableCaption>User interactions and AI responses</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[150px]">Type</TableHead>
              <TableHead className="w-[40%]">User Input</TableHead>
              <TableHead className="w-[40%]">AI Output</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messagePairs.length > 0 ? (
              messagePairs.map(([userMsg, aiMsg], index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {userMsg && new Date(userMsg.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {userMsg?.interaction_type === 'message_sent' ? 'Chat Message' : ''}
                  </TableCell>
                  <TableCell className="align-top">
                    {userMsg?.metadata?.content_preview || 'N/A'}
                    {userMsg?.metadata?.content_length && userMsg.metadata.content_length > 50 && '...'}
                  </TableCell>
                  <TableCell className="align-top">
                    {aiMsg?.metadata?.content_preview || 'N/A'}
                    {aiMsg?.metadata?.content_length && aiMsg.metadata.content_length > 50 && '...'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {loading ? 'Loading interactions...' : 'No interactions found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Admin;
