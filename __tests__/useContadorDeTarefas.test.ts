import { renderHook, waitFor } from '@testing-library/react';
import { useContadorDeTarefas } from '@/hooks/useContadorDeTarefas';
import { Tarefa } from '@/lib/types';

describe('useContadorDeTarefas', () => {
  const tarefasMock: Tarefa[] = [
    {
      id: 1,
      titulo: 'Tarefa 1',
      completa: true,
      criadaEm: new Date('2024-11-20'),
    },
    {
      id: 2,
      titulo: 'Tarefa 2',
      completa: false,
      criadaEm: new Date('2024-11-21'),
    },
    {
      id: 3,
      titulo: 'Tarefa 3',
      completa: false,
      criadaEm: new Date('2024-11-22'),
    },
  ];

  it('deve retornar o contador correto para a lista de tarefas', async () => {
    const { result } = renderHook(() => useContadorDeTarefas(tarefasMock));

    await waitFor(() => {
      expect(result.current.total).toBe(3);
      expect(result.current.completas).toBe(1);
      expect(result.current.pendentes).toBe(2);
    });
  });

  it('deve retornar zeros quando a lista está vazia', async () => {
    const { result } = renderHook(() => useContadorDeTarefas([]));

    await waitFor(() => {
      expect(result.current.total).toBe(0);
      expect(result.current.completas).toBe(0);
      expect(result.current.pendentes).toBe(0);
    });
  });

  it('deve recalcular quando as tarefas mudam', async () => {
    const { result, rerender } = renderHook(
      ({ tarefas }) => useContadorDeTarefas(tarefas),
      {
        initialProps: { tarefas: tarefasMock },
      }
    );

    await waitFor(() => {
      expect(result.current.total).toBe(3);
    });

    // Adiciona uma nova tarefa completa
    const novasTarefas: Tarefa[] = [
      ...tarefasMock,
      {
        id: 4,
        titulo: 'Tarefa 4',
        completa: true,
        criadaEm: new Date('2024-11-23'),
      },
    ];

    rerender({ tarefas: novasTarefas });

    await waitFor(() => {
      expect(result.current.total).toBe(4);
      expect(result.current.completas).toBe(2);
      expect(result.current.pendentes).toBe(2);
    });
  });

  it('deve contar corretamente quando todas as tarefas estão completas', async () => {
    const tarefasCompletas: Tarefa[] = [
      {
        id: 1,
        titulo: 'Tarefa 1',
        completa: true,
        criadaEm: new Date('2024-11-20'),
      },
      {
        id: 2,
        titulo: 'Tarefa 2',
        completa: true,
        criadaEm: new Date('2024-11-21'),
      },
    ];

    const { result } = renderHook(() => useContadorDeTarefas(tarefasCompletas));

    await waitFor(() => {
      expect(result.current.total).toBe(2);
      expect(result.current.completas).toBe(2);
      expect(result.current.pendentes).toBe(0);
    });
  });
});
