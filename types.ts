
export type GiftStatus = 'pendiente' | 'comprado';

export type GiftPriority = 'high' | 'medium' | 'low';

export interface Gift {
  id: string;
  name: string;
  description: string;
  status: GiftStatus;
  price?: number;
  link?: string;
  priority: GiftPriority;
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
