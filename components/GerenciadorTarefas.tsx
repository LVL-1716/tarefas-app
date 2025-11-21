'use client';

import { useState, useEffect } from 'react';
import { Tarefa } from '@/lib/types';
import NovaTarefa from '@/components/NovaTarefa';
import ListaTarefas from '@/components/ListaTarefas';
import ContadorTarefas from '@/components/ContadorTarefas';

interface GerenciadorTarefasProps {
  tarefasIniciais: Tarefa[];
}

export default function GerenciadorTarefas({ tarefasIniciais }: GerenciadorTarefasProps) {
  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasIniciais);

  const handleAdicionarTarefa = (titulo: string) => {
    const novaTarefa: Tarefa = {
      id: Date.now(),
      titulo,
      completa: false,
      criadaEm: new Date(),
    };

    setTarefas([novaTarefa, ...tarefas]);
  };

  const handleAlternarStatus = (id: number) => {
    setTarefas(tarefas.map(tarefa => 
      tarefa.id === id 
        ? { ...tarefa, completa: !tarefa.completa }
        : tarefa
    ));
  };

  return (
    <div className="space-y-6">
      <ContadorTarefas tarefas={tarefas} />
      <NovaTarefa onAdicionar={handleAdicionarTarefa} />
      <ListaTarefas tarefas={tarefas} onAlternarStatus={handleAlternarStatus} />
    </div>
  );
}
