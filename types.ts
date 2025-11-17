export type GiftStatus = 'pendiente' | 'comprado';

export interface Gift {
  id: string;
  name: string;
  description: string;
  status: GiftStatus;
}

export interface Person {
  id: string;
  name: string;
  birthday: string;
  gifts: Gift[];
}