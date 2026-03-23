'use client';

<<<<<<< HEAD
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Modal from './Modal';

interface WhatsAppButtonProps {
  tarefas: { titulo: string; completa: boolean }[];
}

export default function WhatsAppButton({ tarefas }: WhatsAppButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const gerarMensagemWhatsApp = () => {
    const total = tarefas.length;
    const completas = tarefas.filter(t => t.completa).length;
    const pendentes = total - completas;

    let mensagem = `📋 Minhas Tarefas\n\n`;
    mensagem += `Total: ${total}\n`;
    mensagem += `Completas: ${completas}\n`;
    mensagem += `Pendentes: ${pendentes}\n\n`;

    if (tarefas.length > 0) {
      mensagem += `Lista de Tarefas:\n`;
      tarefas.forEach((tarefa, index) => {
        const status = tarefa.completa ? '✅' : '⏳';
        mensagem += `${index + 1}. ${status} ${tarefa.titulo}\n`;
      });
    } else {
      mensagem += `Nenhuma tarefa ainda.`;
    }

    return encodeURIComponent(mensagem);
  };

  const handleCompartilhar = () => {
    const mensagem = gerarMensagemWhatsApp();
    const url = `https://wa.me/?text=${mensagem}`;
    window.open(url, '_blank');
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        title="Compartilhar tarefas via WhatsApp"
      >
        <MessageCircle size={20} />
        Compartilhar no WhatsApp
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Compartilhar Tarefas"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Deseja compartilhar sua lista de tarefas via WhatsApp?
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm text-gray-600 dark:text-gray-400">
            <p>📋 Minhas Tarefas</p>
            <p>Total: {tarefas.length}</p>
            <p>Completas: {tarefas.filter(t => t.completa).length}</p>
            <p>Pendentes: {tarefas.filter(t => !t.completa).length}</p>
            {tarefas.length > 0 && (
              <div className="mt-2">
                <p>Lista de Tarefas:</p>
                {tarefas.slice(0, 3).map((tarefa, index) => (
                  <p key={index} className="ml-2">
                    {tarefa.completa ? '✅' : '⏳'} {tarefa.titulo}
                  </p>
                ))}
                {tarefas.length > 3 && <p className="ml-2">... e mais</p>}
              </div>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleCompartilhar}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Compartilhar
            </button>
          </div>
        </div>
      </Modal>
    </>
=======
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppButton({ phoneNumber, message = 'Olá! Gostaria de conversar sobre o app de tarefas.' }: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center z-50"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
>>>>>>> 4e0d189e030f13bb6e2456ceb05568da62853b54
  );
}