'use client';

import { ReactNode } from 'react';
import { ToastContainer } from "@/components/Toast";
import { useToast } from "@/contexts/ToastContext";
import { Analytics } from "@vercel/analytics/next";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function LayoutClient({ children }: { children: ReactNode }) {
  const { toasts, removerToast } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removerToast} />
      <WhatsAppButton phoneNumber="5513988086140" /> {/* Substitua pelo seu número do WhatsApp Business */}
      <Analytics />
    </>
  );
}
