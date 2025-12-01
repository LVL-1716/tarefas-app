'use client';

export type FiltroStatus = 'todas' | 'completas' | 'pendentes';

interface FiltroTarefasProps {
  filtroAtivo: FiltroStatus;
  onFiltroMudar: (filtro: FiltroStatus) => void;
}

export default function FiltroTarefas({ filtroAtivo, onFiltroMudar }: FiltroTarefasProps) {
  const opcoesFiltro: { label: string; valor: FiltroStatus }[] = [
    { label: 'Todas', valor: 'todas' },
    { label: 'Completas', valor: 'completas' },
    { label: 'Pendentes', valor: 'pendentes' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-slide-down">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrar Tarefas</h3>
      
      <div className="flex gap-3 flex-wrap">
        {opcoesFiltro.map((opcao) => (
          <button
            key={opcao.valor}
            onClick={() => onFiltroMudar(opcao.valor)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filtroAtivo === opcao.valor
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            aria-pressed={filtroAtivo === opcao.valor}
            data-testid={`filtro-${opcao.valor}`}
          >
            {opcao.label}
          </button>
        ))}
      </div>
    </div>
  );
}
