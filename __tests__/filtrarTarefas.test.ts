import { filtrarTarefas, Tarefa } from '@/lib/types';

describe('filtrarTarefas', () => {
  const tarefasMock: Tarefa[] = [
    {
      id: 1,
      titulo: 'Tarefa Pendente 1',
      completa: false,
      criadaEm: new Date('2024-11-20'),
    },
    {
      id: 2,
      titulo: 'Tarefa Completa 1',
      completa: true,
      criadaEm: new Date('2024-11-19'),
    },
    {
      id: 3,
      titulo: 'Tarefa Pendente 2',
      completa: false,
      criadaEm: new Date('2024-11-18'),
    },
    {
      id: 4,
      titulo: 'Tarefa Completa 2',
      completa: true,
      criadaEm: new Date('2024-11-17'),
    },
  ];

  it('deve retornar todas as tarefas quando filtro é "todas"', () => {
    const resultado = filtrarTarefas(tarefasMock, 'todas');
    expect(resultado).toHaveLength(4);
    expect(resultado).toEqual(tarefasMock);
  });

  it('deve retornar apenas tarefas completas quando filtro é "completas"', () => {
    const resultado = filtrarTarefas(tarefasMock, 'completas');
    expect(resultado).toHaveLength(2);
    expect(resultado.every(t => t.completa)).toBe(true);
    expect(resultado[0].titulo).toBe('Tarefa Completa 1');
    expect(resultado[1].titulo).toBe('Tarefa Completa 2');
  });

  it('deve retornar apenas tarefas pendentes quando filtro é "pendentes"', () => {
    const resultado = filtrarTarefas(tarefasMock, 'pendentes');
    expect(resultado).toHaveLength(2);
    expect(resultado.every(t => !t.completa)).toBe(true);
    expect(resultado[0].titulo).toBe('Tarefa Pendente 1');
    expect(resultado[1].titulo).toBe('Tarefa Pendente 2');
  });

  it('deve retornar array vazio quando não há tarefas completas', () => {
    const tarefasPendentes: Tarefa[] = [
      {
        id: 1,
        titulo: 'Pendente',
        completa: false,
        criadaEm: new Date(),
      },
    ];
    const resultado = filtrarTarefas(tarefasPendentes, 'completas');
    expect(resultado).toHaveLength(0);
  });

  it('deve retornar array vazio quando não há tarefas pendentes', () => {
    const tarefasCompletas: Tarefa[] = [
      {
        id: 1,
        titulo: 'Completa',
        completa: true,
        criadaEm: new Date(),
      },
    ];
    const resultado = filtrarTarefas(tarefasCompletas, 'pendentes');
    expect(resultado).toHaveLength(0);
  });

  it('deve manter a ordem original ao filtrar', () => {
    const resultado = filtrarTarefas(tarefasMock, 'completas');
    expect(resultado[0].id).toBe(2);
    expect(resultado[1].id).toBe(4);
  });

  it('deve retornar array vazio quando array de entrada está vazio', () => {
    const resultado = filtrarTarefas([], 'completas');
    expect(resultado).toHaveLength(0);
  });
});
