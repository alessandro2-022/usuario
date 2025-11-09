import React from 'react';
import type { DriverInfo, TripState } from '../types';

interface TripStatusProps {
    state: TripState;
    driver: DriverInfo | null;
    onCancel: () => void;
}

const SearchingView: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
    <div className="text-center">
        <div className="w-12 h-12 border-4 border-goly-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-goly-dark">Procurando motorista...</h2>
        <p className="text-gray-500">Aguarde enquanto encontramos o melhor motorista para você.</p>
        <button 
            onClick={onCancel}
            className="mt-6 bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
        >
            Cancelar
        </button>
    </div>
);

const DriverFoundView: React.FC<{ driver: DriverInfo; onCancel: () => void }> = ({ driver, onCancel }) => (
    <div className="flex flex-col items-center text-center animate-fade-in">
        <p className="text-lg font-semibold text-goly-dark">Seu motorista está a caminho!</p>
        <p className="text-3xl font-bold text-goly-blue">Chega em 5 min</p>
        
        <div className="my-4 w-full h-px bg-gray-200"></div>

        <div className="flex items-center w-full">
            <img src={driver.avatarUrl} alt={driver.name} className="w-16 h-16 rounded-full border-2 border-goly-yellow" />
            <div className="ml-4 text-left">
                <p className="font-bold text-lg text-goly-dark">{driver.name}</p>
                <p className="text-gray-600">{driver.carModel}</p>
                <p className="text-sm bg-gray-200 px-2 py-1 rounded font-mono font-bold tracking-widest mt-1">{driver.licensePlate}</p>
            </div>
        </div>

        <div className="flex space-x-4 mt-6 w-full">
            <button className="flex-1 bg-goly-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors">
                Ligar
            </button>
            <button 
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-goly-dark font-bold py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
            >
                Cancelar
            </button>
        </div>
    </div>
);

const TripStatus: React.FC<TripStatusProps> = ({ state, driver, onCancel }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white p-6 rounded-t-2xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)] animate-fade-in">
            {state === 'SEARCHING' && <SearchingView onCancel={onCancel} />}
            {state === 'DRIVER_FOUND' && driver && <DriverFoundView driver={driver} onCancel={onCancel} />}
        </div>
    );
};

export default TripStatus;