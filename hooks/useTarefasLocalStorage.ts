'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tarefa } from '@/lib/types';

const STORAGE_KEY = 'tarefas-app:tarefas';

interface UseTarefasLocalStorageReturn {
  tarefas: Tarefa[];
  isLoading: boolean;
  salvarTarefas: (tarefas: Tarefa[]) => void;
  limparTarefas: () => void;
}

export function useTarefasLocalStorage(
  tarefasIniciais: Tarefa[] = []
): UseTarefasLocalStorageReturn {
  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasIniciais);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar tarefas do localStorage ao montar o componente
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const tarefasParsed = JSON.parse(stored);
        // Converter datas de string para Date
        const tarefasComDatas = tarefasParsed.map((t: any) => ({
          ...t,
          criadaEm: new Date(t.criadaEm),
        }));
        setTarefas(tarefasComDatas);
      } else if (tarefasIniciais.length > 0) {
        // Se não houver dados no localStorage, usar as tarefas iniciais
        setTarefas(tarefasIniciais);
        salvarNoStorage(tarefasIniciais);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas do localStorage:', error);
      setTarefas(tarefasIniciais);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const salvarNoStorage = useCallback((novasTarefas: Tarefa[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novasTarefas));
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage:', error);
    }
  }, []);

  const salvarTarefas = useCallback((novasTarefas: Tarefa[]) => {
    setTarefas(novasTarefas);
    salvarNoStorage(novasTarefas);
  }, [salvarNoStorage]);

  const limparTarefas = useCallback(() => {
    setTarefas([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar tarefas do localStorage:', error);
    }
  }, []);

  return {
    tarefas,
    isLoading,
    salvarTarefas,
    limparTarefas,
  };
}
