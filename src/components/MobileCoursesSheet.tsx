import React, { useEffect, useRef } from 'react';
import { BookOpen, CheckCircle2, Circle, Pencil, PencilLine, X } from 'lucide-react';
import type { SubjectData } from '../types';
import type { PresetCourse, SemesterNumber } from './SubjectSelectionDialog';
import type {
  CourseProgress,
  SemesterCourseRow,
  SemesterElectiveRow,
} from './SemesterCourseDashboard';

interface MobileCoursesSheetProps {
  isOpen: boolean;
  semester: SemesterNumber | null;
  courses: SemesterCourseRow[];
  electiveSlots: SemesterElectiveRow[];
  otherCourses: Array<{ subject: SubjectData; progress: CourseProgress }>;
  selectedSubjectId: string;
  allCoursesCalculated: boolean;
  onClose: () => void;
  onSelectCourse: (course: PresetCourse) => void;
  onSelectElective: (slot: string) => void;
  onSelectOtherCourse: (subject: SubjectData) => void;
  onCalculateGpa: () => void;
}

function ProgressIndicator({ progress }: { progress: CourseProgress }) {
  const Icon = progress === 'Calculated'
    ? CheckCircle2
    : progress === 'Marks entered'
      ? PencilLine
      : Circle;
  const iconColor = progress === 'Calculated'
    ? 'text-emerald-700'
    : progress === 'Marks entered'
      ? 'text-blue-800'
      : 'text-slate-400';

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-700">
      <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden="true" />
      {progress}
    </span>
  );
}

export const MobileCoursesSheet: React.FC<MobileCoursesSheetProps> = ({
  isOpen,
  semester,
  courses,
  electiveSlots,
  otherCourses,
  selectedSubjectId,
  allCoursesCalculated,
  onClose,
  onSelectCourse,
  onSelectElective,
  onSelectOtherCourse,
  onCalculateGpa,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(true);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (restoreFocusRef.current) previouslyFocused?.focus();
      restoreFocusRef.current = true;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const courseCount = courses.length + electiveSlots.length + otherCourses.length;
  const openElectivePicker = (slot: string) => {
    restoreFocusRef.current = false;
    onSelectElective(slot);
  };
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close courses"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-slate-950/55"
      />
      <section
        id="mobile-courses-sheet"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-courses-title"
        className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col border-t border-slate-300 bg-white shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3.5">
          <div className="min-w-0">
            <h2 id="mobile-courses-title" className="text-base font-black uppercase tracking-wide text-[#172554]">
              {semester === null ? 'Courses' : `Semester ${semester} courses`}
            </h2>
            {semester !== null && (
              <p className="mt-0.5 text-xs text-slate-600">
                {courseCount} course{courseCount === 1 ? '' : 's'} in this semester
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close courses"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-300 text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {semester === null ? (
            <p className="border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              Select a semester from the menu at the top right to see its courses and start entering marks.
            </p>
          ) : (
            <>
              <section aria-labelledby="mobile-core-courses-heading">
                <h3 id="mobile-core-courses-heading" className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">
                  Core courses
                </h3>
                <ul className="divide-y divide-slate-200 border-y border-slate-200">
                  {courses.map(({ course, subject, progress }) => (
                    <li key={course.id}>
                      <button
                        type="button"
                        onClick={() => onSelectCourse(course)}
                        aria-pressed={subject?.id === selectedSubjectId}
                        className={`flex min-h-14 w-full items-center justify-between gap-3 px-2 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] ${
                          subject?.id === selectedSubjectId ? 'bg-blue-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-[#172554]">{course.name}</span>
                          {course.code && <span className="mt-0.5 block font-mono text-[11px] text-slate-600">{course.code}</span>}
                        </span>
                        <ProgressIndicator progress={progress} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {electiveSlots.length > 0 && (
                <section aria-labelledby="mobile-electives-heading">
                  <h3 id="mobile-electives-heading" className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">
                    Electives
                  </h3>
                  <ul className="divide-y divide-slate-200 border-y border-slate-200">
                    {electiveSlots.map(({ slot, course, subject, progress }) => (
                      <li key={slot} className="flex min-h-14 items-center gap-2 px-2 py-2">
                        <button
                          type="button"
                          onClick={() => course ? onSelectCourse(course) : openElectivePicker(slot)}
                          aria-pressed={subject?.id === selectedSubjectId}
                          className="flex min-h-11 min-w-0 flex-1 items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-[#172554]"
                        >
                          <span className="min-w-0">
                            <span className="block text-[11px] font-bold text-slate-600">{slot}</span>
                            <span className="mt-0.5 block truncate text-sm font-bold text-[#172554]">
                              {course?.name ?? 'Choose elective'}
                            </span>
                          </span>
                          {course
                            ? <ProgressIndicator progress={progress} />
                            : <BookOpen className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />}
                        </button>
                        {course && (
                          <button
                            type="button"
                            onClick={() => openElectivePicker(slot)}
                            aria-label={`Change ${slot}`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-300 text-slate-600 hover:border-[#172554] hover:text-[#172554] focus-visible:outline-2 focus-visible:outline-[#172554]"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {otherCourses.length > 0 && (
                <section aria-labelledby="mobile-other-courses-heading">
                  <h3 id="mobile-other-courses-heading" className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">
                    Other courses
                  </h3>
                  <ul className="divide-y divide-slate-200 border-y border-slate-200">
                    {otherCourses.map(({ subject, progress }) => (
                      <li key={subject.id}>
                        <button
                          type="button"
                          onClick={() => onSelectOtherCourse(subject)}
                          aria-pressed={subject.id === selectedSubjectId}
                          className={`flex min-h-14 w-full items-center justify-between gap-3 px-2 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] ${
                            subject.id === selectedSubjectId ? 'bg-blue-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-[#172554]">{subject.name || 'Other course'}</span>
                            {subject.code && <span className="mt-0.5 block font-mono text-[11px] text-slate-600">{subject.code}</span>}
                          </span>
                          <ProgressIndicator progress={progress} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>

        {semester !== null && allCoursesCalculated && (
          <footer className="border-t border-slate-200 bg-white px-4 py-3">
            <button
              type="button"
              onClick={onCalculateGpa}
              className="min-h-11 w-full border border-[#172554] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#172554]"
            >
              Calculate GPA
            </button>
          </footer>
        )}
      </section>
    </div>
  );
};
