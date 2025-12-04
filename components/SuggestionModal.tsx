
import React, { useState, useEffect, useMemo } from 'react';
import { XIcon, UserPlusIcon } from './icons';
import { Person } from '../types';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPerson: (person: Person) => void;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const AddPersonModal: React.FC<AddPersonModalProps> = ({ isOpen, onClose, onAddPerson }) => {
  const [name, setName] = useState('');
  // Default to current date or generic
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<string>('Enero');
  
  const [formError, setFormError] = useState<string | null>(null);

  const daysInMonth = useMemo(() => {
    const monthIndex = MONTHS.indexOf(selectedMonth);
    if (monthIndex === 1) return 29; // Febrero (max allowed)
    if ([3, 5, 8, 10].includes(monthIndex)) return 30; // Abril, Junio, Sept, Nov
    return 31;
  }, [selectedMonth]);

  // Adjust day if month changes and day is out of range (e.g. 31 changed to Feb)
  useEffect(() => {
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [daysInMonth, selectedDay]);

  const handleClose = () => {
    setName('');
    setSelectedDay(1);
    setSelectedMonth('Enero');
    setFormError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Por favor, escribe un nombre.");
      return;
    }

    setFormError(null);
    
    const formattedBirthday = `${selectedDay} de ${selectedMonth}`;

    const newPerson: Person = {
      id: `person-${Date.now()}`,
      name: name.trim(),
      birthday: formattedBirthday,
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
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Fecha de Cumpleaños</label>
              <div className="flex gap-2 mt-1">
                 <div className="w-1/3">
                    <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                 </div>
                 <div className="w-2/3">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {MONTHS.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                 </div>
              </div>
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
