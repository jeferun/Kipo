import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

interface Props {
  currentMonth: string; // YYYY-MM
  onChange: (newMonth: string) => void;
}

export function MonthSelector({ currentMonth, onChange }: Props) {
  // Format currentMonth to readable string (e.g. "Agosto 2026")
  const dateObj = new Date(`${currentMonth}-01T12:00:00Z`);
  const monthName = dateObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const handlePrev = () => {
    const prevDate = new Date(`${currentMonth}-01T12:00:00Z`);
    prevDate.setMonth(prevDate.getMonth() - 1);
    onChange(prevDate.toISOString().slice(0, 7));
  };

  const handleNext = () => {
    const nextDate = new Date(`${currentMonth}-01T12:00:00Z`);
    nextDate.setMonth(nextDate.getMonth() + 1);
    onChange(nextDate.toISOString().slice(0, 7));
  };

  return (
    <div className="flex items-center gap-1 bg-white/10 px-2 py-1.5 rounded-xl border border-white/10 backdrop-blur-md shadow-lg shadow-purple-900/10">
      <button
        onClick={handlePrev}
        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2 px-3 min-w-[150px] justify-center">
        <CalendarDays className="text-purple-400" size={18} />
        <span className="font-medium text-white tracking-wide">{formattedMonth}</span>
      </div>

      <button
        onClick={handleNext}
        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
