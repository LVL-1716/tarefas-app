import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListaTarefas from '@/components/ListaTarefas';
import { Tarefa } from '@/lib/types';

describe('ListaTarefas', () => {
  const tarefasMock: Tarefa[] = [
    {
      id: 1,
      titulo: 'Tarefa Pendente',
      completa: false,
      criadaEm: new Date('2024-11-20'),
    },
    {
      id: 2,
      titulo: 'Tarefa Completa',
      completa: true,
      criadaEm: new Date('2024-11-19'),
    },
  ];

  it('deve renderizar todas as tarefas da lista', () => {
    render(<ListaTarefas tarefas={tarefasMock} />);

    expect(screen.getByText('Tarefa Pendente')).toBeInTheDocument();
    expect(screen.getByText('Tarefa Completa')).toBeInTheDocument();
  });

  it('deve exibir mensagem quando não há tarefas', () => {
    render(<ListaTarefas tarefas={[]} />);

    expect(screen.getByText('Nenhuma tarefa encontrada.')).toBeInTheDocument();
  });

  it('deve renderizar o título da lista', () => {
    render(<ListaTarefas tarefas={tarefasMock} />);

    expect(screen.getByText('Lista de Tarefas')).toBeInTheDocument();
  });

  it('deve exibir a data de criação de cada tarefa', () => {
    render(<ListaTarefas tarefas={tarefasMock} />);

    expect(screen.getByText(/19\/11\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/18\/11\/2024/)).toBeInTheDocument();
  });

  it('deve exibir o status correto para cada tarefa', () => {
    render(<ListaTarefas tarefas={tarefasMock} />);

    expect(screen.getByText('Completa')).toBeInTheDocument();
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('deve renderizar o número correto de itens da lista', () => {
    render(<ListaTarefas tarefas={tarefasMock} />);

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  it('deve aplicar estilo de riscado em tarefas completas', () => {
    render(<ListaTarefas tarefas={tarefasMock} />);

    const tarefaCompleta = screen.getByText('Tarefa Completa');
    expect(tarefaCompleta).toHaveClass('line-through');
  });

  it('não deve aplicar estilo de riscado em tarefas pendentes', () => {
    render(<ListaTarefas tarefas={tarefasMock} />);

    const tarefaPendente = screen.getByText('Tarefa Pendente');
    expect(tarefaPendente).not.toHaveClass('line-through');
  });

  it('deve renderizar checkbox para cada tarefa', () => {
    render(<ListaTarefas tarefas={tarefasMock} />);

    const checkboxes = screen.getAllByRole('button', { name: /Marcar como/ });
    expect(checkboxes).toHaveLength(2);
  });

  it('deve chamar onAlternarStatus quando checkbox é clicado', () => {
    const mockAlternar = jest.fn();
    render(<ListaTarefas tarefas={tarefasMock} onAlternarStatus={mockAlternar} />);

    const checkbox = screen.getByLabelText('Marcar como completa');
    checkbox.click();

    expect(mockAlternar).toHaveBeenCalledWith(1);
    expect(mockAlternar).toHaveBeenCalledTimes(1);
  });
});
