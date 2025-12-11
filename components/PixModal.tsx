
import React, { useState } from 'react';
import { PixCharge } from '../services/asaasService';
import { CloseIcon, PixIcon } from '../constants';

interface PixModalProps {
    pixData: PixCharge | null;
    onConfirm: () => void;
    onCancel: () => void;
}

const PixModal: React.FC<PixModalProps> = ({ pixData, onConfirm, onCancel }) => {
    const [copied, setCopied] = useState(false);

    if (!pixData) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(pixData.payload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all scale-100">
                <div className="bg-goly-blue p-4 flex justify-between items-center text-white">
                    <div className="flex items-center space-x-2">
                        <PixIcon className="h-6 w-6 text-white" />
                        <h3 className="text-lg font-bold">Pagar com Pix</h3>
                    </div>
                    <button onClick={onCancel} className="hover:bg-white/20 p-1 rounded-full"><CloseIcon className="w-6 h-6" /></button>
                </div>
                
                <div className="p-6 flex flex-col items-center">
                    <p className="text-gray-600 text-sm text-center mb-4">
                        Escaneie o QR Code abaixo com o app do seu banco para finalizar o pagamento.
                    </p>
                    
                    <div className="bg-white p-2 border-2 border-goly-yellow rounded-xl mb-6 shadow-sm">
                        <img src={pixData.encodedImage} alt="QR Code Pix" className="w-48 h-48" />
                    </div>

                    <div className="w-full mb-6">
                        <p className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider text-center">Pix Copia e Cola</p>
                        <div className="flex shadow-sm">
                            <input 
                                type="text" 
                                readOnly 
                                value={pixData.payload} 
                                className="flex-1 bg-gray-50 text-xs p-3 rounded-l-lg border border-r-0 border-gray-200 text-gray-500 font-mono"
                            />
                            <button 
                                onClick={handleCopy}
                                className="bg-goly-blue text-white text-xs font-bold px-4 py-2 rounded-r-lg hover:bg-goly-blue-dark transition-colors"
                            >
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={onConfirm}
                        className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-600 transition-colors shadow-lg flex items-center justify-center space-x-2"
                    >
                        <span>Já realizei o pagamento</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PixModal;
