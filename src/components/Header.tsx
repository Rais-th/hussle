import React, { useState } from 'react';
import { Settings, X, Check } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
const Header: React.FC = () => {
  const {
    clearChat
  } = useChat();
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-subtle animate-pulse-subtle flex items-center justify-center shadow-sm bg-zinc-950">
            <span className="text-white font-semibold text-xs">AI</span>
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
                <DialogTitle>Paramètres</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Button variant="destructive" onClick={() => {
                  clearChat();
                  setOpen(false);
                }}>
                    Effacer l'historique de conversation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>;
};
export default Header;