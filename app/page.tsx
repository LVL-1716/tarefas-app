import { obterTarefas } from '@/lib/tarefas';
import GerenciadorTarefas from '@/components/GerenciadorTarefas';

// Este é um Server Component - executa no servidor
export default async function Home() {
  // Carrega as tarefas no servidor
  const tarefas = await obterTarefas();

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            Gerenciador de Tarefas
          </h1>
          <p className="text-center text-gray-600">
            Gerencie suas tarefas de forma simples e eficiente
          </p>
        </header>

        <GerenciadorTarefas tarefasIniciais={tarefas} />
      </div>
    </main>
  );
}
