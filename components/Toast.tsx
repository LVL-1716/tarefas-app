'use client';

import { Toast } from '@/contexts/ToastContext';
import { useEffect } from 'react';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const iconMap = {
  sucesso: '✓',
  erro: '✕',
  info: 'ℹ',
  aviso: '⚠',
};

const bgColorMap = {
  sucesso: 'bg-green-500',
  erro: 'bg-red-500',
  info: 'bg-blue-500',
  aviso: 'bg-yellow-500',
};

export function ToastItem({ toast, onRemove }: ToastItemProps) {
  useEffect(() => {
    if (toast.duracao && toast.duracao > 0) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duracao);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duracao, onRemove]);

  return (
    <div
      className={`${bgColorMap[toast.tipo]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in min-w-72`}
      role="alert"
      data-testid={`toast-${toast.tipo}`}
    >
      <span className="text-xl font-bold">{iconMap[toast.tipo]}</span>
      <p className="flex-1">{toast.mensagem}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="hover:opacity-80 transition-opacity text-lg leading-none"
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-50 space-y-3 max-w-md"
      role="region"
      aria-live="polite"
      aria-label="Notificações"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
