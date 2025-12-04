
import React, { useState, useEffect } from 'react';
import { Person, Gift } from './types';
import { INITIAL_PEOPLE } from './constants';
import Header from './components/Header';
import PeopleList from './components/GiftGrid';
import AddPersonModal from './components/SuggestionModal';
import BirthdayCalendarModal from './components/BirthdayCalendarModal';
import { WarningIcon } from './components/icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <WarningIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-slate-500">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
            onClick={onConfirm}
          >
            Eliminar
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const APP_STORAGE_KEY = 'visual-gift-wishlist-data';

const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>(() => {
    try {
      const storedData = window.localStorage.getItem(APP_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : INITIAL_PEOPLE;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return INITIAL_PEOPLE;
    }
  });
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(people));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [people]);

  const handleToggleGiftStatus = (personId: string, giftId: string) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          gifts: person.gifts.map(gift =>
            gift.id === giftId
              ? { ...gift, status: gift.status === 'pendiente' ? 'comprado' : 'pendiente' }
              : gift
          )
        };
      }
      return person;
    }));
  };

  const handleAddPerson = (newPerson: Person) => {
    setPeople(prevPeople => [newPerson, ...prevPeople]);
    setIsAddPersonModalOpen(false);
  };

  const handleDeletePerson = (personId: string) => {
    const person = people.find(p => p.id === personId);
    if (person) {
        setPersonToDelete(person);
    }
  };

  const handleConfirmDeletePerson = () => {
    if (personToDelete) {
        setPeople(people.filter(person => person.id !== personToDelete.id));
        setPersonToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setPersonToDelete(null);
  };

  const handleAddGift = (personId: string, giftName: string, giftDescription: string, price?: number, link?: string) => {
    if (!giftName.trim()) return;

    const newGift: Gift = {
      id: `gift-${Date.now()}`,
      name: giftName.trim(),
      description: giftDescription.trim(),
      status: 'pendiente',
      price: price,
      link: link?.trim()
    };

    setPeople(people.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          gifts: [...person.gifts, newGift],
        };
      }
      return person;
    }));
  };

  const handleEditGift = (personId: string, giftId: string, newName: string, newDescription: string, newPrice?: number, newLink?: string) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          gifts: person.gifts.map(gift =>
            gift.id === giftId
              ? { ...gift, name: newName, description: newDescription, price: newPrice, link: newLink }
              : gift
          )
        };
      }
      return person;
    }));
  };

  const handleEditPerson = (personId: string, newName: string, newBirthday: string) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        // If birthday changes, reset reminderSet to false
        const isBirthdayChanged = person.birthday !== newBirthday;
        return { 
            ...person, 
            name: newName, 
            birthday: newBirthday,
            reminderSet: isBirthdayChanged ? false : person.reminderSet 
        };
      }
      return person;
    }));
  };

  const handleSetReminder = (personId: string) => {
    setPeople(people.map(person => {
      if (person.id === personId) {
        return { ...person, reminderSet: true };
      }
      return person;
    }));
  };

  const handleDeleteGift = (personId: string, giftId: string) => {
     setPeople(people.map(person => {
      if (person.id === personId) {
        return {
          ...person,
          gifts: person.gifts.filter(gift => gift.id !== giftId)
        };
      }
      return person;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header 
        onAddPersonClick={() => setIsAddPersonModalOpen(true)} 
        onCalendarClick={() => setIsCalendarModalOpen(true)}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <PeopleList
          people={people}
          onToggleGiftStatus={handleToggleGiftStatus}
          onAddGift={handleAddGift}
          onEditGift={handleEditGift}
          onDeleteGift={handleDeleteGift}
          onDeletePerson={handleDeletePerson}
          onEditPerson={handleEditPerson}
          onSetReminder={handleSetReminder}
        />
      </main>
      <AddPersonModal
        isOpen={isAddPersonModalOpen}
        onClose={() => setIsAddPersonModalOpen(false)}
        onAddPerson={handleAddPerson}
      />
      <BirthdayCalendarModal 
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        people={people}
      />
      <ConfirmationModal
        isOpen={!!personToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDeletePerson}
        title="Eliminar Persona"
        message={`¿Estás seguro de que quieres eliminar a ${personToDelete?.name}? Se borrarán todos sus regalos de forma permanente.`}
      />
    </div>
  );
};

export default App;
