'use client';

import { useState, useEffect } from 'react';
import { Tarefa, FiltroStatus, filtrarTarefas } from '@/lib/types';
import { useTarefasLocalStorage } from '@/hooks/useTarefasLocalStorage';
import { useToast } from '@/contexts/ToastContext';
import NovaTarefa from '@/components/NovaTarefa';
import ListaTarefas from '@/components/ListaTarefas';
import ContadorTarefas from '@/components/ContadorTarefas';
import FiltroTarefas from '@/components/FiltroTarefas';

interface GerenciadorTarefasProps {
  tarefasIniciais: Tarefa[];
}

export default function GerenciadorTarefas({ tarefasIniciais }: GerenciadorTarefasProps): React.ReactNode {
  const { tarefas: tarefasStorage, isLoading, salvarTarefas } = useTarefasLocalStorage(tarefasIniciais);
  const { adicionarToast } = useToast();
  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasStorage);
  const [filtro, setFiltro] = useState<FiltroStatus>('todas');

  // Sincronizar estado com localStorage
  useEffect(() => {
    setTarefas(tarefasStorage);
  }, [tarefasStorage]);

  const tarefasFiltradas = filtrarTarefas(tarefas, filtro);
  const handleAdicionarTarefa = (titulo: string) => {
    const novaTarefa: Tarefa = {
      id: Date.now(),
      titulo,
      completa: false,
      criadaEm: new Date(),
    };

    const novasList = [novaTarefa, ...tarefas];
    setTarefas(novasList);
    salvarTarefas(novasList);
    adicionarToast(`Tarefa "${titulo}" adicionada com sucesso!`, 'sucesso');
  };

  const handleAlternarStatus = (id: number) => {
    const novasList = tarefas.map(tarefa => 
      tarefa.id === id 
        ? { ...tarefa, completa: !tarefa.completa }
        : tarefa
    );
    setTarefas(novasList);
    salvarTarefas(novasList);
    const tarefa = novasList.find(t => t.id === id);
    adicionarToast(
      `Tarefa marcada como ${tarefa?.completa ? 'completa' : 'pendente'}`,
      'info'
    );
  };

  const handleEditar = (id: number, novoTitulo: string) => {
    const novasList = tarefas.map(tarefa => 
      tarefa.id === id 
        ? { ...tarefa, titulo: novoTitulo }
        : tarefa
    );
    setTarefas(novasList);
    salvarTarefas(novasList);
    adicionarToast(`Tarefa atualizada para "${novoTitulo}"`, 'sucesso');
  };

  const handleDeletar = (id: number) => {
    const tarefa = tarefas.find(t => t.id === id);
    const novasList = tarefas.filter(tarefa => tarefa.id !== id);
    setTarefas(novasList);
    salvarTarefas(novasList);
    adicionarToast(`Tarefa "${tarefa?.titulo}" deletada`, 'aviso');
  };

  const handleReordenar = (tarefasReordenadas: Tarefa[]) => {
    setTarefas(tarefasReordenadas);
    salvarTarefas(tarefasReordenadas);
    adicionarToast('Tarefas reordenadas com sucesso', 'info');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Carregando tarefas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ContadorTarefas tarefas={tarefas} />
      <FiltroTarefas filtroAtivo={filtro} onFiltroMudar={setFiltro} />
      <NovaTarefa onAdicionar={handleAdicionarTarefa} />
      <ListaTarefas 
        tarefas={tarefasFiltradas} 
        onAlternarStatus={handleAlternarStatus}
        onEditar={handleEditar}
        onDeletar={handleDeletar}
        onReordenar={handleReordenar}
      />
    </div>
  );
}
