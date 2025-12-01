import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function TestComponent() {
  const { theme, isDark, setTheme } = useTheme();

  return (
    <>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="is-dark">{isDark ? 'dark' : 'light'}</div>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve inicializar com tema "system" por padrão', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  it('deve persistir tema no localStorage', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const botaoDark = screen.getByText('Dark');
    await user.click(botaoDark);

    expect(localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('deve adicionar classe "dark" ao documentElement quando tema é dark', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const botaoDark = screen.getByText('Dark');
    await user.click(botaoDark);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('deve remover classe "dark" quando tema é light', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Primeiro ativa dark mode
    await user.click(screen.getByText('Dark'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Depois muda para light
    await user.click(screen.getByText('Light'));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('deve atualizar isDark com base no tema', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('is-dark')).toHaveTextContent('light');

    await user.click(screen.getByText('Dark'));
    expect(screen.getByTestId('is-dark')).toHaveTextContent('dark');
  });

  it('deve carrega tema do localStorage se existir', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('deve lançar erro se useTheme for usado fora do provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const ComponentSemProvider = () => {
      const { theme } = useTheme();
      return <div>{theme}</div>;
    };

    expect(() => {
      render(<ComponentSemProvider />);
    }).toThrow('useTheme deve ser usado dentro de um ThemeProvider');

    consoleErrorSpy.mockRestore();
  });
});
