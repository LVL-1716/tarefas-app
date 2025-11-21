import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GerenciadorTarefas from '@/components/GerenciadorTarefas';
import { Tarefa } from '@/lib/types';

describe('GerenciadorTarefas', () => {
  const tarefasMock: Tarefa[] = [
    {
      id: 1,
      titulo: 'Estudar Next.js',
      completa: false,
      criadaEm: new Date('2024-11-20'),
    },
    {
      id: 2,
      titulo: 'Fazer exercícios',
      completa: true,
      criadaEm: new Date('2024-11-19'),
    },
  ];

  it('deve renderizar a lista de tarefas iniciais', () => {
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    expect(screen.getByText('Estudar Next.js')).toBeInTheDocument();
    expect(screen.getByText('Fazer exercícios')).toBeInTheDocument();
  });

  it('deve renderizar o contador de tarefas', async () => {
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('2');
      expect(screen.getByTestId('tarefas-completas')).toHaveTextContent('1');
      expect(screen.getByTestId('tarefas-pendentes')).toHaveTextContent('1');
    });
  });

  it('deve renderizar o formulário de nova tarefa', () => {
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    expect(screen.getByText('Adicionar Nova Tarefa')).toBeInTheDocument();
    expect(screen.getByLabelText('Título da Tarefa')).toBeInTheDocument();
  });

  it('deve adicionar uma nova tarefa quando o formulário é submetido', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    const input = screen.getByLabelText('Título da Tarefa');
    const botao = screen.getByRole('button', { name: 'Adicionar Tarefa' });

    await user.type(input, 'Nova tarefa de teste');
    fireEvent.click(botao);

    await waitFor(() => {
      expect(screen.getByText('Nova tarefa de teste')).toBeInTheDocument();
    });
  });

  it('deve atualizar o contador ao adicionar nova tarefa', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    // Contador inicial
    await waitFor(() => {
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('2');
    });

    const input = screen.getByLabelText('Título da Tarefa');
    const botao = screen.getByRole('button', { name: 'Adicionar Tarefa' });

    await user.type(input, 'Tarefa adicional');
    fireEvent.click(botao);

    // Contador atualizado
    await waitFor(() => {
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('3');
      expect(screen.getByTestId('tarefas-pendentes')).toHaveTextContent('2');
    });
  });

  it('deve exibir mensagem quando não há tarefas', () => {
    render(<GerenciadorTarefas tarefasIniciais={[]} />);

    expect(screen.getByText('Nenhuma tarefa encontrada.')).toBeInTheDocument();
  });

  it('deve exibir estatísticas zeradas quando não há tarefas', async () => {
    render(<GerenciadorTarefas tarefasIniciais={[]} />);

    await waitFor(() => {
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('0');
      expect(screen.getByTestId('tarefas-completas')).toHaveTextContent('0');
      expect(screen.getByTestId('tarefas-pendentes')).toHaveTextContent('0');
    });
  });

  it('deve adicionar nova tarefa no topo da lista', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    const input = screen.getByLabelText('Título da Tarefa');
    const botao = screen.getByRole('button', { name: 'Adicionar Tarefa' });

    await user.type(input, 'Primeira na lista');
    fireEvent.click(botao);

    await waitFor(() => {
      const tarefas = screen.getAllByRole('listitem');
      expect(tarefas[0]).toHaveTextContent('Primeira na lista');
    });
  });

  it('deve exibir a data de criação das tarefas', () => {
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    expect(screen.getByText(/19\/11\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/18\/11\/2024/)).toBeInTheDocument();
  });

  it('deve exibir o status correto das tarefas', () => {
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    // Verifica se ambos os status aparecem (nos badges das tarefas)
    const statusCompleta = screen.getAllByText('Completa');
    const statusPendente = screen.getAllByText('Pendente');
    
    expect(statusCompleta.length).toBeGreaterThanOrEqual(1);
    expect(statusPendente.length).toBeGreaterThanOrEqual(1);
  });

  it('deve alternar status da tarefa ao clicar no checkbox', async () => {
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    // Verifica estado inicial
    await waitFor(() => {
      expect(screen.getByTestId('tarefas-completas')).toHaveTextContent('1');
      expect(screen.getByTestId('tarefas-pendentes')).toHaveTextContent('1');
    });

    // Clica no checkbox da tarefa pendente
    const checkboxPendente = screen.getByLabelText('Marcar como completa');
    fireEvent.click(checkboxPendente);

    // Verifica que o contador foi atualizado
    await waitFor(() => {
      expect(screen.getByTestId('tarefas-completas')).toHaveTextContent('2');
      expect(screen.getByTestId('tarefas-pendentes')).toHaveTextContent('0');
    });
  });

  it('deve alternar tarefa completa para pendente', async () => {
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    // Verifica estado inicial
    await waitFor(() => {
      expect(screen.getByTestId('tarefas-completas')).toHaveTextContent('1');
    });

    // Clica no checkbox da tarefa completa
    const checkboxCompleta = screen.getByLabelText('Marcar como pendente');
    fireEvent.click(checkboxCompleta);

    // Verifica que o contador foi atualizado
    await waitFor(() => {
      expect(screen.getByTestId('tarefas-completas')).toHaveTextContent('0');
      expect(screen.getByTestId('tarefas-pendentes')).toHaveTextContent('2');
    });
  });
});
