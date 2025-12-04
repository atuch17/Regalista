
import React, { useState, useMemo, useEffect } from 'react';
import { Person } from '../types';
import GiftItem from './GiftItem';
import { PlusIcon, CakeIcon, TrashIcon, GiftIcon, PencilIcon, ShareIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, EuroIcon, LinkIcon, BellIcon } from './icons';

interface PersonCardProps {
  person: Person;
  onToggleGiftStatus: (personId: string, giftId: string) => void;
  onAddGift: (personId: string, giftName: string, giftDescription: string, price?: number, link?: string) => void;
  onEditGift: (personId: string, giftId: string, newName: string, newDescription: string, newPrice?: number, newLink?: string) => void;
  onDeleteGift: (personId: string, giftId: string) => void;
  onDeletePerson: (personId: string) => void;
  onEditPerson: (personId: string, newName: string, newBirthday: string) => void;
  onSetReminder: (personId: string) => void;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

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

// Helper to split "15 de Mayo" into day and month for the edit selectors
const parseBirthdayString = (dateStr: string) => {
    try {
        const parts = dateStr.split(' de ');
        if (parts.length === 2) {
            const day = parseInt(parts[0]);
            // Capitalize first letter to match MONTHS array
            const month = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
            if (!isNaN(day) && MONTHS.includes(month)) {
                return { day, month };
            }
        }
    } catch(e) {}
    // Fallback
    return { day: 1, month: 'Enero' };
};

const PersonCard: React.FC<PersonCardProps> = ({ person, onToggleGiftStatus, onAddGift, onEditGift, onDeleteGift, onDeletePerson, onEditPerson, onSetReminder }) => {
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftDescription, setNewGiftDescription] = useState('');
  const [newGiftPrice, setNewGiftPrice] = useState('');
  const [newGiftLink, setNewGiftLink] = useState('');
  
  const [isAddingGift, setIsAddingGift] = useState(false);

  const [isEditingPerson, setIsEditingPerson] = useState(false);
  const [editedName, setEditedName] = useState(person.name);
  
