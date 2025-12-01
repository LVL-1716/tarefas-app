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

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

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

  it('deve editar uma tarefa existente', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    const botãoEditar = screen.getAllByLabelText('Editar tarefa')[0];
    await user.click(botãoEditar);

    const inputEdicao = screen.getByDisplayValue('Estudar Next.js');
    await user.clear(inputEdicao);
    await user.type(inputEdicao, 'Estudar React');

    const botãoConfirmar = screen.getByLabelText('Confirmar edição');
    await user.click(botãoConfirmar);

    await waitFor(() => {
      expect(screen.getByText('Estudar React')).toBeInTheDocument();
      expect(screen.queryByText('Estudar Next.js')).not.toBeInTheDocument();
    });
  });

  it('deve deletar uma tarefa', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    // Verifica que a tarefa existe
    expect(screen.getByText('Estudar Next.js')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('2');
    });

    // Clica em deletar
    const botãoDeletar = screen.getAllByLabelText('Deletar tarefa')[0];
    await user.click(botãoDeletar);

    // Verifica que a tarefa foi removida
    await waitFor(() => {
      expect(screen.queryByText('Estudar Next.js')).not.toBeInTheDocument();
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('1');
    });
  });

  it('deve atualizar o contador ao deletar uma tarefa', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('2');
      expect(screen.getByTestId('tarefas-completas')).toHaveTextContent('1');
    });

    const botãoDeletar = screen.getAllByLabelText('Deletar tarefa')[1];
    await user.click(botãoDeletar);

    await waitFor(() => {
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('1');
      expect(screen.getByTestId('tarefas-completas')).toHaveTextContent('0');
    });
  });

  it('deve renderizar componente de filtro', () => {
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    expect(screen.getByText('Filtrar Tarefas')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-todas')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-completas')).toBeInTheDocument();
    expect(screen.getByTestId('filtro-pendentes')).toBeInTheDocument();
  });

  it('deve filtrar tarefas completas ao clicar no filtro', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    const botãoFiltroCompletas = screen.getByTestId('filtro-completas');
    await user.click(botãoFiltroCompletas);

    // Deve mostrar apenas a tarefa completa
    expect(screen.getByText('Fazer exercícios')).toBeInTheDocument();
    expect(screen.queryByText('Estudar Next.js')).not.toBeInTheDocument();
  });

  it('deve filtrar tarefas pendentes ao clicar no filtro', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    const botãoFiltroPendentes = screen.getByTestId('filtro-pendentes');
    await user.click(botãoFiltroPendentes);

    // Deve mostrar apenas a tarefa pendente
    expect(screen.getByText('Estudar Next.js')).toBeInTheDocument();
    expect(screen.queryByText('Fazer exercícios')).not.toBeInTheDocument();
  });

  it('deve mostrar todas as tarefas ao clicar em "Todas"', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    // Filtra para completas
    let botãoFiltroCompletas = screen.getByTestId('filtro-completas');
    await user.click(botãoFiltroCompletas);
    expect(screen.queryByText('Estudar Next.js')).not.toBeInTheDocument();

    // Volta para todas
    const botãoFiltroTodas = screen.getByTestId('filtro-todas');
    await user.click(botãoFiltroTodas);

    expect(screen.getByText('Estudar Next.js')).toBeInTheDocument();
    expect(screen.getByText('Fazer exercícios')).toBeInTheDocument();
  });

  it('deve manter o filtro ao adicionar nova tarefa', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    // Filtra para pendentes
    const botãoFiltroPendentes = screen.getByTestId('filtro-pendentes');
    await user.click(botãoFiltroPendentes);

    // Adiciona nova tarefa (pendente por padrão)
    const input = screen.getByLabelText('Título da Tarefa');
    const botaoAdicionar = screen.getByRole('button', { name: 'Adicionar Tarefa' });
    
    await user.type(input, 'Nova tarefa pendente');
    fireEvent.click(botaoAdicionar);

    // Deve mostrar a nova tarefa pois é pendente e o filtro está em "pendentes"
    await waitFor(() => {
      expect(screen.getByText('Nova tarefa pendente')).toBeInTheDocument();
    });
  });

  it('deve aplicar filtro corretamente após alternar status de tarefa', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    // Filtra para pendentes
    const botãoFiltroPendentes = screen.getByTestId('filtro-pendentes');
    await user.click(botãoFiltroPendentes);

    // Deve mostrar a tarefa pendente
    expect(screen.getByText('Estudar Next.js')).toBeInTheDocument();
    expect(screen.queryByText('Fazer exercícios')).not.toBeInTheDocument();

    // Marca como completa
    const checkbox = screen.getByLabelText('Marcar como completa');
    await user.click(checkbox);

    // Deve desaparecer da lista filtrada de pendentes
    await waitFor(() => {
      expect(screen.queryByText('Estudar Next.js')).not.toBeInTheDocument();
    });
  });

  it('deve manter o filtro ao deletar tarefa', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    // Filtra para completas
    const botãoFiltroCompletas = screen.getByTestId('filtro-completas');
    await user.click(botãoFiltroCompletas);

    // Deleta a tarefa completa
    const botãoDeletar = screen.getByLabelText('Deletar tarefa');
    await user.click(botãoDeletar);

    // Lista deve ficar vazia pois era a única tarefa completa
    await waitFor(() => {
      expect(screen.getByText('Nenhuma tarefa encontrada.')).toBeInTheDocument();
    });
  });

  it('deve persistir tarefas no localStorage', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    // Aguarda carregamento
    await waitFor(() => {
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('2');
    });

    // Verifica se tarefas foram salvas no localStorage
    const stored = localStorage.getItem('tarefas-app:tarefas');
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(2);
  });

  it('deve adicionar nova tarefa e persistir no localStorage', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    const input = screen.getByLabelText('Título da Tarefa');
    const botaoAdicionar = screen.getByRole('button', { name: 'Adicionar Tarefa' });

    await user.type(input, 'Tarefa persistida');
    fireEvent.click(botaoAdicionar);

    await waitFor(() => {
      expect(screen.getByText('Tarefa persistida')).toBeInTheDocument();
    });

    // Verifica localStorage
    const stored = localStorage.getItem('tarefas-app:tarefas');
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(3);
    expect(parsed[0].titulo).toBe('Tarefa persistida');
  });

  it('deve atualizar tarefa no localStorage ao editar', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    await waitFor(() => {
      expect(screen.getByText('Estudar Next.js')).toBeInTheDocument();
    });

    const botãoEditar = screen.getAllByLabelText('Editar tarefa')[0];
    await user.click(botãoEditar);

    const inputEdicao = screen.getByDisplayValue('Estudar Next.js');
    await user.clear(inputEdicao);
    await user.type(inputEdicao, 'Aprender React');

    const botãoConfirmar = screen.getByLabelText('Confirmar edição');
    await user.click(botãoConfirmar);

    await waitFor(() => {
      expect(screen.getByText('Aprender React')).toBeInTheDocument();
    });

    // Verifica localStorage
    const stored = localStorage.getItem('tarefas-app:tarefas');
    const parsed = JSON.parse(stored!);
    expect(parsed[1].titulo).toBe('Aprender React');
  });

  it('deve persistir alteração de status no localStorage', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('tarefas-pendentes')).toHaveTextContent('1');
    });

    const checkbox = screen.getByLabelText('Marcar como completa');
    await user.click(checkbox);

    await waitFor(() => {
      expect(screen.getByTestId('tarefas-completas')).toHaveTextContent('2');
    });

    // Verifica localStorage
    const stored = localStorage.getItem('tarefas-app:tarefas');
    const parsed = JSON.parse(stored!);
    const tarefaEditada = parsed.find((t: any) => t.id === 1);
    expect(tarefaEditada.completa).toBe(true);
  });

  it('deve deletar tarefa e persistir no localStorage', async () => {
    const user = userEvent.setup();
    render(<GerenciadorTarefas tarefasIniciais={tarefasMock} />);

    await waitFor(() => {
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('2');
    });

    const botãoDeletar = screen.getAllByLabelText('Deletar tarefa')[0];
    await user.click(botãoDeletar);

    await waitFor(() => {
      expect(screen.getByTestId('total-tarefas')).toHaveTextContent('1');
    });

    // Verifica localStorage
    const stored = localStorage.getItem('tarefas-app:tarefas');
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe(2);
  });
});
