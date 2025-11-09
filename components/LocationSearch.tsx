import React from 'react';
import { OriginIcon, DestinationIcon } from '../constants';

interface LocationSearchProps {
  origin: string;
  setOrigin: (origin: string) => void;
  destination: string;
  setDestination: (destination: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ origin, setOrigin, destination, setDestination }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-20 bg-white p-3 rounded-lg shadow-lg flex flex-col space-y-2">
      {/* Origin Input */}
      <div className="flex items-center space-x-3">
        <OriginIcon className="h-5 w-5 text-goly-blue" />
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Local de partida"
          className="w-full bg-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-goly-blue text-black"
        />
      </div>

      {/* Separator */}
      <div className="h-px bg-gray-200 ml-8"></div>

      {/* Destination Input */}
      <div className="flex items-center space-x-3">
        <DestinationIcon className="h-5 w-5 text-goly-dark" />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Para onde vamos?"
          className="w-full bg-transparent p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-goly-yellow text-black"
          autoFocus
        />
      </div>
    </div>
  );
};

export default LocationSearch;