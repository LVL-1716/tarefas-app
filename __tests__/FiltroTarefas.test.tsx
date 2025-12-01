import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FiltroTarefas from '@/components/FiltroTarefas';

describe('FiltroTarefas', () => {
  it('deve renderizar todos os botões de filtro', () => {
    const mockFiltroMudar = jest.fn();
    render(<FiltroTarefas filtroAtivo="todas" onFiltroMudar={mockFiltroMudar} />);

    expect(screen.getByText('Todas')).toBeInTheDocument();
    expect(screen.getByText('Completas')).toBeInTheDocument();
    expect(screen.getByText('Pendentes')).toBeInTheDocument();
  });

  it('deve destacar o filtro ativo', () => {
    const mockFiltroMudar = jest.fn();
    render(<FiltroTarefas filtroAtivo="completas" onFiltroMudar={mockFiltroMudar} />);

    const botaoCompletas = screen.getByTestId('filtro-completas');
    expect(botaoCompletas).toHaveClass('bg-blue-600');
    expect(botaoCompletas).toHaveClass('text-white');
  });

  it('deve chamar onFiltroMudar quando um filtro é clicado', async () => {
    const user = userEvent.setup();
    const mockFiltroMudar = jest.fn();
    render(<FiltroTarefas filtroAtivo="todas" onFiltroMudar={mockFiltroMudar} />);

    const botaoPendentes = screen.getByText('Pendentes');
    await user.click(botaoPendentes);

    expect(mockFiltroMudar).toHaveBeenCalledWith('pendentes');
    expect(mockFiltroMudar).toHaveBeenCalledTimes(1);
  });

  it('deve ter aria-pressed correto para botões', () => {
    const mockFiltroMudar = jest.fn();
    render(<FiltroTarefas filtroAtivo="completas" onFiltroMudar={mockFiltroMudar} />);

    const botaoCompletas = screen.getByTestId('filtro-completas');
    const botaoPendentes = screen.getByTestId('filtro-pendentes');

    expect(botaoCompletas).toHaveAttribute('aria-pressed', 'true');
    expect(botaoPendentes).toHaveAttribute('aria-pressed', 'false');
  });

  it('deve permitir alternar entre diferentes filtros', async () => {
    const user = userEvent.setup();
    const mockFiltroMudar = jest.fn();
    const { rerender } = render(<FiltroTarefas filtroAtivo="todas" onFiltroMudar={mockFiltroMudar} />);

    let botaoTodas = screen.getByText('Todas');
    await user.click(botaoTodas);
    expect(mockFiltroMudar).toHaveBeenCalledWith('todas');

    rerender(<FiltroTarefas filtroAtivo="completas" onFiltroMudar={mockFiltroMudar} />);
    let botaoCompletas = screen.getByText('Completas');
    await user.click(botaoCompletas);
    expect(mockFiltroMudar).toHaveBeenCalledWith('completas');
  });
});
