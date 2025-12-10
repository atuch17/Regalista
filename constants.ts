
import { Person } from './types';

export const INITIAL_PEOPLE: Person[] = [
  {
    id: 'person-1',
    name: 'Mamá',
    birthday: '15 de Mayo',
    reminderSet: false,
    isFavorite: false,
    color: 'rose',
    gifts: [
      {
        id: 'gift-1-1',
        name: 'Set de Jardinería Premium',
        description: 'Herramientas ergonómicas de acero inoxidable.',
        status: 'pendiente',
      },
      {
        id: 'gift-1-2',
        name: 'Colección de Agatha Christie',
        description: 'Edición especial de bolsillo con sus obras más famosas.',
        status: 'comprado',
        price: 45,
      },
    ],
  },
  {
    id: 'person-2',
    name: 'Juan',
    birthday: '22 de Noviembre',
    reminderSet: false,
    isFavorite: false,
    color: 'blue',
    gifts: [
      {
        id: 'gift-2-1',
        name: 'Teclado Mecánico Compacto',
        description: 'Inalámbrico, con switches silenciosos para programar.',
        status: 'pendiente',
        link: 'https://amazon.es'
      },
      {
        id: 'gift-2-2',
        name: 'Suscripción a Café',
        description: 'Recibe granos de diferentes orígenes cada mes.',
        status: 'pendiente',
        price: 25
      },
    ],
  },
];
