import React from 'react';
import { BookOpen, Check, Circle, Pencil, PencilLine } from 'lucide-react';
import type { SubjectData } from '../types';
import type { PresetCourse } from './SubjectSelectionDialog';

export type CourseProgress = 'Not started' | 'Marks entered' | 'Calculated';

export interface SemesterCourseRow {
  course: PresetCourse;
  subject: SubjectData | null;
  progress: CourseProgress;
}

export interface SemesterElectiveRow {
  slot: string;
  course: PresetCourse | null;
  subject: SubjectData | null;
  progress: CourseProgress;
}

interface SemesterCourseDashboardProps {
  semester: number;
  courses: SemesterCourseRow[];
  electiveSlots: SemesterElectiveRow[];
  otherCourses: Array<{ subject: SubjectData; progress: CourseProgress }>;
  selectedSubjectId: string;
  onSelectCourse: (course: PresetCourse) => void;
  onSelectElective: (slot: string) => void;
  onSelectOtherCourse: (subject: SubjectData) => void;
}

function ProgressMark({ progress }: { progress: CourseProgress }) {
  if (progress === 'Calculated') {
    return <Check className="h-3.5 w-3.5 shrink-0 text-emerald-700" aria-label="Calculated" />;
  }
  if (progress === 'Marks entered') {
    return <PencilLine className="h-3.5 w-3.5 shrink-0 text-blue-800" aria-label="Marks entered" />;
  }
  return <Circle className="h-3 w-3 shrink-0 text-slate-400" aria-label="Not started" />;
}

export const SemesterCourseDashboard: React.FC<SemesterCourseDashboardProps> = ({
  semester,
  courses,
  electiveSlots,
  otherCourses,
  selectedSubjectId,
  onSelectCourse,
  onSelectElective,
  onSelectOtherCourse,
}) => (
  <section className="mx-auto min-w-0 max-w-full" aria-labelledby="semester-courses-heading">
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h1 id="semester-courses-heading" className="text-lg font-black uppercase tracking-wide text-[#172554] sm:text-xl">
          Semester {semester} courses
        </h1>
        <p className="mt-0.5 hidden text-xs text-slate-600 sm:block">Select a tab to edit that course’s marks.</p>
      </div>
      <p className="shrink-0 text-[11px] font-semibold text-slate-600" aria-live="polite">
        {courses.length + electiveSlots.length} course{courses.length + electiveSlots.length === 1 ? '' : 's'} in this semester
      </p>
    </div>

    <div className="max-w-full overflow-hidden border-y border-slate-300 bg-white">
      <ul aria-label={`Semester ${semester} courses`} className="flex min-w-0 max-w-full snap-x snap-mandatory flex-nowrap items-stretch gap-1.5 overflow-x-auto overscroll-x-contain px-2 py-2.5">
        {courses.map(({ course, subject, progress }) => (
          <li key={course.id} className="shrink-0 snap-start">
            <button
              type="button"
              onClick={() => onSelectCourse(course)}
              aria-pressed={subject?.id === selectedSubjectId}
              aria-label={`${course.name}, ${progress}`}
              title={`${course.name}${course.code ? ` · ${course.code}` : ''} — ${progress}`}
              className={`flex h-10 max-w-56 snap-start items-center gap-2 border px-3 text-left text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#172554] ${
                subject?.id === selectedSubjectId
                  ? 'border-[#172554] bg-[#172554] text-white'
                  : 'border-slate-300 bg-white text-[#172554] hover:border-[#172554] hover:bg-slate-50'
              }`}
            >
              <span className="max-w-40 truncate">{course.name}</span>
              <span className={subject?.id === selectedSubjectId ? 'text-white' : ''}>
                <ProgressMark progress={progress} />
              </span>
            </button>
          </li>
        ))}
        {electiveSlots.map(({ slot, course, subject, progress }) => (
          <li key={slot} className="flex shrink-0 snap-start items-center gap-1">
            <button
              type="button"
              onClick={() => course ? onSelectCourse(course) : onSelectElective(slot)}
              aria-pressed={subject?.id === selectedSubjectId}
              aria-label={`${slot}${course ? `: ${course.name}` : ', choose course'}${course ? `, ${progress}` : ''}`}
              title={course ? `${slot}: ${course.name} — ${progress}` : `${slot}: choose an option`}
              className={`flex h-10 max-w-56 items-center gap-2 border px-3 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#172554] ${subject?.id === selectedSubjectId ? 'border-[#172554] bg-[#172554] text-white' : 'border-slate-300 bg-white text-[#172554] hover:border-[#172554] hover:bg-slate-50'}`}
            >
              <span className="max-w-40 truncate">{course?.name ?? slot}</span>
              {course && <ProgressMark progress={progress} />}
              {!course && <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            </button>
            {course && (
              <button
                type="button"
                onClick={() => onSelectElective(slot)}
                aria-label={`Change ${slot} option`}
                title={`Change ${slot} option`}
                className="flex h-10 w-8 shrink-0 items-center justify-center border border-slate-300 text-slate-600 hover:border-[#172554] hover:text-[#172554] focus-visible:outline-2 focus-visible:outline-[#172554]"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
        {otherCourses.length > 0 && (
          <>
            <li aria-hidden="true" className="mx-1 my-1 w-px shrink-0 bg-slate-300" />
            {otherCourses.map(({ subject, progress }) => (
              <li key={subject.id} className="shrink-0 snap-start">
                <button
                  type="button"
                  onClick={() => onSelectOtherCourse(subject)}
                  aria-pressed={subject.id === selectedSubjectId}
                  aria-label={`${subject.name || 'Other course'}, ${progress}`}
                  title={`${subject.name || 'Other course'}${subject.code ? ` · ${subject.code}` : ''} — ${progress}`}
                  className={`flex h-10 max-w-56 items-center gap-2 border px-3 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#172554] ${subject.id === selectedSubjectId ? 'border-[#172554] bg-[#172554] text-white' : 'border-slate-300 bg-white text-[#172554] hover:border-[#172554] hover:bg-slate-50'}`}
                >
                  <span className="max-w-40 truncate">{subject.name || 'Other course'}</span>
                  <ProgressMark progress={progress} />
                </button>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  </section>
);
