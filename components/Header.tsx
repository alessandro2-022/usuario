import React from 'react';
import { MenuIcon, ChatIcon } from '../constants';
import type { TripState } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
  onChatClick: () => void;
  tripState: TripState;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onChatClick, tripState }) => {
  return (
    <header className="bg-goly-blue text-white shadow-md p-4 flex items-center justify-between z-30">
      <div className="flex items-center space-x-3">
        <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-goly-blue-dark transition-colors">
          <MenuIcon className="h-6 w-6" />
        </button>
        <div className="flex items-end">
            <h1 className="text-3xl font-bold tracking-tight">Goly</h1>
            <span className="text-3xl font-bold text-goly-yellow">&gt;</span>
        </div>
      </div>
      
      {tripState === 'IDLE' && (
        <button 
          onClick={onChatClick} 
          className="p-2 rounded-full hover:bg-goly-blue-dark transition-colors"
          aria-label="Open Chat Assistant"
        >
          <ChatIcon className="h-6 w-6" />
        </button>
      )}
    </header>
  );
};

export default Header;