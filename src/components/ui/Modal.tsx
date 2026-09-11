import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <GlassCard className="relative w-full max-w-md max-h-[90vh] overflow-y-auto z-10 flex flex-col p-0 bg-slate-900/80 shadow-2xl shadow-purple-900/20">
        <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-slate-900/50 backdrop-blur-md z-20">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} className="text-white/70" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </GlassCard>
    </div>
  );
}