  // Edit birthday state
  const initialDate = useMemo(() => parseBirthdayString(person.birthday), [person.birthday]);
  const [editedDay, setEditedDay] = useState(initialDate.day);
  const [editedMonth, setEditedMonth] = useState(initialDate.month);
  
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPurchasedExpanded, setIsPurchasedExpanded] = useState(false);

  const daysUntilBirthday = useMemo(() => getDaysUntilBirthday(person.birthday), [person.birthday]);
  const birthdayIsUpcoming = daysUntilBirthday !== null && daysUntilBirthday >= 0 && daysUntilBirthday <= 30;

  // Sync state when entering edit mode
  useEffect(() => {
    if (isEditingPerson) {
        setEditedName(person.name);
        const parsed = parseBirthdayString(person.birthday);
        setEditedDay(parsed.day);
        setEditedMonth(parsed.month);
    }
  }, [isEditingPerson, person]);

  // Dynamic days in month for edit mode
  const daysInMonth = useMemo(() => {
    const monthIndex = MONTHS.indexOf(editedMonth);
    if (monthIndex === 1) return 29; 
    if ([3, 5, 8, 10].includes(monthIndex)) return 30;
    return 31;
  }, [editedMonth]);
  
  // Adjust day if out of bounds
  useEffect(() => {
    if (editedDay > daysInMonth) {
      setEditedDay(daysInMonth);
    }
  }, [daysInMonth, editedDay]);

  // Budget calculations used for sharing text only
  const totalBudget = person.gifts.reduce((sum, gift) => sum + (gift.price || 0), 0);

  const handleAddGiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGiftName.trim()) {
      const price = newGiftPrice ? parseFloat(newGiftPrice) : undefined;
      onAddGift(person.id, newGiftName, newGiftDescription, price, newGiftLink);
      setNewGiftName('');
      setNewGiftDescription('');
      setNewGiftPrice('');
      setNewGiftLink('');
      setIsAddingGift(false);
    }
  };

  const handleCancelAddGift = () => {
    setIsAddingGift(false);
    setNewGiftName('');
    setNewGiftDescription('');
    setNewGiftPrice('');
    setNewGiftLink('');
  };

  const handleSavePerson = () => {
    if (editedName.trim()) {
        const formattedBirthday = `${editedDay} de ${editedMonth}`;
        onEditPerson(person.id, editedName.trim(), formattedBirthday);
        setIsEditingPerson(false);
    }
  };

  const handleCancelEditPerson = () => {
      setIsEditingPerson(false);
  };

  const handleShare = async () => {
    const pending = person.gifts.filter(g => g.status === 'pendiente');
    const purchased = person.gifts.filter(g => g.status === 'comprado');

    let text = `🎂 Regalos para ${person.name} (${person.birthday})\n`;
    text += `💰 Presupuesto estimado: ${totalBudget}€\n\n`;

    if (pending.length > 0) {
        text += pending.map(g => {
            let line = `⬜ ${g.name}`;
            if (g.price) line += ` (${g.price}€)`;
            if (g.link) line += ` - ${g.link}`;
            return line;
        }).join('\n') + '\n';
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

  const handleAddToCalendar = () => {
    const months: { [key: string]: number } = { 'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11 };
    
    // Simple parsing, assuming format "Day de Month"
    const parts = person.birthday.toLowerCase().replace(/,/g, '').split(' de ');
    
    // Fallback if parsing fails
    let month = 0;
    let day = 1;
    let isValid = false;

    if (parts.length === 2) {
       day = parseInt(parts[0]);
       const monthName = parts[1].trim();
       if (months[monthName] !== undefined && !isNaN(day)) {
           month = months[monthName];
           isValid = true;
       }
    }

    if (!isValid) {
        alert("No se pudo detectar la fecha correcta.");
        return;
    }

    const today = new Date();
    let year = today.getFullYear();
    const date = new Date(year, month, day);
    
    // If date passed, suggest next year
    if (date < today) {
        year += 1;
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    const start = `${year}${pad(month + 1)}${pad(day)}`;
    // Google calendar all-day events start/end format
    const nextDay = new Date(year, month, day + 1);
    const end = `${nextDay.getFullYear()}${pad(nextDay.getMonth() + 1)}${pad(nextDay.getDate())}`;

    const title = encodeURIComponent(`🎂 Cumpleaños de ${person.name}`);
    const details = encodeURIComponent(`Recordatorio de Visual Gift Wishlist.\n\nRegalos pendientes: ${person.gifts.filter(g => g.status === 'pendiente').length}`);
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&recur=RRULE:FREQ=YEARLY`;
    
    window.open(calendarUrl, '_blank');
    onSetReminder(person.id);
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
    <div className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow duration-300 relative ${birthdayIsUpcoming && !isEditingPerson ? 'shadow-lg shadow-yellow-300/50 ring-2 ring-yellow-400' : ''}`}>
      
      {/* Absolute Actions (Top Right) */}
      {!isEditingPerson && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-indigo-50/80 backdrop-blur-sm rounded-full p-0.5 pl-2 border border-indigo-100 shadow-sm">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-100"
                aria-label={isExpanded ? "Colapsar tarjeta" : "Expandir tarjeta"}
                title={isExpanded ? "Minimizar" : "Expandir"}
            >
                {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            </button>
            <div className="w-px h-3 bg-indigo-200 mx-0.5"></div>
            <button 
                onClick={handleAddToCalendar}
                className={`transition-colors p-1 rounded-full hover:bg-indigo-100 ${person.reminderSet ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
                aria-label={person.reminderSet ? "Recordatorio activado" : "Añadir recordatorio al calendario"}
                title={person.reminderSet ? "Recordatorio añadido a Google Calendar" : "Crear recordatorio en Google Calendar"}
            >
                <BellIcon className="h-4 w-4" fill={person.reminderSet ? "currentColor" : "none"} />
            </button>
            <button 
                onClick={handleShare}
                className={`transition-colors p-1 rounded-full hover:bg-indigo-100 ${isCopied ? 'text-green-600' : 'text-slate-400 hover:text-indigo-600'}`}
                aria-label="Copiar lista de regalos"
                title="Copiar lista al portapapeles"
            >
                {isCopied ? <CheckIcon className="h-4 w-4" /> : <ShareIcon className="h-4 w-4" />}
            </button>
            <button 
            onClick={() => onDeletePerson(person.id)} 
            className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
            aria-label={`Eliminar a ${person.name}`}
            >
            <TrashIcon className="h-4 w-4" />
            </button>
        </div>
      )}

      <div className="p-5 bg-indigo-50 border-b border-indigo-200 flex flex-col relative">
        <div className="flex justify-between items-start">
        {isEditingPerson ? (
           <div className="flex-grow space-y-2 w-full pt-6"> {/* Added padding top to clear absolute buttons if present (though hidden in edit mode) */}
             <input
               type="text"
               value={editedName}
               onChange={(e) => setEditedName(e.target.value)}
               className="block w-full px-3 py-2 bg-white border border-indigo-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
               placeholder="Nombre"
             />
             <div className="flex gap-2">
                 <div className="w-1/3">
                    <select
                        value={editedDay}
                        onChange={(e) => setEditedDay(parseInt(e.target.value))}
                        className="block w-full px-3 py-2 bg-white border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                 </div>
                 <div className="w-2/3">
                    <select
                        value={editedMonth}
                        onChange={(e) => setEditedMonth(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {MONTHS.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                 </div>
             </div>
             <div className="flex items-center gap-2 mt-2">
                 <button onClick={handleSavePerson} className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Guardar</button>
                 <button onClick={handleCancelEditPerson} className="px-3 py-1 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancelar</button>
             </div>
           </div>
        ) : (
          <div className="w-full">
            <div className="flex items-center pr-28"> {/* Right padding to avoid overlap with absolute buttons */}
                <h3 className="text-xl font-bold text-indigo-900 truncate">{person.name}</h3>
                <button 
                    onClick={() => setIsEditingPerson(true)} 
                    className="ml-2 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Editar a ${person.name}`}
                >
                    <PencilIcon className="h-4 w-4" />
                </button>
            </div>
            
            <div className="mt-2 flex justify-between items-center text-sm text-indigo-700 w-full">
                <div className="flex items-center">
                    <CakeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{person.birthday}</span>
                </div>
                {daysUntilBirthday !== null && (
                    <div className="text-right flex-shrink-0">
                    <span className={`font-semibold ${birthdayIsUpcoming ? 'text-yellow-600' : 'text-slate-500'}`}>
                        {renderDaysLeftText()}
                    </span>
                    {birthdayIsUpcoming && <GiftIcon className="h-4 w-4 ml-1 inline-block text-yellow-500 animate-pulse" />}
                    </div>
                )}
            </div>
          </div>
        )}
        </div>
      </div>
      
      {isExpanded && (
        <>
          <div className="p-5 flex-grow animate-fade-in">
            {person.gifts.length === 0 ? (
               <p className="text-slate-500 text-center py-4">Añade tu primera idea de regalo para {person.name}.</p>
            ) : (
              <div className="space-y-4">
                {/* Pending Gifts */}
                {pendingGifts.length > 0 && (
                   <ul className="divide-y divide-slate-200">
                     {pendingGifts.map(gift => (
                       <GiftItem key={gift.id} gift={gift} onToggleStatus={(giftId) => onToggleGiftStatus(person.id, giftId)} onEdit={(...args) => onEditGift(person.id, ...args)} onDelete={(giftId) => onDeleteGift(person.id, giftId)} />
                     ))}
                   </ul>
                )}
                
                {/* Purchased Gifts (Collapsible) */}
                {purchasedGifts.length > 0 && (
                    <div className="mt-2">
                        <button 
                            onClick={() => setIsPurchasedExpanded(!isPurchasedExpanded)}
                            className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-200 text-xs font-medium text-slate-500 transition-colors"
                        >
                            <span className="flex items-center">
                                <CheckIcon className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                                {purchasedGifts.length} {purchasedGifts.length === 1 ? 'comprado' : 'comprados'}
                            </span>
                            {isPurchasedExpanded ? <ChevronUpIcon className="h-3.5 w-3.5" /> : <ChevronDownIcon className="h-3.5 w-3.5" />}
                        </button>
                        
                        {isPurchasedExpanded && (
                            <ul className="divide-y divide-slate-200 mt-2 pl-2 border-l-2 border-slate-100 animate-fade-in">
                                {purchasedGifts.map(gift => (
                                <GiftItem key={gift.id} gift={gift} onToggleStatus={(giftId) => onToggleGiftStatus(person.id, giftId)} onEdit={(...args) => onEditGift(person.id, ...args)} onDelete={(giftId) => onDeleteGift(person.id, giftId)} />
                                ))}
                            </ul>
                        )}
                    </div>
                )}
              </div>
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
                <form onSubmit={handleAddGiftSubmit} className="animate-fade-in space-y-3">
                  <p className="text-sm font-medium text-slate-700">Añadir nueva idea</p>
                  
                  <input
                    type="text"
                    value={newGiftName}
                    onChange={(e) => setNewGiftName(e.target.value)}
                    placeholder="Nombre del regalo (obligatorio)"
                    autoFocus
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  
                  <textarea
                     value={newGiftDescription}
                     onChange={(e) => setNewGiftDescription(e.target.value)}
                     placeholder="Descripción"
                     rows={2}
                     className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />

                  <div className="flex gap-3">
                     <div className="relative w-1/3">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EuroIcon className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="number"
                            value={newGiftPrice}
                            onChange={(e) => setNewGiftPrice(e.target.value)}
                            placeholder="Precio"
                            className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                     </div>
                     <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={newGiftLink}
                            onChange={(e) => setNewGiftLink(e.target.value)}
                            placeholder="Enlace (https://...)"
                            className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                     </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
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
