
export type GiftStatus = 'pendiente' | 'comprado';

export interface Gift {
  id: string;
  name: string;
  description: string;
  status: GiftStatus;
  price?: number;
  link?: string;
}

export type PersonColor = 'slate' | 'rose' | 'orange' | 'emerald' | 'blue' | 'violet';

export interface Person {
  id: string;
  name: string;
  birthday: string;
  reminderSet?: boolean;
  isFavorite?: boolean;
  color?: PersonColor;
  gifts: Gift[];
}
