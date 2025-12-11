
import React, { useEffect, useState } from 'react';
import { getAdminData, PaymentResult } from '../services/asaasService';
import { CloseIcon } from '../constants';

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
    const [data, setData] = useState(getAdminData());

    // Poll for updates when open to simulate real-time updates
    useEffect(() => {
        if (!isOpen) return;
        setData(getAdminData()); // Initial fetch
        const interval = setInterval(() => {
            setData(getAdminData());
        }, 1000);
        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Saldo da Conta</h2>
                        <p className="text-gray-400 text-sm mt-1">Integração Financeira Asaas</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saldo Total Acumulado</p>
                            <p className="text-4xl font-extrabold text-green-600 mt-2">
                                {data.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Transações Recentes
                    </h3>
                    {data.transactions.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">Nenhuma transação registrada ainda.</p>
                            <p className="text-xs text-gray-400 mt-1">Realize uma corrida para ver o split acontecer.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.transactions.map((tx: PaymentResult) => (
                                <div key={tx.transactionId} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                                            IN
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Split de Pagamento</p>
                                            <p className="text-xs text-gray-500 font-mono">{tx.transactionId}</p>
                                            <p className="text-xs text-gray-400">{tx.date.toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Total: {tx.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                        <p className="text-green-600 font-bold text-lg">
                                            + {tx.splits.admin.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
