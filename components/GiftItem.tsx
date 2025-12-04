
import React, { useState, useRef, useEffect } from 'react';
import { Gift } from '../types';
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from './icons';
// @ts-ignore
import confetti from 'canvas-confetti';

interface GiftItemProps {
    gift: Gift;
    onToggleStatus: (giftId: string) => void;
    onEdit: (giftId: string, newName: string, newDescription: string) => void;
    onDelete: (giftId: string) => void;
}

const GiftItem: React.FC<GiftItemProps> = ({ gift, onToggleStatus, onEdit, onDelete }) => {
    const isPurchased = gift.status === 'comprado';
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(gift.name);
    const [description, setDescription] = useState(gift.description);
    const [isDeleting, setIsDeleting] = useState(false);

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            nameInputRef.current?.focus();
        }
    }, [isEditing]);
    
    const handleSave = () => {
        if (name.trim()) {
            onEdit(gift.id, name, description);
            setIsEditing(false);
        }
    };
    
    const handleCancel = () => {
        setName(gift.name);
        setDescription(gift.description);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm(`¿Seguro que quieres eliminar el regalo "${gift.name}"?`)) {
            setIsDeleting(true);
            setTimeout(() => onDelete(gift.id), 300); // Wait for animation
        }
    };

    const handleToggleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // If we are marking it as purchased (currently not purchased)
        if (!isPurchased) {
            // Get button position for the origin of the confetti
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 60,
                spread: 70,
                origin: { x, y },
                colors: ['#10B981', '#34D399', '#FBBF24', '#F59E0B'], // Emeralds and Ambers
                disableForReducedMotion: true,
                zIndex: 100,
            });
        }
        onToggleStatus(gift.id);
    };

    return (
        <li className={`py-4 flex items-start space-x-4 group transition-all duration-300 ease-in-out ${isDeleting ? 'opacity-0 -translate-x-4 max-h-0 py-0' : 'max-h-40'}`}>
            <button
                onClick={handleToggleClick}
                aria-label={isPurchased ? 'Marcar como pendiente' : 'Marcar como comprado'}
                className={`
                    w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center
                    transition-all duration-200 transform active:scale-90
                    ${isPurchased 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                        : 'bg-white border-slate-300 text-slate-400 hover:border-emerald-500 hover:shadow-sm'
                    }
                `}
                disabled={isEditing}
            >
                {isPurchased && <CheckIcon className="w-4 h-4" />}
            </button>
            <div className="flex-grow">
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <input
                            ref={nameInputRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full px-2 py-1 bg-white border border-indigo-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-semibold"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="block w-full px-2 py-1 bg-white border border-indigo-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="flex items-center gap-2 mt-1">
                            <button onClick={handleSave} className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Guardar</button>
                            <button onClick={handleCancel} className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className={`font-semibold text-slate-800 transition-all duration-300 ${isPurchased ? 'line-through text-slate-400' : ''}`}>
                            {gift.name}
                        </p>
                        <p className={`text-sm text-slate-600 mt-1 transition-all duration-300 ${isPurchased ? 'line-through text-slate-300' : ''}`}>
                            {gift.description}
                        </p>
                    </>
                )}
            </div>
            {!isEditing && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setIsEditing(true)} className="p-1 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" aria-label="Editar regalo">
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={handleDelete} className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50" aria-label="Eliminar regalo">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </li>
    );
};

export default GiftItem;
