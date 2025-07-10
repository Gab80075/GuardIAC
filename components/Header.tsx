
import React from 'react';
import { DiamondIcon } from './icons/ShieldIcon';
import { User } from '../types';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
  user: User | null;
  onNewPolicyClick: () => void;
  onComplaintClick: () => void;
  onDashboardClick: () => void;
  onGuardianLegalClick: () => void;
  onClientManagerClick: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onNewPolicyClick, onComplaintClick, onDashboardClick, onGuardianLegalClick, onClientManagerClick, onLogout }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-dark-border-secondary px-4 sm:px-10 py-3">
      <button onClick={onDashboardClick} className="flex items-center gap-4 text-dark-text-primary">
        <div className="size-6 text-dark-text-secondary">
          <DiamondIcon />
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
          GuardIAC
        </h2>
      </button>
      <div className="hidden md:flex flex-1 justify-end items-center gap-8">
        <nav className="flex items-center gap-9">
          <button onClick={onDashboardClick} className="text-dark-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors">Panel</button>
          <button onClick={onNewPolicyClick} className="text-dark-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors">Políticas</button>
          <button onClick={onComplaintClick} className="text-dark-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors">Reclamaciones</button>
          <button onClick={onClientManagerClick} className="text-dark-text-secondary hover:text-white text-sm font-medium leading-normal transition-colors">Registro Clientes</button>
        </nav>
        <div className="flex items-center gap-4">
            <button
            onClick={onGuardianLegalClick}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-red-700 hover:bg-red-800 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
            >
            <span className="truncate">GuardIAn Legal</span>
            </button>
            {user && (
                <button
                onClick={onLogout}
                className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
                title="Cerrar sesión"
                >
                <LogoutIcon className="w-5 h-5" />
                <span className="truncate">{user.name.split(' ')[0]}</span>
                </button>
            )}
        </div>
      </div>
      <div className="md:hidden">
         <button onClick={onGuardianLegalClick} className="flex min-w-[36px] cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-red-700 hover:bg-red-800 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">IA</button>
      </div>
    </header>
  );
};
