import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-all"
      title="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6 text-slate-800" />
      ) : (
        <Sun className="w-6 h-6 text-yellow-400" />
      )}
    </button>
  );
}
