
import React from 'react';

interface EmergencyButtonProps {
  onEmergencyClick: () => void;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onEmergencyClick }) => {
  return (
    <button
      onClick={onEmergencyClick}
      className="fixed bottom-24 right-4 z-20 bg-red-600 text-white p-4 rounded-full shadow-lg border-4 border-white hover:bg-red-700 hover:scale-105 transition-transform duration-200 animate-pulse group"
      aria-label="Botão de Emergência"
      title="Botão de Emergência"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-8 group-hover:animate-bounce" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </button>
  );
};

export default EmergencyButton;
