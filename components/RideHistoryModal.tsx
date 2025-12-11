
import React from 'react';
import { CloseIcon, MapPinIcon, CarIcon, CalendarIcon, StarIcon } from '../constants';
import { RideHistoryItem } from '../types';

interface RideHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: RideHistoryItem[];
}

const RideHistoryModal: React.FC<RideHistoryModalProps> = ({ isOpen, onClose, history }) => {
    if (!isOpen) return null;

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-goly-blue p-4 flex justify-between items-center text-white shrink-0">
                    <h2 className="text-lg font-bold">Histórico de Corridas</h2>
                    <button 
                        onClick={onClose} 
                        className="hover:bg-white/20 p-1 rounded-full transition-colors"
                        aria-label="Fechar"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
                    {history.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <CarIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p>Nenhuma corrida registrada ainda.</p>
                        </div>
                    ) : (
                        history.map((ride) => (
                            <div key={ride.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span>{formatDate(ride.date)}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                        ride.status === 'COMPLETED' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {ride.status === 'COMPLETED' ? 'Concluída' : 'Cancelada'}
                                    </span>
                                </div>

                                <div className="space-y-3 relative">
                                    {/* Linha vertical conectando os pontos */}
                                    <div className="absolute left-[7px] top-2 bottom-6 w-0.5 bg-gray-200"></div>

                                    {/* Origem */}
                                    <div className="flex items-start space-x-3 relative z-10">
                                        <div className="w-4 h-4 rounded-full bg-goly-blue border-2 border-white shadow-sm mt-0.5 shrink-0"></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Origem</p>
                                            <p className="text-sm text-goly-dark font-medium leading-tight line-clamp-1">{ride.origin}</p>
                                        </div>
                                    </div>

                                    {/* Destino */}
                                    <div className="flex items-start space-x-3 relative z-10">
                                        <div className="w-4 h-4 bg-goly-dark border-2 border-white shadow-sm mt-0.5 shrink-0"></div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Destino</p>
                                            <p className="text-sm text-goly-dark font-medium leading-tight line-clamp-1">{ride.destination}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <img src={ride.driverAvatar} alt={ride.driverName} className="w-8 h-8 rounded-full border border-gray-200" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-700">{ride.driverName}</p>
                                            {ride.rating && (
                                                <div className="flex items-center text-xs text-goly-yellow">
                                                    <StarIcon className="w-3 h-3 mr-1" />
                                                    <span>{ride.rating.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-goly-blue">{formatCurrency(ride.price)}</p>
                                        <p className="text-xs text-gray-400">{ride.paymentMethod === 'creditCard' ? 'Cartão' : ride.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RideHistoryModal;
