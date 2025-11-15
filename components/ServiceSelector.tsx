import React, { useState } from 'react';
import {
  ArrowRightIcon,
  BackIcon,
  CarIcon,
  CloseIcon,
  MotorcycleIcon,
  PackageIcon,
  CreditCardIcon,
  PixIcon,
  WalletIcon
} from '../constants';

type ServiceCategory = 'ride' | 'delivery' | null;
type ServiceType = 'car' | 'motorcycle' | 'pickup' | 'dropoff' | null;
type PaymentMethod = 'creditCard' | 'pix' | 'golyBalance' | null;

interface ServiceSelectorProps {
    onServiceSelect: () => void;
}

const getCategoryDisplayName = (category: ServiceCategory) => {
    switch (category) {
        case 'ride': return { name: 'Corrida', icon: <CarIcon className="h-6 w-6 text-goly-blue" /> };
        case 'delivery': return { name: 'Entrega', icon: <PackageIcon className="h-6 w-6 text-goly-blue" /> };
        default: return { name: '', icon: null };
    }
};

const getServiceTypeDisplayName = (type: ServiceType) => {
    switch (type) {
        case 'car': return { name: 'Carro', icon: <CarIcon className="h-6 w-6 text-goly-blue" /> };
        case 'motorcycle': return { name: 'Moto', icon: <MotorcycleIcon className="h-6 w-6 text-goly-blue" /> };
        case 'pickup': return { name: 'Busca', icon: <PackageIcon className="h-6 w-6 text-goly-blue" /> };
        case 'dropoff': return { name: 'Deixa', icon: <PackageIcon className="h-6 w-6 text-goly-blue" /> };
        default: return { name: '', icon: null };
    }
};

