'use client';

import { useState, useEffect } from 'react';
import { Tarefa } from '@/lib/types';

/**
 * Hook personalizado para contar o número de tarefas
 * @param tarefas - Array de tarefas
 * @returns Objeto contendo total, completas e pendentes
 */
export function useContadorDeTarefas(tarefas: Tarefa[]) {
  const [contador, setContador] = useState({
    total: 0,
    completas: 0,
    pendentes: 0,
  });

  useEffect(() => {
    const total = tarefas.length;
    const completas = tarefas.filter((tarefa) => tarefa.completa).length;
    const pendentes = total - completas;

    setContador({
      total,
      completas,
      pendentes,
    });
  }, [tarefas]);

  return contador;
}
