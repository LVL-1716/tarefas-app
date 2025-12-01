'use client';

import { useState, useEffect } from 'react';
import { Tarefa } from '@/lib/types';

interface ListaTarefasProps {
  tarefas: Tarefa[];
  onAlternarStatus?: (id: number) => void;
  onEditar?: (id: number, novoTitulo: string) => void;
  onDeletar?: (id: number) => void;
  onReordenar?: (tarefas: Tarefa[]) => void;
}

export default function ListaTarefas({ tarefas, onAlternarStatus, onEditar, onDeletar, onReordenar }: ListaTarefasProps): React.ReactNode {
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<number | null>(null);
  const [textoEdicao, setTextoEdicao] = useState('');
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [tarefasLocais, setTarefasLocais] = useState<Tarefa[]>(tarefas);

  // Atualizar estado local quando tarefas mudam
  useEffect(() => {
    setTarefasLocais(tarefas);
  }, [tarefas]);

  const iniciarEdicao = (id: number, titulo: string) => {
    setTarefaEmEdicao(id);
    setTextoEdicao(titulo);
  };

  const confirmarEdicao = (id: number) => {
    if (textoEdicao.trim().length > 0) {
      onEditar?.(id, textoEdicao);
      setTarefaEmEdicao(null);
      setTextoEdicao('');
    }
  };

  const cancelarEdicao = () => {
    setTarefaEmEdicao(null);
    setTextoEdicao('');
  };

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedId === null) return;

    const draggedIndex = tarefasLocais.findIndex(t => t.id === draggedId);
    if (draggedIndex === index) return;

    const novaLista = [...tarefasLocais];
    const [tarefaDragada] = novaLista.splice(draggedIndex, 1);
    novaLista.splice(index, 0, tarefaDragada);

    setTarefasLocais(novaLista);
    onReordenar?.(novaLista);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

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
        {tarefasLocais.map((tarefa, index) => (
          <li 
            key={tarefa.id}
            draggable
            onDragStart={() => handleDragStart(tarefa.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={`px-6 py-4 transition-all animate-fade-in-scale cursor-move ${
              draggedId === tarefa.id
                ? 'opacity-50 bg-blue-50 dark:bg-blue-900'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <span className="text-gray-400 dark:text-gray-600 cursor-grab active:cursor-grabbing text-lg">⋮⋮</span>
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
                  {tarefaEmEdicao === tarefa.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={textoEdicao}
                        onChange={(e) => setTextoEdicao(e.target.value)}
                        className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        autoFocus
                      />
                      <button
                        onClick={() => confirmarEdicao(tarefa.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        aria-label="Confirmar edição"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelarEdicao}
                        className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-sm"
                        aria-label="Cancelar edição"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span 
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    tarefa.completa
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {tarefa.completa ? 'Completa' : 'Pendente'}
                </span>
                
                {tarefaEmEdicao !== tarefa.id && (
                  <>
                    <button
                      onClick={() => iniciarEdicao(tarefa.id, tarefa.titulo)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm transition-colors"
                      aria-label="Editar tarefa"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => onDeletar?.(tarefa.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition-colors"
                      aria-label="Deletar tarefa"
                    >
                      🗑
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
