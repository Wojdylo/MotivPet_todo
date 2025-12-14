export interface Task {
  id: string;
  title: string;
  deadline: number; // Timestamp
  completed: boolean;
  completedAt?: number;
  pointsEarned?: number;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind class mostly (e.g., 'bg-red-500')
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or emoji
  unlocked: boolean;
  unlockedAt?: number;
  conditionType: 'count' | 'streak' | 'early' | 'wealth' | 'collection';
  threshold: number;
}

export interface UserStats {
  totalCompleted: number;
  weeklyCompleted: number; // New
  monthlyCompleted: number; // New
  currentStreak: number;
  lastCompletionDate: string | null; // YYYY-MM-DD
  earlyCompletions: number;
  totalPointsEarned: number;
}

export type PetType = 
  | 'bear' | 'cat' | 'bunny' | 'fox' | 'panda' | 'axolotl' 
  | 'dog' | 'koala' | 'pig' | 'frog' | 'penguin' | 'raccoon' 
  | 'tiger' | 'lion' | 'hamster' | 'owl';

export type AccessoryType = 'hat' | 'glasses' | 'neck' | 'face';

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  color: string; // Hex code or Tailwind color class
  secondaryColor?: string; // For ears/details
  unlocked: boolean;
  cost: number;
  isSpecial?: boolean; // For achievement rewards
}

export interface Accessory {
    id: string;
    name: string;
    type: AccessoryType;
    cost: number;
    icon: string; // Emoji for UI
}

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  gradient: string;
  cost: number;
}

export interface Friend {
    id: string;
    name: string;
    code: string;
    petType: PetType;
    petColor: string;
    weeklyScore: number;
    monthlyScore: number;
    isBot: boolean;
}

export enum GameView {
  DASHBOARD = 'DASHBOARD',
  SHOP = 'SHOP',
  ADD_TASK = 'ADD_TASK',
  CATEGORIES = 'CATEGORIES',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  SOCIAL = 'SOCIAL'
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";