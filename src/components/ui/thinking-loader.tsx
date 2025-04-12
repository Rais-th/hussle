import React from 'react';

const ThinkingLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-1.5">
      <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-thinking-dot-1" />
      <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-thinking-dot-2" />
      <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-thinking-dot-3" />
    </div>
  );
};

export default ThinkingLoader; 