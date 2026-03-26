'use client';

import GerenciadorTarefas from '@/components/GerenciadorTarefas';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import { Tarefa } from '@/lib/types';
import { obterTarefas } from '@/lib/tarefas';

export default function Home() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const tarefasCarregadas = await obterTarefas();
        setTarefas(tarefasCarregadas);
      } catch (erro) {
        console.error('Erro ao carregar tarefas:', erro);
      } finally {
        setIsLoading(false);
      }
    };

    carregarTarefas();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 bg-[linear-gradient(0deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[length:24px_24px] dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 bg-[linear-gradient(0deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[length:24px_24px] dark:from-gray-950 dark:to-gray-900 py-8 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
              Gerenciador de Tarefas
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Gerencie suas tarefas de forma simples e eficiente
            </p>
          </div>
          <ThemeToggle />
        </header>

        <GerenciadorTarefas tarefasIniciais={tarefas} />
      </div>
    </main>
  );
}
