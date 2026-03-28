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
        <div>Luciano Lima - 2026 - Todos os direitos reservados</div>
        <div>
          <a
            href="mailto:lvlbrasil@gmail.com?subject=Contato%20via%20aplica%C3%A7%C3%A3o&body=Ol%C3%A1%2C%0D%0A%0D%0AGostaria%20de%20entrar%20em%20contato%20sobre%20..."
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Fale Conosco
          </a>
        </div>
      </footer>
      <Analytics />
    </>
  );
}
