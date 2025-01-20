export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  note?: string;
}

export interface Budget {
  category: ExpenseCategory;
  limit: number;
}

export interface CustomCategory {
  id: string;
  name: string;
  color: string;
}

export type ExpenseCategory = 
  | 'food'
  | 'transportation'
  | 'housing'
  | 'utilities'
  | 'entertainment'
  | 'healthcare'
  | 'other';

export const categoryColors: Record<ExpenseCategory, string> = {
  food: '#FF6B6B',
  transportation: '#4ECDC4',
  housing: '#45B7D1',
  utilities: '#96CEB4',
  entertainment: '#FFEEAD',
  healthcare: '#D4A5A5',
  other: '#9BA4B4'
};