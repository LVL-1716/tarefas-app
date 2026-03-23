import { render, screen } from '@testing-library/react';
import WhatsAppContactButton from '@/components/WhatsAppContactButton';

describe('WhatsAppContactButton', () => {
  it('deve renderizar o link do WhatsApp com o número correto', () => {
    render(<WhatsAppContactButton phoneNumber="5511999999999" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://wa.me/5511999999999?text=Ol%C3%A1%21%20Gostaria%20de%20conversar%20sobre%20o%20app%20de%20tarefas.');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('aria-label', 'Falar no WhatsApp');
  });

  it('deve usar mensagem customizada quando fornecida', () => {
    const customMessage = 'Mensagem personalizada';
    render(<WhatsAppContactButton phoneNumber="5511999999999" message={customMessage} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `https://wa.me/5511999999999?text=${encodeURIComponent(customMessage)}`);
  });

  it('deve renderizar o ícone do WhatsApp', () => {
    render(<WhatsAppContactButton phoneNumber="5511999999999" />);

    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});