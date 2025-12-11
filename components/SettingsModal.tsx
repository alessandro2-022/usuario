
import React from 'react';
import { 
    CloseIcon, 
    SystemIcon, 
    DevicesIcon, 
    NetworkIcon, 
    PersonalizationIcon, 
    UserIcon, 
    SecurityIcon, 
    UpdatesIcon,
    ArrowRightIcon
} from '../constants';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingItem: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
}> = ({ icon, title, description }) => (
    <div className="flex items-start p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border border-gray-100 mb-2 group">
        <div className="bg-white p-2 rounded-lg shadow-sm text-goly-blue group-hover:text-goly-yellow transition-colors">
            <div className="w-6 h-6">
                {icon}
            </div>
        </div>
        <div className="ml-4 flex-1">
            <h4 className="text-goly-dark font-bold text-sm">{title}</h4>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">{description}</p>
        </div>
        <div className="self-center ml-2">
            <ArrowRightIcon className="w-4 h-4 text-gray-300 group-hover:text-goly-blue transition-colors" />
        </div>
    </div>
);

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-goly-blue p-4 flex justify-between items-center text-white shrink-0">
                    <h2 className="text-lg font-bold">Configurações</h2>
                    <button 
                        onClick={onClose} 
                        className="hover:bg-white/20 p-1 rounded-full transition-colors"
                        aria-label="Fechar"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Geral</p>
                    
                    <SettingItem 
                        icon={<SystemIcon />}
                        title="Sistema"
                        description="Ajuste a resolução da tela, frequência de atualização e outros parâmetros de visualização."
                    />

                    <SettingItem 
                        icon={<DevicesIcon />}
                        title="Dispositivos"
                        description="Configure periféricos conectados, como teclados, mouse e impressoras."
                    />

                    <SettingItem 
                        icon={<NetworkIcon />}
                        title="Rede e Internet"
                        description="Ajuste as configurações de rede, como Wi-Fi, VPN e segurança."
                    />

                    <SettingItem 
                        icon={<PersonalizationIcon />}
                        title="Personalização"
                        description="Personalize a aparência do dispositivo, como temas, fundos e sons."
                    />

                    <div className="my-4 border-t border-gray-100"></div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">Privacidade & Sistema</p>

                    <SettingItem 
                        icon={<UserIcon />}
                        title="Contas"
                        description="Gerencie suas contas de aplicativos e serviços."
                    />

                    <SettingItem 
                        icon={<SecurityIcon />}
                        title="Segurança"
                        description="Ative ou desative recursos de segurança, como firewall e proteção contra malware."
                    />

                    <SettingItem 
                        icon={<UpdatesIcon />}
                        title="Atualizações"
                        description="Configure as preferências de atualização do sistema operacional."
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
