import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FiltroTarefas from '@/components/FiltroTarefas';

describe('FiltroTarefas - Snapshots', () => {
  it('deve renderizar snapshot com filtro "todas" ativo', () => {
    const { container } = render(
      <FiltroTarefas filtroAtivo="todas" onFiltroMudar={jest.fn()} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('deve renderizar snapshot com filtro "completas" ativo', () => {
    const { container } = render(
      <FiltroTarefas filtroAtivo="completas" onFiltroMudar={jest.fn()} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('deve renderizar snapshot com filtro "pendentes" ativo', () => {
    const { container } = render(
      <FiltroTarefas filtroAtivo="pendentes" onFiltroMudar={jest.fn()} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
