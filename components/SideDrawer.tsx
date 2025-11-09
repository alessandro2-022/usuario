import React from 'react';
import { CloseIcon } from '../constants';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC = () => (
    <div className="p-4 border-b border-blue-600">
        <img src="https://picsum.photos/80" alt="User Avatar" className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-goly-yellow" />
        <h2 className="text-xl font-semibold text-center text-white">Usuário Goly</h2>
        <p className="text-sm text-blue-200 text-center">usuario@goly.com</p>
    </div>
);

const AccountBalance: React.FC = () => (
    <div className="px-4 py-6">
        <p className="text-sm text-blue-200 uppercase tracking-wider">Saldo da conta</p>
        <p className="text-3xl font-bold text-white mt-1">R$ 123,45</p>
    </div>
);

const NavLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <a href="#" className="block px-4 py-3 text-lg text-blue-100 hover:bg-blue-800 rounded-md transition-colors">
        {children}
    </a>
);


const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
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
            <button onClick={onClose} className="p-2 rounded-full text-white hover:bg-blue-800">
                <CloseIcon className="h-6 w-6" />
            </button>
        </div>
        
        <UserProfile />
        <AccountBalance />
        
        <nav className="p-4 space-y-2">
            <NavLink>Seu Perfil</NavLink>
            <NavLink>Suporte</NavLink>
            <NavLink>Histórico de Corridas</NavLink>
            <NavLink>Configurações</NavLink>
        </nav>

        <div className="absolute bottom-4 left-4 text-xs text-blue-300">
            <p>Central de Ajuda:</p>
            <p>central@goly.com</p>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
