import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { ToastContainer } from '@/components/Toast';

// Componente de teste que usa o hook
function TestComponent() {
  const { toasts, adicionarToast, removerToast } = useToast();

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removerToast} />
      <button onClick={() => adicionarToast('Sucesso!', 'sucesso')}>
        Adicionar Sucesso
      </button>
      <button onClick={() => adicionarToast('Erro!', 'erro')}>
        Adicionar Erro
      </button>
      <button onClick={() => adicionarToast('Info', 'info')}>
        Adicionar Info
      </button>
      <button onClick={() => adicionarToast('Aviso', 'aviso')}>
        Adicionar Aviso
      </button>
    </>
  );
}

describe('Toast', () => {
  it('deve renderizar toast com mensagem de sucesso', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const botao = screen.getByText('Adicionar Sucesso');
    await user.click(botao);

    expect(screen.getByText('Sucesso!')).toBeInTheDocument();
    expect(screen.getByTestId('toast-sucesso')).toBeInTheDocument();
  });

  it('deve renderizar toast com mensagem de erro', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const botao = screen.getByText('Adicionar Erro');
    await user.click(botao);

    expect(screen.getByText('Erro!')).toBeInTheDocument();
    expect(screen.getByTestId('toast-erro')).toBeInTheDocument();
  });

  it('deve remover toast ao clicar em fechar', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const botao = screen.getByText('Adicionar Sucesso');
    await user.click(botao);

    expect(screen.getByText('Sucesso!')).toBeInTheDocument();

    const botaoFechar = screen.getByLabelText('Fechar notificação');
    await user.click(botaoFechar);

    await waitFor(() => {
      expect(screen.queryByText('Sucesso!')).not.toBeInTheDocument();
    });
  });

  it('deve remover toast automaticamente após duração', async () => {
    const user = userEvent.setup();
    jest.useFakeTimers();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const botao = screen.getByText('Adicionar Sucesso');
    await user.click(botao);

    expect(screen.getByText('Sucesso!')).toBeInTheDocument();

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.queryByText('Sucesso!')).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('deve renderizar múltiplos toasts', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    await user.click(screen.getByText('Adicionar Sucesso'));
    await user.click(screen.getByText('Adicionar Erro'));
    await user.click(screen.getByText('Adicionar Info'));

    expect(screen.getByText('Sucesso!')).toBeInTheDocument();
    expect(screen.getByText('Erro!')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('deve lançar erro se useToast for usado fora do provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const ComponentSemProvider = () => {
      const { adicionarToast } = useToast();
      return <button onClick={() => adicionarToast('Teste', 'sucesso')}>Teste</button>;
    };

    expect(() => {
      render(<ComponentSemProvider />);
    }).toThrow('useToast deve ser usado dentro de um ToastProvider');

    consoleErrorSpy.mockRestore();
  });
});
