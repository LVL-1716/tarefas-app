import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContadorTarefas from '@/components/ContadorTarefas';
import { Tarefa } from '@/lib/types';

describe('ContadorTarefas - Snapshots', () => {
  it('deve renderizar snapshot com tarefas', () => {
    const tarefasMock: Tarefa[] = [
      { id: 1, titulo: 'Pendente', completa: false, criadaEm: new Date() },
      { id: 2, titulo: 'Completa', completa: true, criadaEm: new Date() },
    ];

    const { container } = render(<ContadorTarefas tarefas={tarefasMock} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('deve renderizar snapshot sem tarefas', () => {
    const { container } = render(<ContadorTarefas tarefas={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('deve renderizar snapshot com apenas tarefas completas', () => {
    const tarefasMock: Tarefa[] = [
      { id: 1, titulo: 'Completa 1', completa: true, criadaEm: new Date() },
      { id: 2, titulo: 'Completa 2', completa: true, criadaEm: new Date() },
    ];

    const { container } = render(<ContadorTarefas tarefas={tarefasMock} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
