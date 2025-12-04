
import React, { useState, useMemo } from 'react';
import { Person } from '../types';
import GiftItem from './GiftItem';
import { PlusIcon, CakeIcon, TrashIcon, GiftIcon, PencilIcon, ShareIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

interface PersonCardProps {
  person: Person;
  onToggleGiftStatus: (personId: string, giftId: string) => void;
  onAddGift: (personId: string, giftName: string, giftDescription: string) => void;
  onEditGift: (personId: string, giftId: string, newName: string, newDescription: string) => void;
  onDeleteGift: (personId: string, giftId: string) => void;
  onDeletePerson: (personId: string) => void;
  onEditPerson: (personId: string, newName: string, newBirthday: string) => void;
}

const getDaysUntilBirthday = (birthdayString: string): number | null => {
  const months: { [key: string]: number } = { 'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11 };
  
  if(!birthdayString) return null;

  const parts = birthdayString.toLowerCase().replace(/,/g, '').split(' de ');
  if (parts.length !== 2) return null;

  const day = parseInt(parts[0]);
  const monthName = parts[1].trim();
  const month = months[monthName];

  if (isNaN(day) || month === undefined) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  
  let birthdayThisYear = new Date(currentYear, month, day);
  birthdayThisYear.setHours(0, 0, 0, 0);

  if (birthdayThisYear < today) {
    birthdayThisYear.setFullYear(currentYear + 1);
  }

  const diffTime = birthdayThisYear.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

const PersonCard: React.FC<PersonCardProps> = ({ person, onToggleGiftStatus, onAddGift, onEditGift, onDeleteGift, onDeletePerson, onEditPerson }) => {
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftDescription, setNewGiftDescription] = useState('');
  const [isAddingGift, setIsAddingGift] = useState(false);

  const [isEditingPerson, setIsEditingPerson] = useState(false);
  const [editedName, setEditedName] = useState(person.name);
  const [editedBirthday, setEditedBirthday] = useState(person.birthday);
  
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const daysUntilBirthday = useMemo(() => getDaysUntilBirthday(person.birthday), [person.birthday]);
  const birthdayIsUpcoming = daysUntilBirthday !== null && daysUntilBirthday >= 0 && daysUntilBirthday <= 30;

  const handleAddGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGiftName.trim()) {
      onAddGift(person.id, newGiftName, newGiftDescription);
      setNewGiftName('');
      setNewGiftDescription('');
      setIsAddingGift(false);
    }
  };

  const handleCancelAddGift = () => {
    setIsAddingGift(false);
    setNewGiftName('');
    setNewGiftDescription('');
  };

  const handleSavePerson = () => {
    if (editedName.trim() && editedBirthday.trim()) {
        onEditPerson(person.id, editedName.trim(), editedBirthday.trim());
        setIsEditingPerson(false);
    }
  };

  const handleCancelEditPerson = () => {
      setEditedName(person.name);
      setEditedBirthday(person.birthday);
      setIsEditingPerson(false);
  };

  const handleShare = async () => {
    const pending = person.gifts.filter(g => g.status === 'pendiente');
    const purchased = person.gifts.filter(g => g.status === 'comprado');

    let text = `🎂 Regalos para ${person.name} (${person.birthday})\n\n`;

    if (pending.length > 0) {
        text += pending.map(g => `⬜ ${g.name}`).join('\n') + '\n';
    }

    if (purchased.length > 0) {
        if (pending.length > 0) text += '\n';
        text += purchased.map(g => `✅ ${g.name} (Comprado)`).join('\n');
    }

    if (pending.length === 0 && purchased.length === 0) {
        text += '(La lista está vacía)';
    }

    try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
  };

  const renderDaysLeftText = () => {
    if (daysUntilBirthday === null) return null;
    if (daysUntilBirthday === 0) return '¡Es hoy!';
    if (daysUntilBirthday === 1) return 'Falta 1 día';
    return `Faltan ${daysUntilBirthday} días`;
  };

  const pendingGifts = person.gifts.filter(g => g.status === 'pendiente');
  const purchasedGifts = person.gifts.filter(g => g.status === 'comprado');

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow duration-300 ${birthdayIsUpcoming && !isEditingPerson ? 'shadow-lg shadow-yellow-300/50 ring-2 ring-yellow-400' : ''}`}>
      <div className="p-5 bg-indigo-50 border-b border-indigo-200 flex justify-between items-start">
        {isEditingPerson ? (
           <div className="flex-grow space-y-2 w-full">
             <input
               type="text"
               value={editedName}
               onChange={(e) => setEditedName(e.target.value)}
               className="block w-full px-3 py-2 bg-white border border-indigo-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
               placeholder="Nombre"
             />
             <input
               type="text"
               value={editedBirthday}
               onChange={(e) => setEditedBirthday(e.target.value)}
               className="block w-full px-3 py-2 bg-white border border-indigo-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
               placeholder="Cumpleaños (Ej: 15 de Mayo)"
             />
             <div className="flex items-center gap-2 mt-2">
                 <button onClick={handleSavePerson} className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Guardar</button>
                 <button onClick={handleCancelEditPerson} className="px-3 py-1 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancelar</button>
             </div>
           </div>
        ) : (
          <>
            <div className="flex-grow group">
              <div className="flex items-center">
                  <h3 className="text-xl font-bold text-indigo-900">{person.name}</h3>
                  <button 
                      onClick={() => setIsEditingPerson(true)} 
                      className="ml-2 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Editar a ${person.name}`}
                  >
                      <PencilIcon className="h-4 w-4" />
                  </button>
              </div>
              <div className="mt-2 flex justify-between items-center text-sm text-indigo-700">
                <div className="flex items-center">
                  <CakeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{person.birthday}</span>
                </div>
                {daysUntilBirthday !== null && (
                  <div className="text-right">
                    <span className={`font-semibold ${birthdayIsUpcoming ? 'text-yellow-600' : 'text-slate-500'}`}>
                      {renderDaysLeftText()}
                    </span>
                    {birthdayIsUpcoming && <GiftIcon className="h-4 w-4 ml-1 inline-block text-yellow-500 animate-pulse" />}
                  </div>
                )}
              </div>
            </div>
            <div className="ml-4 -mr-1 -mt-1 flex-shrink-0 flex items-center gap-1">
              <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-100 flex-shrink-0"
                  aria-label={isExpanded ? "Colapsar tarjeta" : "Expandir tarjeta"}
                  title={isExpanded ? "Minimizar" : "Expandir"}
              >
                  {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
              </button>
              <div className="w-px h-4 bg-indigo-200 mx-1"></div>
              <button 
                  onClick={handleShare}
                  className={`transition-colors p-1 rounded-full flex-shrink-0 hover:bg-indigo-100 ${isCopied ? 'text-green-600' : 'text-slate-400 hover:text-indigo-600'}`}
                  aria-label="Copiar lista de regalos"
                  title="Copiar lista al portapapeles"
              >
                  {isCopied ? <CheckIcon className="h-5 w-5" /> : <ShareIcon className="h-5 w-5" />}
              </button>
              <button 
                onClick={() => onDeletePerson(person.id)} 
                className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50 flex-shrink-0"
                aria-label={`Eliminar a ${person.name}`}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>
      
      {isExpanded && (
        <>
          <div className="p-5 flex-grow animate-fade-in">
            {person.gifts.length === 0 ? (
               <p className="text-slate-500 text-center py-4">Añade tu primera idea de regalo para {person.name}.</p>
            ) : (
              <ul className="divide-y divide-slate-200">
                {pendingGifts.map(gift => (
                  <GiftItem key={gift.id} gift={gift} onToggleStatus={(giftId) => onToggleGiftStatus(person.id, giftId)} onEdit={(...args) => onEditGift(person.id, ...args)} onDelete={(giftId) => onDeleteGift(person.id, giftId)} />
                ))}
                {purchasedGifts.length > 0 && pendingGifts.length > 0 && <li className="pt-4"></li>}
                {purchasedGifts.map(gift => (
                  <GiftItem key={gift.id} gift={gift} onToggleStatus={(giftId) => onToggleGiftStatus(person.id, giftId)} onEdit={(...args) => onEditGift(person.id, ...args)} onDelete={(giftId) => onDeleteGift(person.id, giftId)} />
                ))}
              </ul>
            )}
          </div>
          <div className="p-5 border-t border-slate-200 bg-slate-50 animate-fade-in">
            {!isAddingGift ? (
               <button
                 onClick={() => setIsAddingGift(true)}
                 className="w-full py-2 border-2 border-dashed border-slate-300 rounded-md text-slate-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm group"
               >
                 <PlusIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                 Añadir nueva idea de regalo
               </button>
            ) : (
                <form onSubmit={handleAddGiftSubmit} className="animate-fade-in">
                  <p className="text-sm font-medium text-slate-700 mb-2">Añadir nueva idea</p>
                  <input
                    type="text"
                    value={newGiftName}
                    onChange={(e) => setNewGiftName(e.target.value)}
                    placeholder="Nombre del regalo"
                    autoFocus
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <textarea
                     value={newGiftDescription}
                     onChange={(e) => setNewGiftDescription(e.target.value)}
                     placeholder="Descripción (opcional)"
                     rows={2}
                     className="mt-2 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      type="submit"
                      className="flex-grow inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Añadir
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAddGift}
                      className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PersonCard;
