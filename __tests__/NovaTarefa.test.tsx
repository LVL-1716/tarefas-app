import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NovaTarefa from '@/components/NovaTarefa';

describe('NovaTarefa', () => {
  const mockOnAdicionar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o formulário corretamente', () => {
    render(<NovaTarefa onAdicionar={mockOnAdicionar} />);

    expect(screen.getByText('Adicionar Nova Tarefa')).toBeInTheDocument();
    expect(screen.getByLabelText('Título da Tarefa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o título da tarefa...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adicionar Tarefa' })).toBeInTheDocument();
  });

  it('deve permitir digitar no campo de input', async () => {
    const user = userEvent.setup();
    render(<NovaTarefa onAdicionar={mockOnAdicionar} />);

    const input = screen.getByLabelText('Título da Tarefa') as HTMLInputElement;
    
    await user.type(input, 'Nova tarefa de teste');

    expect(input.value).toBe('Nova tarefa de teste');
  });

  it('deve exibir erro quando tentar submeter com título vazio', async () => {
    render(<NovaTarefa onAdicionar={mockOnAdicionar} />);

    const botao = screen.getByRole('button', { name: 'Adicionar Tarefa' });
    
    fireEvent.click(botao);

    await waitFor(() => {
      expect(screen.getByText('O título da tarefa não pode estar vazio')).toBeInTheDocument();
    });

    expect(mockOnAdicionar).not.toHaveBeenCalled();
  });

  it('deve exibir erro quando o título tem menos de 3 caracteres', async () => {
    const user = userEvent.setup();
    render(<NovaTarefa onAdicionar={mockOnAdicionar} />);

    const input = screen.getByLabelText('Título da Tarefa');
    const botao = screen.getByRole('button', { name: 'Adicionar Tarefa' });

    await user.type(input, 'AB');
    fireEvent.click(botao);

    await waitFor(() => {
      expect(screen.getByText('O título deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });

    expect(mockOnAdicionar).not.toHaveBeenCalled();
  });

  it('deve chamar onAdicionar com o título correto ao submeter', async () => {
    const user = userEvent.setup();
    render(<NovaTarefa onAdicionar={mockOnAdicionar} />);

    const input = screen.getByLabelText('Título da Tarefa');
    const botao = screen.getByRole('button', { name: 'Adicionar Tarefa' });

    await user.type(input, 'Minha nova tarefa');
    fireEvent.click(botao);

    await waitFor(() => {
      expect(mockOnAdicionar).toHaveBeenCalledWith('Minha nova tarefa');
      expect(mockOnAdicionar).toHaveBeenCalledTimes(1);
    });
  });

  it('deve limpar o input após submissão bem-sucedida', async () => {
    const user = userEvent.setup();
    render(<NovaTarefa onAdicionar={mockOnAdicionar} />);

    const input = screen.getByLabelText('Título da Tarefa') as HTMLInputElement;
    const botao = screen.getByRole('button', { name: 'Adicionar Tarefa' });

    await user.type(input, 'Tarefa para limpar');
    fireEvent.click(botao);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('deve remover o título vazio (trim) antes de adicionar', async () => {
    const user = userEvent.setup();
    render(<NovaTarefa onAdicionar={mockOnAdicionar} />);

    const input = screen.getByLabelText('Título da Tarefa');
    const botao = screen.getByRole('button', { name: 'Adicionar Tarefa' });

    await user.type(input, '  Tarefa com espaços  ');
    fireEvent.click(botao);

    await waitFor(() => {
      expect(mockOnAdicionar).toHaveBeenCalledWith('Tarefa com espaços');
    });
  });

  it('deve remover mensagem de erro ao começar a digitar novamente', async () => {
    const user = userEvent.setup();
    render(<NovaTarefa onAdicionar={mockOnAdicionar} />);

    const input = screen.getByLabelText('Título da Tarefa');
    const botao = screen.getByRole('button', { name: 'Adicionar Tarefa' });

    // Submete vazio para gerar erro
    fireEvent.click(botao);

    await waitFor(() => {
      expect(screen.getByText('O título da tarefa não pode estar vazio')).toBeInTheDocument();
    });

    // Começa a digitar
    await user.type(input, 'Nova');

    await waitFor(() => {
      expect(screen.queryByText('O título da tarefa não pode estar vazio')).not.toBeInTheDocument();
    });
  });

  it('deve ter atributos de acessibilidade corretos', () => {
    render(<NovaTarefa onAdicionar={mockOnAdicionar} />);

    const input = screen.getByLabelText('Título da Tarefa');
    
    expect(input).toHaveAttribute('aria-label', 'Título da tarefa');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('deve atualizar aria-invalid quando há erro', async () => {
    render(<NovaTarefa onAdicionar={mockOnAdicionar} />);

    const input = screen.getByLabelText('Título da Tarefa');
    const botao = screen.getByRole('button', { name: 'Adicionar Tarefa' });

    fireEvent.click(botao);

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'erro-validacao');
    });
  });
});
