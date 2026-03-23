'use client';

import { ReactNode } from 'react';
import { ToastContainer } from "@/components/Toast";
import { useToast } from "@/contexts/ToastContext";
import { Analytics } from "@vercel/analytics/next";

export default function LayoutClient({ children }: { children: ReactNode }) {
  const { toasts, removerToast } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removerToast} />
      <footer className="w-full text-center py-4 text-sm text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        Luciano Lima - 2026 - Todos os direitos reservados
      </footer>
      <Analytics />
    </>
  );
}
