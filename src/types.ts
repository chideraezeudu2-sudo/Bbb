export type GenerationType = 'floorplan' | 'exterior' | 'interior';

export interface Generation {
  id: string;
  thumbnailUrl: string;
  fullImageUrl: string;
  prompt: string;
  createdAt: string;
  type: GenerationType;
  creditCost: number;
  dimensions: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  credits: number;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
}

export interface CreditPack {
  id: string;
  credits: number;
  price: number;
}

export interface Subscription {
  id: string;
  name: string;
  creditsPerMonth: number;
  price: number;
}
