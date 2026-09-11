import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { FinanceData, Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Usar el mes actual dinámicamente para que la información se vea de inmediato al abrir la app
const dateString = new Date().toISOString();

const initialData: FinanceData = {
  transactions: [
    // Ingresos
    {
      id: uuidv4(),
      name: 'Salario',
      amount: 3000000,
      categoryId: 'banco_inc',
      type: 'income',
      date: dateString,
    },
    {
      id: uuidv4(),
      name: 'Venta laptop',
      amount: 1200000,
      categoryId: 'efectivo_inc',
      type: 'income',
      date: dateString,
    },

    // Gastos
    {
      id: uuidv4(),
      name: 'Arriendo',
      amount: 800000,
      categoryId: 'banco_exp',
      type: 'expense',
      date: dateString,
      isPaid: true,
    },
    {
      id: uuidv4(),
      name: 'Mercado',
      amount: 450000,
      categoryId: 'banco_exp',
      type: 'expense',
      date: dateString,
      isPaid: false,
    },
    {
      id: uuidv4(),
      name: 'Transporte',
      amount: 150000,
      categoryId: 'efectivo_exp',
      type: 'expense',
      date: dateString,
      isPaid: false,
    },
    {
      id: uuidv4(),
      name: 'Internet',
      amount: 80000,
      categoryId: 'banco_exp',
      type: 'expense',
      date: dateString,
      isPaid: true,
    },
    {
      id: uuidv4(),
      name: 'Cine',
      amount: 60000,
      categoryId: 'efectivo_exp',
      type: 'expense',
      date: dateString,
      isPaid: false,
    },
  ],
  categories: [
    { id: 'banco_inc', name: 'Banco', type: 'income' },
    { id: 'efectivo_inc', name: 'Efectivo', type: 'income' },
    { id: 'banco_exp', name: 'Banco', type: 'expense' },
    { id: 'efectivo_exp', name: 'Efectivo', type: 'expense' },
  ],
  notes: [
    {
      id: uuidv4(),
      content:
        'Bienvenido a Kipo. Puedes borrar estos datos de prueba y empezar a registrar tus finanzas.',
      date: dateString,
    },
  ],
};

export function useFinanceData() {
  const [data, setData] = useLocalStorage<FinanceData>('kipo_finance_data_v4', initialData);

  // State for month filtering (YYYY-MM)
  const [currentMonth, setCurrentMonth] = useState(() => new Date().toISOString().slice(0, 7));

  // Modifiers
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    if (newTransaction.type === 'expense' && newTransaction.isPaid === undefined) {
      newTransaction.isPaid = false; // Default for expenses
    }
    setData((prev) => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));
  };

  const removeTransaction = (id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  const toggleTransactionPaid = (id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id && t.type === 'expense' ? { ...t, isPaid: !t.isPaid } : t
      ),
    }));
  };

  const addCategory = (name: string, type: 'income' | 'expense') => {
    const newCategory = { id: uuidv4(), name, type };
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    return newCategory.id;
  };

  const updateCategory = (id: string, newName: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, name: newName } : c)),
    }));
  };

  const deleteCategory = (id: string) => {
    // Verificar si la categoría está en uso
    const isInUse = data.transactions.some((t) => t.categoryId === id);
    if (isInUse) {
      return {
        success: false,
        message: 'No puedes borrar esta categoría porque ya tiene movimientos asociados.',
      };
    }

    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
    return { success: true };
  };

  const addNote = (content: string) => {
    const newNote = { id: uuidv4(), content, date: new Date().toISOString() };
    setData((prev) => ({
      ...prev,
      notes: [...prev.notes, newNote],
    }));
  };

  const removeNote = (id: string) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  };

  // Selectors (Filtered by currentMonth)
  const currentMonthTransactions = data.transactions.filter((t) => t.date.startsWith(currentMonth));
  const currentMonthNotes = data.notes.filter((n) => n.date.startsWith(currentMonth));

  // Calculations
  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPaidExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense' && t.isPaid)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPendingExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense' && !t.isPaid)
    .reduce((sum, t) => sum + t.amount, 0);

  // Saldo Proyectado: Ingresos totales - Todos los gastos proyectados
  const projectedBalance = totalIncome - totalExpense;

  // Saldo Real: Ingresos totales - Solo los gastos que ya se pagaron
  const actualBalance = totalIncome - totalPaidExpenses;

  const expensesByCategory = data.categories
    .filter((c) => c.type === 'expense')
    .map((category) => {
      const amount = currentMonthTransactions
        .filter((t) => t.type === 'expense' && t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...category, totalExpense: amount };
    });

  return {
    data,
    currentMonth,
    setCurrentMonth,
    currentMonthTransactions,
    currentMonthNotes,
    addTransaction,
    removeTransaction,
    toggleTransactionPaid,
    addCategory,
    updateCategory,
    deleteCategory,
    addNote,
    removeNote,
    totalIncome,
    totalExpense,
    totalPaidExpenses,
    totalPendingExpenses,
    projectedBalance,
    actualBalance,
    expensesByCategory,
  };
}
