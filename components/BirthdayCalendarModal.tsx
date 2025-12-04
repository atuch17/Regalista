
import React, { useState, useEffect, useMemo } from 'react';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, CakeIcon } from './icons';
import { Person } from '../types';

interface BirthdayCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  people: Person[];
}

const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

const DAYS_OF_WEEK = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

// Helper to parse "15 de Mayo" or "15 de mayo"
const parseBirthday = (birthdayStr: string): { day: number; monthIndex: number } | null => {
  if (!birthdayStr) return null;
  try {
    const parts = birthdayStr.toLowerCase().replace(/,/g, '').split(' de ');
    if (parts.length !== 2) return null;

    const day = parseInt(parts[0]);
    const monthIndex = MONTHS.indexOf(parts[1].trim());

    if (isNaN(day) || monthIndex === -1) return null;

    return { day, monthIndex };
  } catch (e) {
    return null;
  }
};

const BirthdayCalendarModal: React.FC<BirthdayCalendarModalProps> = ({ isOpen, onClose, people }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Reset to current month when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentDate(new Date());
    }
  }, [isOpen]);

  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  // Get day of week for the 1st (0=Sunday, 1=Monday...)
  const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  // Map birthdays to days
  const birthdaysInMonth = useMemo(() => {
    const map: { [day: number]: Person[] } = {};
    people.forEach(person => {
      const parsed = parseBirthday(person.birthday);
      if (parsed && parsed.monthIndex === currentMonthIndex) {
        if (!map[parsed.day]) {
          map[parsed.day] = [];
        }
        map[parsed.day].push(person);
      }
    });
    return map;
  }, [people, currentMonthIndex]);

  if (!isOpen) return null;

  const renderCalendarCells = () => {
    const cells = [];
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[5rem] bg-slate-50/50 border-b border-r border-slate-100"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasBirthday = !!birthdaysInMonth[day];
      const isToday = day === today.getDate() && currentMonthIndex === today.getMonth() && currentYear === today.getFullYear();
      
      cells.push(
        <div 
          key={day} 
          className={`min-h-[5rem] border-b border-r border-slate-100 p-1 relative group transition-colors hover:bg-slate-50
            ${isToday ? 'bg-indigo-50/60' : 'bg-white'}
          `}
        >
          <div className="flex justify-between items-start">
             <span className={`
                inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-500'}
              `}>
                {day}
              </span>
          </div>
          
          {hasBirthday && (
            <div className="mt-1 flex flex-col gap-1 overflow-hidden">
              {birthdaysInMonth[day].map(person => (
                <div 
                  key={person.id} 
                  className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded border border-amber-200 truncate flex items-center gap-1 shadow-sm"
                  title={`${person.name} - ${person.birthday}`}
                >
                  <CakeIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate font-medium">{person.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button onClick={handleNextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600">
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
            <h2 className="text-xl font-bold text-slate-800 capitalize flex items-baseline gap-2">
              {MONTHS[currentMonthIndex]} <span className="text-slate-400 font-normal text-lg">{currentYear}</span>
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center flex-shrink-0">
          {DAYS_OF_WEEK.map(day => (
            <div key={day} className="py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="overflow-y-auto flex-grow bg-slate-100 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            <div className="grid grid-cols-7 border-l border-slate-100 bg-white min-h-full">
                {renderCalendarCells()}
            </div>
        </div>
        
        {/* Footer with summary */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
             <span>Hoy es {today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
             <div className="flex gap-4">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600"></span> Hoy</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Cumpleaños</div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayCalendarModal;
