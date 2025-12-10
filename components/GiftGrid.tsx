
import React from 'react';
import { Person, PersonColor } from '../types';
import PersonCard from './GiftCard';
import { StarIcon } from './icons';

interface PeopleListProps {
  people: Person[];
  onToggleGiftStatus: (personId: string, giftId: string) => void;
  onAddGift: (personId: string, giftName: string, giftDescription: string, price?: number, link?: string) => void;
  onEditGift: (personId: string, giftId: string, newName: string, newDescription: string, newPrice?: number, newLink?: string) => void;
  onDeleteGift: (personId: string, giftId: string) => void;
  onDeletePerson: (personId: string) => void;
  onEditPerson: (personId: string, newName: string, newBirthday: string, newColor: PersonColor) => void;
  onSetReminder: (personId: string) => void;
  onToggleFavorite: (personId: string) => void;
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


const PeopleList: React.FC<PeopleListProps> = ({ 
  people, 
  onToggleGiftStatus, 
  onAddGift,
  onEditGift,
  onDeleteGift,
  onDeletePerson,
  onEditPerson,
  onSetReminder,
  onToggleFavorite
}) => {

  if (people.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <h2 className="text-2xl font-semibold text-slate-700">Tu lista está vacía</h2>
        <p className="mt-2 text-slate-500">Haz clic en "Añadir Persona" para empezar a organizar tus ideas de regalos.</p>
      </div>
    );
  }

  const sortPeople = (list: Person[]) => {
    return [...list].sort((a, b) => {
      const daysA = getDaysUntilBirthday(a.birthday);
      const daysB = getDaysUntilBirthday(b.birthday);

      if (daysA === null) return 1;
      if (daysB === null) return -1;
      
      return daysA - daysB;
    });
  };

  const favorites = sortPeople(people.filter(p => p.isFavorite));
  const others = sortPeople(people.filter(p => !p.isFavorite));

  return (
    <div className="space-y-8">
      {/* Sección de Favoritos */}
      {favorites.length > 0 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <StarIcon className="w-6 h-6 text-amber-400" fill="currentColor" />
            Favoritos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {favorites.map((person) => (
              <div key={person.id}>
                <PersonCard 
                  person={person} 
                  onToggleGiftStatus={onToggleGiftStatus} 
                  onAddGift={onAddGift}
                  onEditGift={onEditGift}
                  onDeleteGift={onDeleteGift}
                  onDeletePerson={onDeletePerson}
                  onEditPerson={onEditPerson}
                  onSetReminder={onSetReminder}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección General */}
      {others.length > 0 && (
        <div className="animate-fade-in">
          {favorites.length > 0 && (
            <h2 className="text-lg font-semibold text-slate-500 mb-4 flex items-center gap-2">
              👥 Mis contactos
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {others.map((person) => (
              <div key={person.id}>
                <PersonCard 
                  person={person} 
                  onToggleGiftStatus={onToggleGiftStatus} 
                  onAddGift={onAddGift}
                  onEditGift={onEditGift}
                  onDeleteGift={onDeleteGift}
                  onDeletePerson={onDeletePerson}
                  onEditPerson={onEditPerson}
                  onSetReminder={onSetReminder}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleList;
