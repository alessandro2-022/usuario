
import React, { useState } from 'react';
import { DriverInfo, TripState } from '../types';

interface TestConsoleProps {
    currentTripState: TripState;
    onForceDriverFound: () => void;
    onForceDriverArrived: () => void;
    onForceTripEnd: () => void;
    onForceDriverCancel: () => void;
    onSimulateAdminMessage: () => void;
}

const TestConsole: React.FC<TestConsoleProps> = ({
    currentTripState,
    onForceDriverFound,
    onForceDriverArrived,
    onForceTripEnd,
    onForceDriverCancel,
    onSimulateAdminMessage
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all opacity-50 hover:opacity-100"
                title="Abrir Console de Testes"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-4 rounded-xl shadow-2xl w-72 animate-fade-in border border-gray-700">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <h3 className="font-bold text-sm text-goly-yellow">Console de Testes (Simulador)</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Simular App Motorista</p>
                    <div className="grid grid-cols-1 gap-2">
                        <button 
                            onClick={onForceDriverFound}
                            disabled={currentTripState !== 'SEARCHING'}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-xs py-2 px-3 rounded transition-colors text-left flex justify-between"
                        >
                            <span>1. Aceitar Corrida</span>
                            <span className="text-white/50">{currentTripState === 'SEARCHING' ? 'Disponível' : '-'}</span>
                        </button>
                        <button 
                            onClick={onForceDriverArrived}
                            disabled={currentTripState !== 'DRIVER_FOUND'}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-xs py-2 px-3 rounded transition-colors text-left flex justify-between"
                        >
                            <span>2. Chegar ao Local</span>
                             <span className="text-white/50">{currentTripState === 'DRIVER_FOUND' ? 'Disponível' : '-'}</span>
                        </button>
                         <button 
                            onClick={onForceTripEnd}
                            disabled={currentTripState !== 'DRIVER_FOUND'}
                            className="bg-green-800 hover:bg-green-900 disabled:bg-gray-700 disabled:text-gray-500 text-xs py-2 px-3 rounded transition-colors text-left flex justify-between"
                        >
                            <span>3. Finalizar Viagem</span>
                             <span className="text-white/50">{currentTripState === 'DRIVER_FOUND' ? 'Disponível' : '-'}</span>
                        </button>
                        <button 
                            onClick={onForceDriverCancel}
                            disabled={currentTripState === 'IDLE'}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-xs py-2 px-3 rounded transition-colors text-left"
                        >
                            Cancelar (Pelo Motorista)
                        </button>
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-700">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Simular Painel Admin</p>
                    <button 
                        onClick={onSimulateAdminMessage}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-xs py-2 px-3 rounded transition-colors text-left"
                    >
                        Enviar Msg Suporte
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestConsole;
