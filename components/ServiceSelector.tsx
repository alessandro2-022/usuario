import React, { useState } from 'react';
import { ArrowRightIcon, BackIcon, CarIcon, CloseIcon, MotorcycleIcon, PackageIcon } from '../constants';

type ServiceCategory = 'ride' | 'delivery' | null;

interface ServiceSelectorProps {
    onServiceSelect: () => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onServiceSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (isOpen) { // If closing, reset category
            setSelectedCategory(null);
        }
    };
    
    // This function will now trigger the search in the parent component
    const handleRideSelect = () => {
        onServiceSelect();
    };

    const renderOptions = () => {
        if (selectedCategory === 'ride') {
            return (
                <div key="ride" className="flex space-x-4 animate-fade-in">
                    <button onClick={handleRideSelect} className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-110">
                        <CarIcon className="h-8 w-8 text-goly-blue" />
                    </button>
                    <button onClick={handleRideSelect} className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-110">
                        <MotorcycleIcon className="h-8 w-8 text-goly-blue" />
                    </button>
                </div>
            );
        }
        if (selectedCategory === 'delivery') {
            return (
                <div key="delivery" className="flex space-x-4 animate-fade-in">
                    <button onClick={handleRideSelect} className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md text-goly-blue hover:bg-gray-100 transition-transform transform hover:scale-110 flex-col text-xs font-bold">
                        <span>BUSCA</span>
                    </button>
                    <button onClick={handleRideSelect} className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md text-goly-blue hover:bg-gray-100 transition-transform transform hover:scale-110 flex-col text-xs font-bold">
                        <span>DEIXA</span>
                    </button>
                </div>
            );
        }
        return (
            <div key="main" className="flex space-x-4 animate-fade-in">
                <button onClick={() => setSelectedCategory('ride')} className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-110" title="Corridas">
                    <CarIcon className="h-8 w-8 text-goly-blue" />
                </button>
                 <button onClick={() => setSelectedCategory('delivery')} className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md hover:bg-gray-100 transition-transform transform hover:scale-110" title="Entregas">
                    <PackageIcon className="h-8 w-8 text-goly-blue" />
                </button>
            </div>
        );
    };
    
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col-reverse items-center gap-4">
            {isOpen && (
                <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center space-x-4">
                    {selectedCategory && (
                        <button onClick={() => setSelectedCategory(null)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                            <BackIcon className="h-6 w-6 text-goly-dark" />
                        </button>
                    )}
                    {renderOptions()}
                </div>
            )}
            <button
                onClick={handleToggle}
                className="w-72 h-16 bg-goly-yellow text-goly-dark rounded-xl flex items-center justify-center shadow-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-goly-blue transition-all duration-300 transform hover:scale-105"
            >
                {isOpen ? <CloseIcon className="h-8 w-8" /> : (
                    <span className="flex items-center text-xl font-bold">
                        ESCOLHER SERVIÇO
                        <ArrowRightIcon className="h-6 w-6 ml-3" />
                    </span>
                )}
            </button>
        </div>
    );
};

export default ServiceSelector;