import { useState } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { GlassCard } from '../components/ui/GlassCard';
import { Plus, Trash2, StickyNote } from 'lucide-react';

import { MonthSelector } from '../components/ui/MonthSelector';

export function NotesPage() {
  const { currentMonth, setCurrentMonth, currentMonthNotes, addNote, removeNote } =
    useFinanceData();

  const [content, setContent] = useState('');

  const notes = [...currentMonthNotes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addNote(content);
    setContent('');
  };

  return (
    <div className="space-y-6 pb-24 md:pb-0 max-w-4xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <StickyNote className="text-purple-400" size={32} />
          <h2 className="text-3xl font-bold">Notas y Contexto</h2>
        </div>
        <MonthSelector currentMonth={currentMonth} onChange={setCurrentMonth} />
      </header>

      <GlassCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            placeholder="Ej: en efectivo queda (1700 credi suegros...) porq los 2 meses de arriendo..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="glass-input min-h-[100px] resize-y"
            required
          />
          <button
            type="submit"
            className="glass-button py-2 px-6 self-end flex items-center gap-2 text-white font-medium"
          >
            <Plus size={18} />
            Añadir Nota
          </button>
        </form>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.length === 0 ? (
          <p className="text-white/50 col-span-full text-center py-8">
            No hay notas registradas en {currentMonth}.
          </p>
        ) : (
          notes.map((note) => (
            <GlassCard
              key={note.id}
              className="relative group bg-white/5 hover:bg-white/10 transition-colors"
            >
              <p className="whitespace-pre-wrap mb-4">{note.content}</p>
              <div className="flex justify-between items-center text-sm text-white/40 mt-4 pt-4 border-t border-white/10">
                <span>{new Date(note.date).toLocaleString()}</span>
                <button
                  onClick={() => removeNote(note.id)}
                  className="p-2 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
