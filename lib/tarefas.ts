import { Tarefa } from './types';

// Simulação de dados de tarefas (como se viesse de uma API)
const tarefasIniciais: Tarefa[] = [
  {
    id: 1,
    titulo: 'Estudar Next.js 15',
    completa: false,
    criadaEm: new Date('2024-11-20'),
  },
  {
    id: 2,
    titulo: 'Implementar testes unitários',
    completa: false,
    criadaEm: new Date('2024-11-21'),
  },
  {
    id: 3,
    titulo: 'Criar componentes reutilizáveis',
    completa: true,
    criadaEm: new Date('2024-11-19'),
  },
];

// Simula uma chamada de API que retorna a lista de tarefas
export async function obterTarefas(): Promise<Tarefa[]> {
  // Simula delay de rede
  return Promise.resolve(tarefasIniciais);
}

// Simula adicionar uma tarefa
export async function adicionarTarefa(titulo: string): Promise<Tarefa> {
  const novaTarefa: Tarefa = {
    id: Date.now(),
    titulo,
    completa: false,
    criadaEm: new Date(),
  };
  
  return Promise.resolve(novaTarefa);
}