const getPaymentMethodDisplayName = (method: PaymentMethod) => {
    switch (method) {
        case 'creditCard': return { name: 'Cartão de Crédito', icon: <CreditCardIcon className="h-6 w-6 text-goly-blue" /> };
        case 'pix': return { name: 'PIX', icon: <PixIcon className="h-6 w-6 text-goly-blue" /> };
        case 'golyBalance': return { name: 'Saldo Goly', icon: <WalletIcon className="h-6 w-6 text-goly-blue" /> };
        default: return { name: '', icon: null };
    }
};

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onServiceSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(null);
    const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
    const [showSummary, setShowSummary] = useState(false); // New state for summary view

    const resetSelections = () => {
        setIsOpen(false);
        setSelectedCategory(null);
        setSelectedServiceType(null);
        setSelectedPaymentMethod(null);
        setShowSummary(false);
    };

    const handleMainButtonClick = () => {
        if (!isOpen) {
            setIsOpen(true);
        } else if (showSummary) {
            // If summary is shown, confirm the trip
            onServiceSelect();
            resetSelections();
        } else if (selectedServiceType && selectedPaymentMethod) {
            // If service type and payment method are selected, show summary
            setShowSummary(true);
        } else {
            // Close and reset if panel is open but selections are incomplete (and not showing summary)
            resetSelections();
        }
    };

    const handleBack = () => {
        if (showSummary) {
            setShowSummary(false); // Go back to payment selection
        } else if (selectedPaymentMethod) {
            setSelectedPaymentMethod(null); // Go back to service type selection
        } else if (selectedServiceType) {
            setSelectedServiceType(null); // Go back to category selection
        } else if (selectedCategory) {
            setSelectedCategory(null); // Go back to closed state, or initial category selection (handled by renderServiceSelection)
        } else {
            setIsOpen(false); // Close the selector if no category is selected
        }
    };

    const renderServiceSelection = () => {
        if (showSummary) {
            const categoryDisplay = getCategoryDisplayName(selectedCategory);
            const serviceTypeDisplay = getServiceTypeDisplayName(selectedServiceType);
            const paymentMethodDisplay = getPaymentMethodDisplayName(selectedPaymentMethod);

            return (
                <div key="summary" className="flex flex-col items-center animate-fade-in w-full px-4">
                    <h4 className="text-lg font-bold text-goly-dark mb-4">Revisar Seleção:</h4>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-inner w-full max-w-xs space-y-3">
                        <div className="flex items-center text-goly-dark">
                            <span className="font-semibold mr-2">Categoria:</span>
                            {categoryDisplay.icon}
                            <span className="ml-2">{categoryDisplay.name}</span>
                        </div>
                        <div className="flex items-center text-goly-dark">
                            <span className="font-semibold mr-2">Serviço:</span>
                            {serviceTypeDisplay.icon}
                            <span className="ml-2">{serviceTypeDisplay.name}</span>
                        </div>
                        <div className="flex items-center text-goly-dark">
                            <span className="font-semibold mr-2">Pagamento:</span>
                            {paymentMethodDisplay.icon}
                            <span className="ml-2">{paymentMethodDisplay.name}</span>
                        </div>
                    </div>
                </div>
            );
        }

        if (!selectedCategory) {
            return (
                <div key="categories" className="flex space-x-4 animate-fade-in">
                    <button onClick={() => setSelectedCategory('ride')} className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-xl shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105" aria-label="Escolher Corrida">
                        <CarIcon className="h-10 w-10 text-goly-blue" />
                        <span className="text-sm font-bold text-goly-dark mt-2">Corrida</span>
                    </button>
                    <button onClick={() => setSelectedCategory('delivery')} className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-xl shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105" aria-label="Escolher Entrega">
                        <PackageIcon className="h-10 w-10 text-goly-blue" />
                        <span className="text-sm font-bold text-goly-dark mt-2">Entrega</span>
                    </button>
                </div>
            );
        }

        if (selectedCategory === 'ride' && !selectedServiceType) {
            return (
                <div key="ride-types" className="flex space-x-4 animate-fade-in">
                    <button onClick={() => setSelectedServiceType('car')} className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-xl shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105" aria-label="Corrida de Carro">
                        <CarIcon className="h-10 w-10 text-goly-blue" />
                        <span className="text-sm font-bold text-goly-dark mt-2">Carro</span>
                    </button>
                    <button onClick={() => setSelectedServiceType('motorcycle')} className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-xl shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105" aria-label="Corrida de Moto">
                        <MotorcycleIcon className="h-10 w-10 text-goly-blue" />
                        <span className="text-sm font-bold text-goly-dark mt-2">Moto</span>
                    </button>
                </div>
            );
        }

        if (selectedCategory === 'delivery' && !selectedServiceType) {
            return (
                <div key="delivery-types" className="flex space-x-4 animate-fade-in">
                    <button onClick={() => setSelectedServiceType('pickup')} className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-xl shadow-md text-goly-blue hover:bg-gray-100 transition-transform transform hover:scale-105" aria-label="Entrega para Busca">
                        <span className="text-sm font-bold">BUSCA</span>
                    </button>
                    <button onClick={() => setSelectedServiceType('dropoff')} className="flex flex-col items-center justify-center w-24 h-24 bg-white rounded-xl shadow-md text-goly-blue hover:bg-gray-100 transition-transform transform hover:scale-105" aria-label="Entrega para Deixar">
                        <span className="text-sm font-bold">DEIXA</span>
                    </button>
                </div>
            );
        }

        // If service type is selected, show payment options
        if (selectedServiceType) {
            return (
                <div key="payment-options" className="flex flex-col items-center space-y-3 animate-fade-in w-full px-4">
                    <h4 className="text-lg font-bold text-goly-dark mb-2">Selecione o Pagamento:</h4>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setSelectedPaymentMethod('creditCard')}
                            className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl shadow-md transition-all ${selectedPaymentMethod === 'creditCard' ? 'bg-goly-blue text-white ring-2 ring-goly-yellow' : 'bg-white text-goly-dark hover:bg-gray-100 hover:scale-105'}`}
                            aria-label="Pagar com Cartão de Crédito"
                        >
                            <CreditCardIcon className="h-10 w-10" />
                            <span className="text-sm font-bold mt-2">Cartão</span>
                        </button>
                        <button
                            onClick={() => setSelectedPaymentMethod('pix')}
                            className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl shadow-md transition-all ${selectedPaymentMethod === 'pix' ? 'bg-goly-blue text-white ring-2 ring-goly-yellow' : 'bg-white text-goly-dark hover:bg-gray-100 hover:scale-105'}`}
                            aria-label="Pagar com PIX"
                        >
                            <PixIcon className="h-10 w-10" />
                            <span className="text-sm font-bold mt-2">PIX</span>
                        </button>
                        <button
                            onClick={() => setSelectedPaymentMethod('golyBalance')}
                            className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl shadow-md transition-all ${selectedPaymentMethod === 'golyBalance' ? 'bg-goly-blue text-white ring-2 ring-goly-yellow' : 'bg-white text-goly-dark hover:bg-gray-100 hover:scale-105'}`}
                            aria-label="Pagar com Saldo Goly"
                        >
                            <WalletIcon className="h-10 w-10" />
                            <span className="text-sm font-bold mt-2">Saldo Goly</span>
                        </button>
                    </div>
                </div>
            );
        }
    };

    const getButtonText = () => {
        if (!isOpen) {
            return (
                <span className="flex items-center text-xl font-bold">
                    ESCOLHER SERVIÇO
                    <ArrowRightIcon className="h-6 w-6 ml-3" />
                </span>
            );
        } else if (showSummary) {
            return (
                <span className="flex items-center text-xl font-bold">
                    CONFIRMAR VIAGEM
                    <ArrowRightIcon className="h-6 w-6 ml-3" />
                </span>
            );
        } else if (selectedServiceType && selectedPaymentMethod) {
            return (
                <span className="flex items-center text-xl font-bold">
                    REVISAR SELEÇÃO
                    <ArrowRightIcon className="h-6 w-6 ml-3" />
                </span>
            );
        } else {
            // Panel is open, but selections are incomplete.
            return <CloseIcon className="h-8 w-8" />;
        }
    };

    const isMainButtonDisabled = () => {
        if (!isOpen) return false; // Button opens the panel
        if (showSummary) return false; // Button confirms the trip
        // If panel is open and not showing summary, button is disabled UNLESS both service type and payment are selected
        return !(selectedServiceType && selectedPaymentMethod);
    }

    // Only show back button if not on the first selection screen AND not in the initial closed state
    const showBackButton = isOpen && (selectedCategory || selectedServiceType || selectedPaymentMethod || showSummary);

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col-reverse items-center gap-4">
            {isOpen && (
                <div className="relative p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center w-full max-w-lg min-h-[150px]">
                    {showBackButton && (
                        <button onClick={handleBack} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors" aria-label="Voltar">
                            <BackIcon className="h-6 w-6 text-goly-dark" />
                        </button>
                    )}
                    <div className="flex-1 flex justify-center py-2"> {/* Wrapper for options to center them */}
                        {renderServiceSelection()}
                    </div>
                </div>
            )}
            <button
                onClick={handleMainButtonClick}
                className={`w-72 h-16 bg-goly-yellow text-goly-dark rounded-xl flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-goly-blue transition-all duration-300 transform hover:scale-105 
                    ${isMainButtonDisabled() ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-500'}`}
                disabled={isMainButtonDisabled()}
            >
                {getButtonText()}
            </button>
        </div>
    );
};

export default ServiceSelector;