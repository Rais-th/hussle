
import React, { useState } from 'react';
import { Settings, X, Check } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Header: React.FC = () => {
  const { apiKey, setApiKey, clearChat } = useChat();
  const [open, setOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [showCheck, setShowCheck] = useState(false);

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    setShowCheck(true);
    
    setTimeout(() => {
      setShowCheck(false);
      setOpen(false);
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-subtle animate-pulse-subtle flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-xs">H</span>
          </div>
          <h1 className="text-xl font-medium">HUSSLE AI</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">OpenAI API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      placeholder="sk-..."
                    />
                    <Button
                      onClick={handleSaveApiKey}
                      className="min-w-14"
                    >
                      {showCheck ? <Check className="h-4 w-4" /> : "Save"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your API key is stored locally in your browser.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Button variant="destructive" onClick={() => {
                    clearChat();
                    setOpen(false);
                  }}>
                    Clear Chat History
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
