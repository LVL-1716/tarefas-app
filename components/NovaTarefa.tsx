'use client';

import { useState, FormEvent } from 'react';

interface NovaTarefaProps {
  onAdicionar: (titulo: string) => void;
}

export default function NovaTarefa({ onAdicionar }: NovaTarefaProps) {
  const [titulo, setTitulo] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validação
    if (!titulo.trim()) {
      setErro('O título da tarefa não pode estar vazio');
      return;
    }

    if (titulo.trim().length < 3) {
      setErro('O título deve ter pelo menos 3 caracteres');
      return;
    }

    // Adiciona a tarefa
    onAdicionar(titulo.trim());
    
    // Limpa o formulário
    setTitulo('');
    setErro('');
  };

  const handleChange = (value: string) => {
    setTitulo(value);
    if (erro) {
      setErro('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Adicionar Nova Tarefa
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="titulo-input" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Título da Tarefa
          </label>
          
          <input
            id="titulo-input"
            type="text"
            value={titulo}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Digite o título da tarefa..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            aria-label="Título da tarefa"
            aria-invalid={!!erro}
            aria-describedby={erro ? 'erro-validacao' : undefined}
          />
          
          {erro && (
            <p 
              id="erro-validacao" 
              className="mt-2 text-sm text-red-600"
              role="alert"
            >
              {erro}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Adicionar Tarefa
        </button>
      </form>
    </div>
  );
}
