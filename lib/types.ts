export interface Tarefa {
  id: number;
  titulo: string;
  completa: boolean;
  criadaEm: Date;
}

export interface NovaTarefaInput {
  titulo: string;
}

export type TarefaOperacao = 'adicionar' | 'editar' | 'deletar' | 'alternar-status';
export type FiltroStatus = 'todas' | 'completas' | 'pendentes';

export const filtrarTarefas = (tarefas: Tarefa[], filtro: FiltroStatus): Tarefa[] => {
  switch (filtro) {
    case 'completas':
      return tarefas.filter(t => t.completa);
    case 'pendentes':
      return tarefas.filter(t => !t.completa);
    case 'todas':
    default:
      return tarefas;
  }
};
