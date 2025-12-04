
import React, { useState, useRef, useEffect } from 'react';
import { Gift } from '../types';
import { CheckIcon, PencilIcon, TrashIcon, LinkIcon, EuroIcon } from './icons';
// @ts-ignore
import confetti from 'canvas-confetti';

interface GiftItemProps {
    gift: Gift;
    onToggleStatus: (giftId: string) => void;
    onEdit: (giftId: string, newName: string, newDescription: string, newPrice?: number, newLink?: string) => void;
    onDelete: (giftId: string) => void;
}

const GiftItem: React.FC<GiftItemProps> = ({ gift, onToggleStatus, onEdit, onDelete }) => {
    const isPurchased = gift.status === 'comprado';
    const [isEditing, setIsEditing] = useState(false);
    
    // Edit state
    const [name, setName] = useState(gift.name);
    const [description, setDescription] = useState(gift.description);
    const [price, setPrice] = useState(gift.price?.toString() || '');
    const [link, setLink] = useState(gift.link || '');
    
    const [isDeleting, setIsDeleting] = useState(false);

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            nameInputRef.current?.focus();
        }
    }, [isEditing]);
    
    const handleSave = () => {
        if (name.trim()) {
            const numPrice = price ? parseFloat(price) : undefined;
            onEdit(gift.id, name, description, numPrice, link);
            setIsEditing(false);
        }
    };
    
    const handleCancel = () => {
        setName(gift.name);
        setDescription(gift.description);
        setPrice(gift.price?.toString() || '');
        setLink(gift.link || '');
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

    const openLink = () => {
        if (gift.link) {
            const url = gift.link.startsWith('http') ? gift.link : `https://${gift.link}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <li className={`py-4 flex items-start space-x-3 sm:space-x-4 group transition-all duration-300 ease-in-out ${isDeleting ? 'opacity-0 -translate-x-4 max-h-0 py-0' : 'max-h-60'}`}>
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
            <div className="flex-grow min-w-0">
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <input
                            ref={nameInputRef}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full px-2 py-1 bg-white border border-indigo-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-semibold"
                            placeholder="Nombre del regalo"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                            className="block w-full px-2 py-1 bg-white border border-indigo-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Descripción"
                        />
                        <div className="flex gap-2">
                             <input 
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Precio (€)"
                                className="w-1/3 px-2 py-1 bg-white border border-indigo-300 rounded-md text-sm"
                             />
                             <input 
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Enlace URL"
                                className="w-2/3 px-2 py-1 bg-white border border-indigo-300 rounded-md text-sm"
                             />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <button onClick={handleSave} className="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Guardar</button>
                            <button onClick={handleCancel} className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start gap-2">
                             <div className="flex flex-col">
                                <p className={`font-semibold text-slate-800 transition-all duration-300 leading-tight ${isPurchased ? 'line-through text-slate-400' : ''}`}>
                                    {gift.name}
                                </p>
                             </div>
                             {(gift.price !== undefined && gift.price > 0) && (
                                <span className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isPurchased ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-700'}`}>
                                   {gift.price} €
                                </span>
                             )}
                        </div>
                        
                        {gift.description && (
                             <p className={`text-sm text-slate-600 mt-1 transition-all duration-300 ${isPurchased ? 'line-through text-slate-300' : ''}`}>
                                {gift.description}
                            </p>
                        )}
                        
                        {gift.link && (
                            <button 
                                onClick={openLink}
                                className={`mt-1.5 inline-flex items-center text-xs hover:underline ${isPurchased ? 'text-slate-400' : 'text-blue-600 hover:text-blue-800'}`}
                            >
                                <LinkIcon className="w-3 h-3 mr-1" />
                                {new URL(gift.link.startsWith('http') ? gift.link : `https://${gift.link}`).hostname}
                            </button>
                        )}
                    </>
                )}
            </div>
            {!isEditing && (
                <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
