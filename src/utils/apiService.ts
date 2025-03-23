interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function getChatCompletion(apiKey: string, messages: Message[]): Promise<string> {
  const url = 'https://api.openai.com/v1/chat/completions';
  const trimmedApiKey = apiKey.trim();
  
  try {
    console.log('Making API request with key:', `${trimmedApiKey.substring(0, 10)}...${trimmedApiKey.substring(trimmedApiKey.length - 5)}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${trimmedApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error fetching chat completion:', error);
    throw error;
  }
}

export async function getAssistantResponse(apiKey: string, message: string, threadId?: string): Promise<{ content: string, threadId: string }> {
  const assistantId = 'asst_Iq5zWNuMFFeBH5S6kWEHrdOQ';
  const trimmedApiKey = apiKey.trim();
  
  try {
    console.log('Using Assistant API with key:', `${trimmedApiKey.substring(0, 10)}...${trimmedApiKey.substring(trimmedApiKey.length - 5)}`);
    
    let currentThreadId = threadId;
    if (!currentThreadId) {
      console.log('Creating new thread');
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${trimmedApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({})
      });
      
      if (!threadResponse.ok) {
        const errorData = await threadResponse.json();
        console.error('Thread creation error response:', errorData);
        throw new Error(errorData.error?.message || `Thread creation error: ${threadResponse.status}`);
      }
      
      const threadData = await threadResponse.json();
      currentThreadId = threadData.id;
      console.log('Thread created with ID:', currentThreadId);
    }
    
    await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${trimmedApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: message
      })
    });
    
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${trimmedApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });
    
    if (!runResponse.ok) {
      const errorData = await runResponse.json();
      throw new Error(errorData.error?.message || `Run creation error: ${runResponse.status}`);
    }
    
    const runData = await runResponse.json();
    let runId = runData.id;
    
    let runStatus = 'queued';
    while (runStatus !== 'completed' && runStatus !== 'failed' && runStatus !== 'cancelled' && runStatus !== 'expired') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${runId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${trimmedApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(errorData.error?.message || `Status check error: ${statusResponse.status}`);
      }
      
      const statusData = await statusResponse.json();
      runStatus = statusData.status;
    }
    
    if (runStatus !== 'completed') {
      throw new Error(`Run ended with status: ${runStatus}`);
    }
    
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${trimmedApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    if (!messagesResponse.ok) {
      const errorData = await messagesResponse.json();
      throw new Error(errorData.error?.message || `Messages retrieval error: ${messagesResponse.status}`);
    }
    
    const messagesData = await messagesResponse.json();
    
    const assistantMessages = messagesData.data.filter((msg: any) => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      throw new Error('No assistant response found');
    }
    
    const latestAssistantMessage = assistantMessages[0];
    
    let responseContent = '';
    
    if (latestAssistantMessage.content && latestAssistantMessage.content.length > 0) {
      for (const contentPart of latestAssistantMessage.content) {
        if (contentPart.type === 'text') {
          responseContent += contentPart.text.value;
        }
      }
    }
    
    return {
      content: responseContent || 'No response content found',
      threadId: currentThreadId
    };
  } catch (error) {
    console.error('Error getting assistant response:', error);
    throw error;
  }
}
