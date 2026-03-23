import { render, screen, fireEvent } from '@testing-library/react';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <ToastProvider>
        {component}
      </ToastProvider>
    </ThemeProvider>
  );
};

describe('WhatsAppButton', () => {
  const mockTarefas = [
    { titulo: 'Tarefa 1', completa: false },
    { titulo: 'Tarefa 2', completa: true },
    { titulo: 'Tarefa 3', completa: false },
  ];

  beforeEach(() => {
    // Mock window.open
    global.open = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o botão de compartilhar', () => {
    renderWithProviders(<WhatsAppButton tarefas={mockTarefas} />);
    
    expect(screen.getByText('Compartilhar no WhatsApp')).toBeInTheDocument();
  });

  it('deve abrir o modal ao clicar no botão', () => {
    renderWithProviders(<WhatsAppButton tarefas={mockTarefas} />);
    
    const button = screen.getByText('Compartilhar no WhatsApp');
    fireEvent.click(button);
    
    expect(screen.getByText('Compartilhar Tarefas')).toBeInTheDocument();
    expect(screen.getByText('Deseja compartilhar sua lista de tarefas via WhatsApp?')).toBeInTheDocument();
  });

  it('deve fechar o modal ao clicar em Cancelar', () => {
    renderWithProviders(<WhatsAppButton tarefas={mockTarefas} />);
    
    const button = screen.getByText('Compartilhar no WhatsApp');
    fireEvent.click(button);
    
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    
    expect(screen.queryByText('Compartilhar Tarefas')).not.toBeInTheDocument();
  });

  it('deve abrir WhatsApp com a mensagem correta ao clicar em Compartilhar', () => {
    renderWithProviders(<WhatsAppButton tarefas={mockTarefas} />);
    
    const button = screen.getByText('Compartilhar no WhatsApp');
    fireEvent.click(button);
    
    const shareButton = screen.getByText('Compartilhar');
    fireEvent.click(shareButton);
    
    expect(global.open).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/?text='),
      '_blank'
    );
  });

  it('deve gerar mensagem correta para tarefas vazias', () => {
    renderWithProviders(<WhatsAppButton tarefas={[]} />);
    
    const button = screen.getByText('Compartilhar no WhatsApp');
    fireEvent.click(button);
    
    const shareButton = screen.getByText('Compartilhar');
    fireEvent.click(shareButton);
    
    expect(global.open).toHaveBeenCalledWith(
      expect.stringContaining('Nenhuma%20tarefa%20ainda'),
      '_blank'
    );
  });
});