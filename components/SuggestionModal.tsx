import React, { useState } from 'react';
import { XIcon, UserPlusIcon } from './icons';
import { Person } from '../types';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPerson: (person: Person) => void;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({ isOpen, onClose, onAddPerson }) => {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleClose = () => {
    setName('');
    setBirthday('');
    setFormError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthday.trim()) {
      setFormError("Por favor, completa el nombre y la fecha de cumpleaños.");
      return;
    }

    setFormError(null);

    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name: name.trim(),
      birthday: birthday.trim(),
      gifts: [],
    };
    onAddPerson(newPerson);
    handleClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-transform duration-300 scale-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Añadir Nueva Persona</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ej: Mamá, Juan, etc."
              />
            </div>
            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-slate-700">Fecha de Cumpleaños</label>
              <input
                type="text"
                id="birthday"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ej: 15 de Mayo"
              />
            </div>
            {formError && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{formError}</div>}
          </div>
          <div className="bg-slate-50 px-6 py-4 flex justify-end items-center space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlusIcon className="h-5 w-5" />
              Guardar Persona
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPersonModal;