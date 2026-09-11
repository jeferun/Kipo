import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useFinanceData } from '../../hooks/useFinanceData';
import { Trash2, Edit2, Check, X, Plus } from 'lucide-react';
import type { TransactionType } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
}

export function CategoryManagerModal({ isOpen, onClose, type }: Props) {
  const { data, addCategory, updateCategory, deleteCategory } = useFinanceData();
  const categories = data.categories.filter((c) => c.type === type);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName, type);
    setNewCategoryName('');
    setErrorMsg(null);
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
    setErrorMsg(null);
  };

  const saveEdit = (id: string) => {
    if (editingName.trim()) {
      updateCategory(id, editingName);
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const result = deleteCategory(id);
    if (!result.success) {
      setErrorMsg(result.message || 'Error al eliminar');
    } else {
      setErrorMsg(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestionar Categorías (${type === 'income' ? 'Ingresos' : 'Gastos'})`}
    >
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Add New Category */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Nueva categoría..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="glass-input flex-1"
        />
        <button
          type="submit"
          disabled={!newCategoryName.trim()}
          className="bg-purple-500/20 hover:bg-purple-500/40 disabled:opacity-50 text-purple-200 p-2 rounded-lg transition-colors flex items-center justify-center"
        >
          <Plus size={20} />
        </button>
      </form>

      {/* List Categories */}
      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
        {categories.length === 0 ? (
          <p className="text-center text-white/50 text-sm py-4">No tienes categorías aún.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors group"
            >
              {editingId === cat.id ? (
                <div className="flex flex-1 items-center gap-2 mr-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="glass-input flex-1 py-1 px-2 text-sm"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(cat.id)}
                  />
                  <button
                    onClick={() => saveEdit(cat.id)}
                    className="p-1 text-green-400 hover:bg-green-400/20 rounded"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1 text-white/50 hover:text-white/80 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{cat.name}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(cat.id, cat.name)}
                      className="p-1.5 text-blue-300 hover:bg-blue-400/20 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-red-300 hover:bg-red-400/20 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
