
import React from 'react';
import { GiftIcon, UserPlusIcon, CalendarIcon, GoogleIcon } from './icons';

interface HeaderProps {
  onAddPersonClick: () => void;
  onCalendarClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddPersonClick, onCalendarClick }) => {
  const handleLoginClick = () => {
      alert("Para activar el Inicio de Sesión real:\n\n1. Necesitas crear un proyecto en Firebase Console.\n2. Habilitar Authentication (Google).\n3. Conectar este código con las API Keys de Firebase.\n\nPor ahora, tus datos se guardan en este navegador.");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <GiftIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-900 hidden sm:block">
              Ideas de Regalos
            </h1>
            <h1 className="text-xl font-bold text-slate-900 block sm:hidden">
              Regalos
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
                onClick={handleLoginClick}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                title="Iniciar Sesión con Google (Próximamente)"
            >
                <GoogleIcon className="h-5 w-5" />
                <span className="hidden md:inline">Acceder</span>
            </button>
            
            <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block"></div>

            <button
                onClick={onCalendarClick}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                title="Ver calendario de cumpleaños"
            >
                <CalendarIcon className="h-5 w-5 text-indigo-600" />
                <span className="hidden sm:inline">Calendario</span>
            </button>
            <button
                onClick={onAddPersonClick}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                <UserPlusIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Añadir Persona</span>
                <span className="sm:hidden">Añadir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
