
import React from 'react';
import { CloseIcon, WalletIcon, ArrowRightIcon, StarIcon } from '../constants';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
  onOpenProfile: (readOnly?: boolean) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenSupport: () => void;
}

const UserProfile: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div onClick={onClick} className="flex flex-col items-center justify-center p-6 border-b border-goly-blue-dark cursor-pointer group hover:bg-white/5 transition-colors">
        <div className="relative transition-transform duration-300 group-hover:scale-105">
            <img src="https://picsum.photos/200" alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-goly-yellow shadow-lg object-cover" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mt-3 text-center group-hover:text-goly-yellow transition-colors">Usuário Goly</h2>
        
        {/* Avaliação de Perfil Section */}
        <div className="flex items-center mt-2 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
            <span className="text-xs text-goly-blue-light mr-2 uppercase font-bold tracking-wider">Avaliação</span>
            <div className="flex items-center">
                <span className="text-white font-bold text-lg mr-1 leading-none">5.0</span>
                <StarIcon className="w-4 h-4 text-goly-yellow" />
            </div>
        </div>
    </div>
);

const AccountBalance: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div onClick={onClick} className="px-4 py-6 cursor-pointer hover:bg-goly-blue-dark transition-colors border-b border-goly-blue-dark group">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-goly-blue-light uppercase tracking-wider flex items-center gap-2">
                    <WalletIcon className="h-5 w-5 text-goly-yellow" />
                    Saldo da conta
                </p>
                <p className="text-xl font-bold text-white mt-1 group-hover:text-goly-yellow transition-colors">
                    Acessar Painel Asaas
                </p>
            </div>
             <ArrowRightIcon className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
        </div>
    </div>
);

const NavLink: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
    <a 
      href="#" 
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
      className="block px-4 py-3 text-lg text-goly-blue-100 hover:bg-goly-blue-dark rounded-md transition-colors"
    >
        {children}
    </a>
);


const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, onOpenAdmin, onOpenProfile, onOpenSettings, onOpenHistory, onOpenSupport }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-goly-blue shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-end p-2">
            <button onClick={onClose} className="p-2 rounded-full text-white hover:bg-goly-blue-dark">
                <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        {/* Clique na foto abre em modo Read Only (true) */}
        <UserProfile onClick={() => { onOpenProfile(true); onClose(); }} />
        <AccountBalance onClick={() => { onOpenAdmin(); onClose(); }} />
        
        <nav className="p-4 space-y-2">
            {/* Clique no link abre em modo Editável (false) */}
            <NavLink onClick={() => { onOpenProfile(false); onClose(); }}>Seu Perfil</NavLink>
            <NavLink onClick={() => { onOpenHistory(); onClose(); }}>Histórico de Corridas</NavLink>
            <div className="my-2 border-t border-goly-blue-dark opacity-50"></div>
            <NavLink onClick={() => { onOpenSettings(); onClose(); }}>Configurações</NavLink>
            <NavLink onClick={() => { onOpenSupport(); onClose(); }}>Suporte</NavLink>
        </nav>

        <div className="absolute bottom-4 left-4 text-xs text-goly-blue-200">
            <p>Central de Ajuda:</p>
            <p>central@goly.com</p>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
