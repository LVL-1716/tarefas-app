import { render } from '@testing-library/react';
import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '@testing-library/jest-dom';

describe('Providers - Snapshots', () => {
  it('deve renderizar ToastProvider sem erro', () => {
    const { container } = render(
      <ToastProvider>
        <div>Conteúdo do Toast</div>
      </ToastProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('deve renderizar ThemeProvider sem erro', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Conteúdo do Theme</div>
      </ThemeProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('deve renderizar ambos providers combinados', () => {
    const { container } = render(
      <ThemeProvider>
        <ToastProvider>
          <div>Conteúdo combinado</div>
        </ToastProvider>
      </ThemeProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
