
export type GiftStatus = 'pendiente' | 'comprado';

export interface Gift {
  id: string;
  name: string;
  description: string;
  status: GiftStatus;
  price?: number;
  link?: string;
}

export interface Person {
  id: string;
  name: string;
  birthday: string;
  reminderSet?: boolean;
  gifts: Gift[];
}
