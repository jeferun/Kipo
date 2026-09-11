import { useState } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { GlassCard } from '../components/ui/GlassCard';
import { CategoryManagerModal } from '../components/forms/CategoryManagerModal';
import { formatCurrency } from '../utils/formatters';
import { Plus, Trash2, CheckCircle2, Circle, Filter, Settings2 } from 'lucide-react';
import type { TransactionType } from '../types';

import { MonthSelector } from '../components/ui/MonthSelector';

interface Props {
  type: TransactionType;
  title: string;
}

export function TransactionsPage({ type, title }: Props) {
  const {
    data,
    currentMonth,
    setCurrentMonth,
    currentMonthTransactions,
    addTransaction,
    removeTransaction,
    toggleTransactionPaid,
  } = useFinanceData();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Filter State
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = data.categories.filter((c) => c.type === type);

  // Set default category if none selected
  if (!categoryId && categories.length > 0) {
    setCategoryId(categories[0].id);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !categoryId) return;

    // Attach to current selected month at day 01 if not current calendar month
    const dateToSave =
      new Date().toISOString().slice(0, 7) === currentMonth
        ? new Date().toISOString()
        : `${currentMonth}-01T12:00:00.000Z`;

    addTransaction({
      name,
      amount: Number(amount),
      categoryId,
      type,
      date: dateToSave,
    });

    setName('');
    setAmount('');
  };

  const transactions = currentMonthTransactions
    .filter((t) => t.type === type)
    .filter((t) => filterCategory === 'all' || t.categoryId === filterCategory)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 pb-24 md:pb-0 max-w-4xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <MonthSelector currentMonth={currentMonth} onChange={setCurrentMonth} />
      </header>

      <GlassCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Añadir Nuevo</h3>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1 text-sm text-purple-300 hover:text-purple-100 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <Settings2 size={16} />
            Gestionar Categorías
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Descripción (ej. Internet)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input md:col-span-1"
            required
          />
          <input
            type="number"
            placeholder="Monto ($)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="glass-input md:col-span-1"
            min="0"
            required
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="glass-input md:col-span-1 [&>option]:bg-slate-900"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
            {categories.length === 0 && <option value="">Sin categorías</option>}
          </select>
          <button
            type="submit"
            className="glass-button py-2 flex items-center justify-center gap-2 text-white font-medium disabled:opacity-50"
            disabled={!categoryId}
          >
            <Plus size={18} />
            Guardar
          </button>
        </form>
      </GlassCard>

      <GlassCard className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">Historial del Mes</h3>

          {/* Modern Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
            <Filter size={16} className="text-white/50 shrink-0 mr-1" />
            <button
              onClick={() => setFilterCategory('all')}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterCategory === 'all'
                  ? 'bg-purple-500/80 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filterCategory === cat.id
                    ? 'bg-purple-500/80 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mt-2">
          {transactions.length === 0 ? (
            <p className="text-white/50 text-center py-8 bg-white/5 rounded-xl border border-white/5">
              No hay registros para mostrar.
            </p>
          ) : (
            transactions.map((t) => {
              const category = data.categories.find((c) => c.id === t.categoryId);
              const isExpense = type === 'expense';

              return (
                <div
                  key={t.id}
                  className={`flex justify-between items-center p-4 rounded-xl border transition-all ${
                    isExpense && t.isPaid
                      ? 'bg-white/5 border-green-500/20 opacity-60'
                      : 'bg-white/10 border-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {isExpense && (
                      <button
                        onClick={() => toggleTransactionPaid(t.id)}
                        className={`transition-colors ${t.isPaid ? 'text-green-400' : 'text-white/30 hover:text-white/70'}`}
                        title={t.isPaid ? 'Marcar como no pagado' : 'Marcar como pagado'}
                      >
                        {t.isPaid ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>
                    )}
                    <div>
                      <p className={`font-medium ${isExpense && t.isPaid ? 'line-through' : ''}`}>
                        {t.name}
                      </p>
                      <p className="text-sm text-white/50">
                        {new Date(t.date).toLocaleDateString()} •{' '}
                        {category ? category.name : 'Categoría eliminada'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold ${isExpense ? 'text-red-400' : 'text-green-400'}`}>
                      {isExpense ? '-' : '+'}
                      {formatCurrency(t.amount)}
                    </span>
                    <button
                      onClick={() => removeTransaction(t.id)}
                      className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </GlassCard>

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        type={type}
      />
    </div>
  );
}
