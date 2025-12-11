
import React from 'react';
import { CloseIcon, HeadsetIcon } from '../constants';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-goly-blue p-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center space-x-2">
                        <HeadsetIcon className="w-6 h-6" />
                        <h2 className="text-lg font-bold">Suporte & Ajuda</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="hover:bg-white/20 p-1 rounded-full transition-colors"
                        aria-label="Fechar"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-center space-y-6">
                    <p className="text-gray-600 text-sm">
                        Está com dúvidas ou problemas? Entre em contato com nossa equipe de suporte.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail de Suporte</p>
                        <p className="text-xl font-bold text-goly-blue break-all">central@goly.com</p>
                        
                        <a 
                            href="mailto:central@goly.com" 
                            className="mt-3 inline-block text-xs font-bold text-goly-dark bg-goly-yellow px-4 py-2 rounded-full hover:bg-goly-yellow-dark transition-colors"
                        >
                            Enviar E-mail
                        </a>
                    </div>

                    <div className="text-xs text-gray-400">
                        <p>Horário de atendimento:</p>
                        <p>Segunda a Sexta, das 08h às 18h</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;
