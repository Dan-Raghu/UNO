import React from 'react';
import { Moon, Sun } from 'lucide-react';

export type AppTheme = 'light' | 'dark';

interface ThemeToggleProps {
  theme: AppTheme;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, className = '' }) => {
  const action = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={action}
      title={action}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center border border-slate-300 bg-white text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] ${className}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
};
