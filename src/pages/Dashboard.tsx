import { useFinanceData } from '../hooks/useFinanceData';
import { GlassCard } from '../components/ui/GlassCard';
import { formatCurrency } from '../utils/formatters';
import { Wallet, TrendingDown, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#aa3bff', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

import { MonthSelector } from '../components/ui/MonthSelector';

export function Dashboard() {
  const {
    currentMonth,
    setCurrentMonth,
    totalIncome,
    totalExpense,
    totalPaidExpenses,
    totalPendingExpenses,
    actualBalance,
    projectedBalance,
    expensesByCategory,
  } = useFinanceData();

  const chartData = expensesByCategory
    .filter((cat) => cat.totalExpense > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.totalExpense,
    }));

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Resumen Financiero</h2>
          <p className="text-white/60">Aquí está el estado actual de tus cuentas.</p>
        </div>

        <MonthSelector currentMonth={currentMonth} onChange={setCurrentMonth} />
      </header>

      {/* Main Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-white/70">
            <span className="text-sm font-medium">Total Ingresos</span>
            <TrendingUp className="text-green-400" size={18} />
          </div>
          <span className="text-2xl font-bold">{formatCurrency(totalIncome)}</span>
        </GlassCard>

        <GlassCard className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-white/70">
            <span className="text-sm font-medium">Gastos Totales (Proyectado)</span>
            <TrendingDown className="text-red-400" size={18} />
          </div>
          <span className="text-2xl font-bold">{formatCurrency(totalExpense)}</span>
        </GlassCard>

        <GlassCard className="flex flex-col gap-2 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30">
          <div className="flex justify-between items-center text-white/90">
            <span className="text-sm font-medium">Saldo Real (En bolsillo)</span>
            <Wallet className="text-green-400" size={18} />
          </div>
          <span className="text-2xl font-bold">{formatCurrency(actualBalance)}</span>
          <span className="text-xs text-green-300/70 mt-1">Ingresos - Gastos Pagados</span>
        </GlassCard>

        <GlassCard className="flex flex-col gap-2 bg-white/10 border-white/20">
          <div className="flex justify-between items-center text-white/90">
            <span className="text-sm font-medium">Saldo Proyectado</span>
            <Wallet className="text-white/60" size={18} />
          </div>
          <span className="text-2xl font-bold">{formatCurrency(projectedBalance)}</span>
          <span className="text-xs text-white/50 mt-1">Si pagas todo lo pendiente</span>
        </GlassCard>
      </div>

      {/* Debt Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <GlassCard className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-400/20 rounded-lg">
              <CheckCircle2 className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-white/70">Deudas Pagadas</p>
              <p className="font-bold text-lg">{formatCurrency(totalPaidExpenses)}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex justify-between items-center p-4 bg-red-500/10 border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-400/20 rounded-lg">
              <AlertCircle className="text-red-400" />
            </div>
            <div>
              <p className="text-sm text-white/70">Deudas Pendientes</p>
              <p className="font-bold text-lg text-red-200">
                {formatCurrency(totalPendingExpenses)}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <GlassCard className="min-h-[300px] flex flex-col">
          <h3 className="text-xl font-semibold mb-6">Gastos por Categoría</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-semibold mb-6">Detalle Categorías (Gastos)</h3>
          <div className="space-y-4">
            {expensesByCategory.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span className="font-medium">{cat.name}</span>
                <span className="text-red-300">{formatCurrency(cat.totalExpense)}</span>
              </div>
            ))}
            {expensesByCategory.length === 0 && (
              <p className="text-white/50 text-sm text-center py-4">No hay datos en este mes.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
