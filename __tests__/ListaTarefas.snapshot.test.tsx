import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListaTarefas from '@/components/ListaTarefas';
import { Tarefa } from '@/lib/types';

describe('ListaTarefas - Snapshots', () => {
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

  it('deve renderizar snapshot de lista com tarefas', () => {
    const { container } = render(<ListaTarefas tarefas={tarefasMock} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('deve renderizar snapshot de lista vazia', () => {
    const { container } = render(<ListaTarefas tarefas={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('deve renderizar snapshot com botões de editar e deletar', () => {
    const { container } = render(
      <ListaTarefas 
        tarefas={tarefasMock} 
        onEditar={jest.fn()} 
        onDeletar={jest.fn()} 
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
