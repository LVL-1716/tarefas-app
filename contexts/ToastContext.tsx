'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'sucesso' | 'erro' | 'info' | 'aviso';

export interface Toast {
  id: string;
  mensagem: string;
  tipo: ToastType;
  duracao?: number;
}

interface ToastContextType {
  toasts: Toast[];
  adicionarToast: (mensagem: string, tipo: ToastType, duracao?: number) => void;
  removerToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removerToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const adicionarToast = useCallback((mensagem: string, tipo: ToastType, duracao = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const novoToast: Toast = { id, mensagem, tipo, duracao };

    setToasts(prev => [...prev, novoToast]);

    if (duracao > 0) {
      setTimeout(() => removerToast(id), duracao);
    }
  }, [removerToast]);

  return (
    <ToastContext.Provider value={{ toasts, adicionarToast, removerToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}
