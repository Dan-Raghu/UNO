import React from 'react';
import {
  BookOpen,
  Calculator,
  GraduationCap,
  TableProperties,
} from 'lucide-react';

type WorkspaceTab = 'calculator' | 'grades' | 'gpa';

interface MobileBottomNavigationProps {
  activeTab: WorkspaceTab | null;
  coursesOpen: boolean;
  onNavigate: (tab: WorkspaceTab) => void;
  onToggleCourses: () => void;
  coursesButtonRef: React.Ref<HTMLButtonElement>;
}

const destinations = [
  { label: 'Calculator', tab: 'calculator', Icon: Calculator },
  { label: 'Courses', tab: null, Icon: BookOpen },
  { label: 'GPA Hub', tab: 'gpa', Icon: GraduationCap },
  { label: 'Grading', tab: 'grades', Icon: TableProperties },
] as const;

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeTab,
  coursesOpen,
  onNavigate,
  onToggleCourses,
  coursesButtonRef,
}) => (
  <nav
    aria-label="Mobile navigation"
    className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-300 bg-white md:hidden"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
  >
    {destinations.map(({ label, tab, Icon }) => {
      const isActive = tab === null ? coursesOpen : activeTab === tab;
      return (
        <button
          key={label}
          ref={tab === null ? coursesButtonRef : undefined}
          type="button"
          onClick={tab === null ? onToggleCourses : () => onNavigate(tab)}
          aria-pressed={isActive}
          aria-expanded={tab === null ? coursesOpen : undefined}
          aria-controls={tab === null && coursesOpen ? 'mobile-courses-sheet' : undefined}
          className={`flex min-h-[4.25rem] flex-col items-center justify-center gap-1 border-t-2 px-1 py-2 text-[9px] font-bold uppercase tracking-wide transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] ${
            isActive ? 'border-[#172554] text-[#172554]' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#172554]'
          }`}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          <span className="whitespace-nowrap">{label}</span>
        </button>
      );
    })}
  </nav>
);
