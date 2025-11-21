'use client';

import { Tarefa } from '@/lib/types';

interface ListaTarefasProps {
  tarefas: Tarefa[];
  onAlternarStatus?: (id: number) => void;
}

export default function ListaTarefas({ tarefas, onAlternarStatus }: ListaTarefasProps) {
  if (tarefas.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Lista de Tarefas
        </h2>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {tarefas.map((tarefa) => (
          <li 
            key={tarefa.id} 
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => onAlternarStatus?.(tarefa.id)}
                  className="shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    borderColor: tarefa.completa ? '#10b981' : '#d1d5db',
                    backgroundColor: tarefa.completa ? '#10b981' : 'transparent'
                  }}
                  aria-label={tarefa.completa ? 'Marcar como pendente' : 'Marcar como completa'}
                >
                  {tarefa.completa && (
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="3" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </button>
                
                <div className="flex-1">
                  <h3 
                    className={`text-base font-medium transition-all ${
                      tarefa.completa 
                        ? 'text-gray-500 line-through' 
                        : 'text-gray-900'
                    }`}
                  >
                    {tarefa.titulo}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Criada em: {new Date(tarefa.criadaEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <div>
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    tarefa.completa
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {tarefa.completa ? 'Completa' : 'Pendente'}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
