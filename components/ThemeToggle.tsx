'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setTheme('light')}
        className={`px-3 py-1 rounded transition-colors ${
          theme === 'light'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        aria-label="Ativar modo claro"
        title="Modo Claro"
      >
        ☀️
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`px-3 py-1 rounded transition-colors ${
          theme === 'dark'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        aria-label="Ativar modo escuro"
        title="Modo Escuro"
      >
        🌙
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`px-3 py-1 rounded transition-colors ${
          theme === 'system'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
        aria-label="Usar preferência do sistema"
        title="Sistema"
      >
        ⚙️
      </button>
    </div>
  );
}
