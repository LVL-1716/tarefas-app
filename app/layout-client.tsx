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
      <Analytics />
    </>
  );
}
