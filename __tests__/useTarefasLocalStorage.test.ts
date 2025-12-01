import { renderHook, act } from '@testing-library/react';
import { useTarefasLocalStorage } from '@/hooks/useTarefasLocalStorage';
import { Tarefa } from '@/lib/types';

describe('useTarefasLocalStorage', () => {
  const tarefasMock: Tarefa[] = [
    {
      id: 1,
      titulo: 'Tarefa 1',
      completa: false,
      criadaEm: new Date('2024-11-20'),
    },
    {
      id: 2,
      titulo: 'Tarefa 2',
      completa: true,
      criadaEm: new Date('2024-11-19'),
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve inicializar com as tarefas iniciais quando localStorage está vazio', () => {
    const { result } = renderHook(() => useTarefasLocalStorage(tarefasMock));

    expect(result.current.tarefas).toEqual(tarefasMock);
    expect(result.current.isLoading).toBe(false);
  });

  it('deve carregar tarefas do localStorage se existirem', () => {
    // Pré-popular localStorage
    localStorage.setItem(
      'tarefas-app:tarefas',
      JSON.stringify([
        { id: 3, titulo: 'Tarefa do Storage', completa: false, criadaEm: '2024-11-21T00:00:00.000Z' },
      ])
    );

    const { result } = renderHook(() => useTarefasLocalStorage(tarefasMock));

    expect(result.current.tarefas).toHaveLength(1);
    expect(result.current.tarefas[0].titulo).toBe('Tarefa do Storage');
  });

  it('deve salvar tarefas no localStorage', () => {
    const { result } = renderHook(() => useTarefasLocalStorage());

    act(() => {
      result.current.salvarTarefas(tarefasMock);
    });

    const stored = localStorage.getItem('tarefas-app:tarefas');
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].titulo).toBe('Tarefa 1');
  });

  it('deve converter datas de string para Date ao carregar', () => {
    localStorage.setItem(
      'tarefas-app:tarefas',
      JSON.stringify([
        { id: 1, titulo: 'Tarefa', completa: false, criadaEm: '2024-11-20T00:00:00.000Z' },
      ])
    );

    const { result } = renderHook(() => useTarefasLocalStorage());

    expect(result.current.tarefas[0].criadaEm instanceof Date).toBe(true);
  });

  it('deve limpar tarefas do localStorage', () => {
    localStorage.setItem('tarefas-app:tarefas', JSON.stringify(tarefasMock));

    const { result } = renderHook(() => useTarefasLocalStorage());

    act(() => {
      result.current.limparTarefas();
    });

    expect(result.current.tarefas).toEqual([]);
    expect(localStorage.getItem('tarefas-app:tarefas')).toBeNull();
  });

  it('deve manter estado isLoading durante carregamento', () => {
    const { result } = renderHook(() => useTarefasLocalStorage(tarefasMock));

    // Após o efeito rodar, isLoading deve ser false
    expect(result.current.isLoading).toBe(false);
  });

  it('deve adicionar nova tarefa ao salvar', () => {
    const { result } = renderHook(() => useTarefasLocalStorage(tarefasMock));

    const novaTarefa: Tarefa = {
      id: 3,
      titulo: 'Nova Tarefa',
      completa: false,
      criadaEm: new Date(),
    };

    act(() => {
      result.current.salvarTarefas([novaTarefa, ...result.current.tarefas]);
    });

    expect(result.current.tarefas).toHaveLength(3);
    expect(result.current.tarefas[0].titulo).toBe('Nova Tarefa');
  });

  it('deve atualizar tarefas existentes', () => {
    const { result } = renderHook(() => useTarefasLocalStorage(tarefasMock));

    const tarefasAtualizadas = result.current.tarefas.map(t =>
      t.id === 1 ? { ...t, titulo: 'Tarefa Atualizada' } : t
    );

    act(() => {
      result.current.salvarTarefas(tarefasAtualizadas);
    });

    expect(result.current.tarefas[0].titulo).toBe('Tarefa Atualizada');
  });

  it('deve remover tarefa ao salvar lista filtrada', () => {
    const { result } = renderHook(() => useTarefasLocalStorage(tarefasMock));

    const tarefasFiltradasSemASegunda = result.current.tarefas.filter(t => t.id !== 2);

    act(() => {
      result.current.salvarTarefas(tarefasFiltradasSemASegunda);
    });

    expect(result.current.tarefas).toHaveLength(1);
    expect(result.current.tarefas[0].id).toBe(1);
  });

  it('deve lidar com erro ao acessar localStorage', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Simular erro no localStorage
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    const { result } = renderHook(() => useTarefasLocalStorage());

    act(() => {
      result.current.salvarTarefas(tarefasMock);
    });

    expect(consoleErrorSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
