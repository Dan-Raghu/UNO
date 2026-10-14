import React from 'react';
import { SubjectData } from '../types';
import { getCourseType, getCourseWeights } from '../calculatorUtils';
import { RotateCcw, BookOpen, ChevronRight } from 'lucide-react';

interface SubjectHeaderProps {
  subject: SubjectData;
  onOpenDialog: () => void;
  onResetToBlank: () => void;
}

export const SubjectHeader: React.FC<SubjectHeaderProps> = ({
  subject,
  onOpenDialog,
  onResetToBlank,
}) => {
  const courseTypeLabel = getCourseWeights(getCourseType(subject)).courseTypeLabel;

  return (
    <div className="bg-white border border-slate-300 p-4 sm:p-6 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Course Details Selection Dialog Trigger */}
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#172554] mb-1.5">
            Course / Subject Name:
          </label>

          {subject.name ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm sm:text-base font-black text-[#172554]">
                  {subject.name}
                </span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 bg-[#172554] text-white">
                  {courseTypeLabel}
                </span>
                {subject.code && (
                  <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 bg-white border border-slate-300 text-slate-700">
                    {subject.code}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onOpenDialog}
                className="text-xs px-3 py-2 border border-slate-300 bg-white hover:border-[#172554] hover:bg-slate-50 text-[#172554] font-bold uppercase tracking-wider transition-colors shrink-0 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                title="Change subject from dialog box"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Change Subject</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenDialog}
              className="w-full px-3.5 py-3 text-left text-xs sm:text-sm font-bold text-[#172554] bg-slate-50 hover:bg-white border border-slate-300 hover:border-[#172554] transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#172554] shrink-0" />
                <span>Select a course or course type from the dialog box</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#172554] underline shrink-0">
                <span>Open Dialog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          )}
        </div>

        {/* Action: Clear / Blank Form */}
        <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
          <button
            type="button"
            onClick={onResetToBlank}
            className="text-xs px-3.5 py-2.5 border border-slate-300 bg-white hover:border-[#172554] hover:bg-slate-50 text-[#172554] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
            title="Clear all fields to enter fresh marks"
          >
            <RotateCcw className="w-4 h-4 text-[#172554]" />
            <span>Clear / Blank Form</span>
          </button>
        </div>
      </div>
    </div>
  );
};
