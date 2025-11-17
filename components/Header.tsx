import React from 'react';
import { GiftIcon, UserPlusIcon } from './icons';

interface HeaderProps {
  onAddPersonClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddPersonClick }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <GiftIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              Ideas de Regalos por Persona
            </h1>
          </div>
          <button
            onClick={onAddPersonClick}
            className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <UserPlusIcon className="h-5 w-5" />
            Añadir Persona
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
