import React from 'react';
import { EmergencyIcon } from '../constants';

interface EmergencyButtonProps {
  onEmergencyClick: () => void;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onEmergencyClick }) => {
  return (
    <button
      onClick={onEmergencyClick}
      className="fixed bottom-28 left-4 z-20 bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors"
      aria-label="Botão de Emergência SOS"
    >
      <EmergencyIcon className="h-8 w-8" />
    </button>
  );
};

export default EmergencyButton;