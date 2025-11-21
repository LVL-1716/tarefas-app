'use client';

import { useContadorDeTarefas } from '@/hooks/useContadorDeTarefas';
import { Tarefa } from '@/lib/types';

interface ContadorTarefasProps {
  tarefas: Tarefa[];
}

export default function ContadorTarefas({ tarefas }: ContadorTarefasProps) {
  const { total, completas, pendentes } = useContadorDeTarefas(tarefas);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Estatísticas
      </h2>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-3xl font-bold text-blue-600" data-testid="total-tarefas">
            {total}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total</p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-3xl font-bold text-green-600" data-testid="tarefas-completas">
            {completas}
          </p>
          <p className="text-sm text-gray-600 mt-1">Completas</p>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-3xl font-bold text-yellow-600" data-testid="tarefas-pendentes">
            {pendentes}
          </p>
          <p className="text-sm text-gray-600 mt-1">Pendentes</p>
        </div>
      </div>
    </div>
  );
}
