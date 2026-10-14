import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CourseType } from '../types';

export interface PresetCourse {
  id: string;
  name: string;
  code: string;
  type: string;
  courseType: CourseType;
}

export const PRESET_COURSES: PresetCourse[] = [
  {
    id: 'EN23C03',
    name: 'Foundation English',
    code: 'EN23C03',
    type: '2-0-2',
    courseType: '2-0-2',
  },
  {
    id: 'PH23C11',
    name: 'Engineering Physics',
    code: 'PH23C11',
    type: '3-0-2',
    courseType: '3-0-2',
  },
  {
    id: 'CS23C04',
    name: 'Programming in C',
    code: 'CS23C04',
    type: '2-0-4',
    courseType: '2-0-4',
  },
  {
    id: 'CS23101',
    name: 'Computational Thinking',
    code: 'CS23101',
    type: '1-0-2',
    courseType: '1-0-2',
  },
  {
    id: 'HERITAGE_OF_TAMILS',
    name: 'Heritage of Tamils',
    code: '',
    type: 'Theory',
    courseType: 'theory',
  },
  {
    id: 'CALCULUS',
    name: 'Calculus',
    code: '',
    type: 'Theory',
    courseType: 'theory',
  },
  {
    id: 'FEEE',
    name: 'Fundamentals of Electrical and Electronics Engineering',
    code: '',
    type: 'Theory',
    courseType: 'theory',
  },
];

interface SubjectSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubject: (name: string, code: string, courseType: CourseType) => void;
  currentSubjectName: string;
}

export const SubjectSelectionDialog: React.FC<SubjectSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSelectSubject,
  currentSubjectName,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<PresetCourse>(PRESET_COURSES[0]);

  useEffect(() => {
    if (isOpen) {
      if (currentSubjectName) {
        const found = PRESET_COURSES.find(
          (c) => c.name.toLowerCase() === currentSubjectName.toLowerCase()
        );
        if (found) {
          setSelectedCourse(found);
          return;
        }
      }
      setSelectedCourse(PRESET_COURSES[0]);
    }
  }, [isOpen, currentSubjectName]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectSubject(selectedCourse.name, selectedCourse.code, selectedCourse.courseType);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="bg-white border border-slate-300 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Dialog Header */}
        <div className="bg-[#172554] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#172554]">
          <h2 id="dialog-title" className="text-sm font-black uppercase tracking-wider">
            Select Course
          </h2>
          {currentSubjectName && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 cursor-pointer transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dialog Body - Only Course Name, Type and Code */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {PRESET_COURSES.map((course) => {
            const isSelected = selectedCourse.id === course.id;
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => setSelectedCourse(course)}
                aria-pressed={isSelected}
                className={`w-full text-left p-3.5 border cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#172554] bg-blue-50'
                    : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm sm:text-base font-black text-[#172554]">
                    {course.name}
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-[#172554] text-white px-2 py-0.5">
                    {course.type}
                  </span>
                  {course.code && (
                    <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-300 px-1.5 py-0.5">
                      {course.code}
                    </span>
                  )}
                </div>

                <div
                  className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-[#172554] bg-[#172554] text-white'
                      : 'border-slate-400 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dialog Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-[#172554] flex items-center justify-end gap-2">
          {currentSubjectName && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#172554] border border-[#172554] bg-white hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#172554] hover:bg-[#1e3a8a] transition-colors cursor-pointer"
          >
            Select Course
          </button>
        </div>
      </div>
    </div>
  );
};
