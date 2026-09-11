export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  type: TransactionType;
  date: string; // ISO date string
  isPaid?: boolean; // For expenses: true = paid, false = pending
}

export interface Note {
  id: string;
  content: string;
  date: string;
}

export interface FinanceData {
  transactions: Transaction[];
  categories: Category[];
  notes: Note[];
}
