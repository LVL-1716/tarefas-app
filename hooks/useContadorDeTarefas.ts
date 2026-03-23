'use client';

import { Tarefa } from '@/lib/types';

/**
 * Hook personalizado para contar o número de tarefas
 * @param tarefas - Array de tarefas
 * @returns Objeto contendo total, completas e pendentes
 */
export function useContadorDeTarefas(tarefas: Tarefa[]) {
  const total = tarefas.length;
  const completas = tarefas.filter((tarefa) => tarefa.completa).length;
  const pendentes = total - completas;

  return {
    total,
    completas,
    pendentes,
  };
}
