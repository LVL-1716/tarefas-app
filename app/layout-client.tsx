'use client';

import { ReactNode } from 'react';
import { ToastContainer } from "@/components/Toast";
import { useToast } from "@/contexts/ToastContext";
import { Analytics } from "@vercel/analytics/next";
import WhatsAppContactButton from "@/components/WhatsAppContactButton";

export default function LayoutClient({ children }: { children: ReactNode }) {
  const { toasts, removerToast } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removerToast} />
      <WhatsAppContactButton phoneNumber="5513988086140" />
      <Analytics />
    </>
  );
}
