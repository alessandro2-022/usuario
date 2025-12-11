
import React, { useState, useEffect } from 'react';
import { CloseIcon, UserIcon, PhoneIcon, MapPinIcon, CalendarIcon, StarIcon } from '../constants';
import { UserProfile } from '../types';

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    onUpdateProfile: (updatedUser: UserProfile) => void;
    readOnly?: boolean;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user, onUpdateProfile, readOnly = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserProfile>(user);

    // Update form data if the user prop updates
    useEffect(() => {
        setFormData(user);
    }, [user]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? parseInt(value) || 0 : value
        }));
    };

    const handleSave = () => {
        onUpdateProfile(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(user); // Revert changes
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                {/* Header with Cover-like background */}
                <div className="bg-goly-blue p-6 relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30 text-white transition-colors"
                        aria-label="Fechar"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                    
                    <div className="flex flex-col items-center mt-4">
                        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Name in Header (View Mode Only) */}
                        {!isEditing && (
                            <>
                                <h2 className="text-xl font-bold text-white mt-3">{user.name || "Novo Usuário"}</h2>
                                <p className="text-goly-blue-light text-sm">{user.email || "Sem e-mail cadastrado"}</p>
                            </>
                        )}
                        {isEditing && (
                            <p className="text-white mt-3 font-semibold">Editando Perfil</p>
                        )}
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4 bg-white max-h-[60vh] overflow-y-auto">
                    {readOnly ? (
                        <>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 border-b pb-2">Avaliações de Motoristas</h3>
                            <div className="space-y-3">
                                {/* Lista de Reviews vazia inicialmente - Será preenchida via Backend */}
                                <div className="text-center py-6">
                                    <p className="text-gray-400 text-sm">Nenhuma avaliação recebida ainda.</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 border-b pb-2">Dados Pessoais</h3>

                            <div className="space-y-4">
                                {/* Name Input */}
                                <div className="flex items-start space-x-3 text-goly-dark">
                                    <UserIcon className="w-5 h-5 text-goly-blue mt-2.5" />
                                    <div className="w-full">
                                        <p className="text-xs text-gray-500 mb-1">Nome Completo</p>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Seu nome"
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-goly-blue text-sm"
                                            />
                                        ) : (
                                            <p className="font-semibold">{user.name || "-"}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email Input */}
                                {isEditing && (
                                     <div className="flex items-start space-x-3 text-goly-dark">
                                     <span className="w-5 flex justify-center mt-2.5 font-bold text-goly-blue">@</span>
                                     <div className="w-full">
                                         <p className="text-xs text-gray-500 mb-1">Email</p>
                                         <input 
                                             type="email" 
                                             name="email"
                                             value={formData.email}
                                             onChange={handleInputChange}
                                             placeholder="seu@email.com"
                                             className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-goly-blue text-sm"
                                         />
                                     </div>
                                 </div>
                                )}

                                {/* CPF Input */}
                                {isEditing && (
                                     <div className="flex items-start space-x-3 text-goly-dark">
                                     <div className="w-5 h-5 mt-2.5 flex items-center justify-center font-bold text-goly-blue text-xs">ID</div>
                                     <div className="w-full">
                                         <p className="text-xs text-gray-500 mb-1">CPF/CNPJ</p>
                                         <input 
                                             type="text" 
                                             name="cpfCnpj"
                                             value={formData.cpfCnpj || ''}
                                             onChange={handleInputChange}
                                             placeholder="000.000.000-00"
                                             className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-goly-blue text-sm"
                                         />
                                     </div>
                                 </div>
                                )}

                                {/* Age Input */}
                                <div className="flex items-start space-x-3 text-goly-dark">
                                    <CalendarIcon className="w-5 h-5 text-goly-blue mt-2.5" />
                                    <div className="w-full">
                                        <p className="text-xs text-gray-500 mb-1">Idade</p>
                                        {isEditing ? (
                                            <input 
                                                type="number" 
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-goly-blue text-sm"
                                            />
                                        ) : (
                                            <p className="font-semibold">{user.age ? `${user.age} anos` : "-"}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Phone Input */}
                                <div className="flex items-start space-x-3 text-goly-dark">
                                    <PhoneIcon className="w-5 h-5 text-goly-blue mt-2.5" />
                                    <div className="w-full">
                                        <p className="text-xs text-gray-500 mb-1">Número Celular</p>
                                        {isEditing ? (
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="(00) 00000-0000"
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-goly-blue text-sm"
                                            />
                                        ) : (
                                            <p className="font-semibold">{user.phone || "-"}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Address Input */}
                                <div className="flex items-start space-x-3 text-goly-dark">
                                    <MapPinIcon className="w-5 h-5 text-goly-blue mt-2.5" />
                                    <div className="w-full">
                                        <p className="text-xs text-gray-500 mb-1">Endereço Principal</p>
                                        {isEditing ? (
                                            <textarea 
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Rua, Número, Bairro..."
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-goly-blue text-sm resize-none"
                                                rows={2}
                                            />
                                        ) : (
                                            <p className="font-semibold">{user.address || "-"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Botões de Ação */}
                            {isEditing ? (
                                <div className="flex space-x-3 mt-6">
                                    <button 
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-colors shadow-md"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="w-full mt-6 bg-gray-100 text-goly-blue font-bold py-3 rounded-xl hover:bg-goly-blue hover:text-white transition-colors border border-goly-blue"
                                >
                                    Editar Perfil
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfileModal;
