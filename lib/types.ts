export interface Tarefa {
  id: number;
  titulo: string;
  completa: boolean;
  criadaEm: Date;
}

export interface NovaTarefaInput {
  titulo: string;
}
