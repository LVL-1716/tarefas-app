import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
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

  it('deve renderizar botões de editar e deletar', () => {
    render(<ListaTarefas tarefas={tarefasMock} onEditar={jest.fn()} onDeletar={jest.fn()} />);

    const botõesEditar = screen.getAllByLabelText('Editar tarefa');
    const botõesDeletar = screen.getAllByLabelText('Deletar tarefa');

    expect(botõesEditar).toHaveLength(2);
    expect(botõesDeletar).toHaveLength(2);
  });

  it('deve ativar modo de edição ao clicar no botão editar', async () => {
    const user = userEvent.setup();
    render(<ListaTarefas tarefas={tarefasMock} onEditar={jest.fn()} onDeletar={jest.fn()} />);

    const botãoEditar = screen.getAllByLabelText('Editar tarefa')[0];
    await user.click(botãoEditar);

    const inputEdicao = screen.getByDisplayValue('Tarefa Pendente');
    expect(inputEdicao).toBeInTheDocument();
  });

  it('deve chamar onEditar com ID e novo título ao confirmar edição', async () => {
    const user = userEvent.setup();
    const mockEditar = jest.fn();
    render(<ListaTarefas tarefas={tarefasMock} onEditar={mockEditar} onDeletar={jest.fn()} />);

    const botãoEditar = screen.getAllByLabelText('Editar tarefa')[0];
    await user.click(botãoEditar);

    const inputEdicao = screen.getByDisplayValue('Tarefa Pendente');
    await user.clear(inputEdicao);
    await user.type(inputEdicao, 'Tarefa Editada');

    const botãoConfirmar = screen.getByLabelText('Confirmar edição');
    await user.click(botãoConfirmar);

    expect(mockEditar).toHaveBeenCalledWith(1, 'Tarefa Editada');
  });

  it('não deve permitir edição com título vazio', async () => {
    const user = userEvent.setup();
    const mockEditar = jest.fn();
    render(<ListaTarefas tarefas={tarefasMock} onEditar={mockEditar} onDeletar={jest.fn()} />);

    const botãoEditar = screen.getAllByLabelText('Editar tarefa')[0];
    await user.click(botãoEditar);

    const inputEdicao = screen.getByDisplayValue('Tarefa Pendente');
    await user.clear(inputEdicao);

    const botãoConfirmar = screen.getByLabelText('Confirmar edição');
    await user.click(botãoConfirmar);

    expect(mockEditar).not.toHaveBeenCalled();
  });

  it('deve cancelar edição ao clicar em cancelar', async () => {
    const user = userEvent.setup();
    const mockEditar = jest.fn();
    render(<ListaTarefas tarefas={tarefasMock} onEditar={mockEditar} onDeletar={jest.fn()} />);

    const botãoEditar = screen.getAllByLabelText('Editar tarefa')[0];
    await user.click(botãoEditar);

    const botãoCancelar = screen.getByLabelText('Cancelar edição');
    await user.click(botãoCancelar);

    expect(screen.queryByDisplayValue('Tarefa Pendente')).not.toBeInTheDocument();
    expect(mockEditar).not.toHaveBeenCalled();
  });

  it('deve chamar onDeletar com ID ao clicar em deletar', async () => {
    const user = userEvent.setup();
    const mockDeletar = jest.fn();
    render(<ListaTarefas tarefas={tarefasMock} onEditar={jest.fn()} onDeletar={mockDeletar} />);

    const botãoDeletar = screen.getAllByLabelText('Deletar tarefa')[0];
    await user.click(botãoDeletar);

    expect(mockDeletar).toHaveBeenCalledWith(1);
  });

  it('deve renderizar ícone de drag indicator', () => {
    render(<ListaTarefas tarefas={tarefasMock} onEditar={jest.fn()} onDeletar={jest.fn()} />);

    const dragIndicators = screen.getAllByText('⋮⋮');
    expect(dragIndicators).toHaveLength(2);
  });

  it('deve permitir dragging de tarefas', async () => {
    const mockReordenar = jest.fn();
    const { container } = render(
      <ListaTarefas 
        tarefas={tarefasMock} 
        onEditar={jest.fn()} 
        onDeletar={jest.fn()}
        onReordenar={mockReordenar}
      />
    );

    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('draggable', 'true');
  });

  it('deve chamar onReordenar após drop', async () => {
    const mockReordenar = jest.fn();
    const { container } = render(
      <ListaTarefas 
        tarefas={tarefasMock} 
        onEditar={jest.fn()} 
        onDeletar={jest.fn()}
        onReordenar={mockReordenar}
      />
    );

    const items = container.querySelectorAll('li');
    const firstItem = items[0];
    const secondItem = items[1];

    // Simular drag start
    fireEvent.dragStart(firstItem, {
      dataTransfer: { effectAllowed: 'move' },
    });

    // Simular drag over
    fireEvent.dragOver(secondItem);

    // Simular drop
    fireEvent.drop(secondItem);

    // Simular drag end
    fireEvent.dragEnd(firstItem);

    // onReordenar deve ter sido chamado
    expect(mockReordenar).toHaveBeenCalled();
  });

  it('deve aplicar classe de opacity ao tarefa em drag', async () => {
    const { container } = render(
      <ListaTarefas 
        tarefas={tarefasMock} 
        onEditar={jest.fn()} 
        onDeletar={jest.fn()}
        onReordenar={jest.fn()}
      />
    );

    const firstItem = container.querySelector('li');
    
    fireEvent.dragStart(firstItem!);
    
    // Após dragStart, a classe opacity-50 deve estar presente
    await waitFor(() => {
      expect(firstItem).toHaveClass('opacity-50');
    });
  });
});
