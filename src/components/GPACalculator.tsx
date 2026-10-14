import React, { useState } from 'react';
import { CheckCircle2, GraduationCap } from 'lucide-react';
import type { SubjectData } from '../types';
import type { GpaHistoryEntry } from '../firebaseData';
import { GPA_COURSES } from '../gpaCourses';
import {
  calculateMarks,
  getCourseType,
  getCourseWeights,
} from '../calculatorUtils';

const findCourseSubject = (subjects: SubjectData[], course: (typeof GPA_COURSES)[number]) =>
  subjects.find(
    (subject) =>
      subject.code === course.code ||
      subject.name.trim().toLowerCase() === course.name.toLowerCase()
  );

const entered = (value: unknown): boolean =>
  value !== '' &&
  value !== null &&
  value !== undefined &&
  Number.isFinite(Number(value));

function scoresComplete(countValue: number | string, scores: (number | string)[]) {
  if (!entered(countValue)) return false;
  const count = Number(countValue);
  if (!Number.isInteger(count) || count < 0) return false;
  return scores.length >= count && scores.slice(0, count).every(entered);
}

function subjectMarksComplete(subject: SubjectData): boolean {
  if (!subject.name?.trim()) return false;

  const weights = getCourseWeights(getCourseType(subject));

  if (!entered(subject.test1) || !entered(subject.test2)) return false;
  if (!entered(subject.act1No) || !entered(subject.act2No)) return false;
  if (!scoresComplete(subject.act1No, subject.act1Scores)) return false;
  if (!scoresComplete(subject.act2No, subject.act2Scores)) return false;

  if (weights.labWeight > 0) {
    if (!entered(subject.lab1No) || !entered(subject.lab2No)) return false;
    if (!scoresComplete(subject.lab1No, subject.lab1Scores)) return false;
    if (!scoresComplete(subject.lab2No, subject.lab2Scores)) return false;
  }

  if (weights.eseTheoryWeight > 0 && !entered(subject.ese)) return false;
  if (weights.eseLabWeight > 0 && !entered(subject.eseLab)) return false;

  return true;
}

export function isGpaReady(subjects: SubjectData[]): boolean {
  return GPA_COURSES.every((course) => {
    const subject = findCourseSubject(subjects, course);
    return Boolean(subject && subjectMarksComplete(subject));
  });
}

interface GPACalculatorProps {
  subjects: SubjectData[];
  history: GpaHistoryEntry[];
  onCalculate: (entry: GpaHistoryEntry) => Promise<void>;
}

export const GPACalculator: React.FC<GPACalculatorProps> = ({ subjects, history, onCalculate }) => {
  const [calculatedSubjects, setCalculatedSubjects] = useState<SubjectData[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [calculationError, setCalculationError] = useState('');
  const gpaReady = isGpaReady(subjects);
  const hasCalculated = gpaReady && calculatedSubjects === subjects;

  const rows = GPA_COURSES.map((course) => {
    const subject = findCourseSubject(subjects, course);
    const result = subject && subjectMarksComplete(subject) ? calculateMarks(subject) : null;
    return {
      ...course,
      complete: Boolean(result),
      mark: result?.total ?? null,
      grade: result?.grade.letter ?? null,
      gradePoint: result?.grade.gradePoint ?? null,
      weightedPoints: result ? course.credits * result.grade.gradePoint : null,
    };
  });

  const totalCredits = rows.reduce((sum, row) => sum + row.credits, 0);
  const totalWeightedPoints = rows.reduce((sum, row) => sum + (row.weightedPoints ?? 0), 0);
  const gpa = totalCredits ? totalWeightedPoints / totalCredits : 0;
  const completedCourses = rows.filter((row) => row.complete).length;

  const handleCalculateGpa = async () => {
    if (!gpaReady || isSaving) return;
    setIsSaving(true);
    setCalculationError('');
    try {
      const entry: GpaHistoryEntry = {
        id: `gpa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        gpa,
        totalCredits,
        weightedGradePoints: totalWeightedPoints,
        createdAtMs: Date.now(),
        courses: rows.map((row) => ({
          code: row.code,
          name: row.name,
          credits: row.credits,
          mark: row.mark ?? 0,
          grade: row.grade ?? '',
          gradePoint: row.gradePoint ?? 0,
        })),
      };
      await onCalculate(entry);
      setCalculatedSubjects(subjects);
    } catch {
      setCalculationError('Could not save GPA history. Check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border border-slate-300 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 flex items-center justify-center bg-[#172554] text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Semester I · B.E. CSE
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-[#172554]">
              GPA Calculator
            </h2>
          </div>
        </div>

        <div className="mt-5 border border-blue-200 bg-blue-50 p-4 sm:p-5" role="status">
          <p className="font-bold text-[#172554]">Enter all 7 course marks to calculate your GPA.</p>
          <p className="text-xs font-bold text-[#172554] mt-3" aria-live="polite">
            {completedCourses} of 7 courses complete
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#172554] text-white text-xs uppercase tracking-wide">
              <tr>
                <th scope="col" className="px-4 py-3">Course</th>
                <th scope="col" className="px-4 py-3 text-center">Credits</th>
                <th scope="col" className="px-4 py-3 text-center">Marks status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row) => (
                <tr key={row.code} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#172554]">{row.name}</p>
                    <p className="text-xs text-slate-500">{row.code}</p>
                  </td>
                  <td className="px-4 py-3 text-center">{row.credits}</td>
                  <td className="px-4 py-3 text-center">
                    {row.complete ? (
                      <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        Complete
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-600">Marks needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-slate-600">
            {gpaReady ? 'All 7 courses are complete. You can calculate your GPA.' : 'Complete the missing marks before calculating.'}
          </p>
          <button
            type="button"
            onClick={handleCalculateGpa}
            disabled={!gpaReady || isSaving}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider bg-[#172554] text-white hover:bg-[#1e3a8a] disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" aria-hidden="true" />
            {isSaving ? 'Saving…' : 'Calculate GPA'}
          </button>
        </div>
        {calculationError && <p className="border-t border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900" role="alert">{calculationError}</p>}
      </div>

      {hasCalculated && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-slate-300 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Semester GPA</p>
              <p className="text-3xl font-black text-[#172554] mt-1">{gpa.toFixed(2)}</p>
              <p className="text-xs text-slate-500">Out of 10.00</p>
            </div>
            <div className="bg-white border border-slate-300 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total Credits</p>
              <p className="text-3xl font-black text-[#172554] mt-1">{totalCredits}</p>
              <p className="text-xs text-slate-500">Across 7 courses</p>
            </div>
            <div className="bg-white border border-slate-300 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Weighted Grade Points</p>
              <p className="text-3xl font-black text-[#172554] mt-1">{totalWeightedPoints.toFixed(2)}</p>
              <p className="text-xs text-slate-500">Credits × grade points</p>
            </div>
          </div>

          <div className="bg-white border border-slate-300 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#172554] text-white text-xs uppercase tracking-wide">
                <tr>
                  <th scope="col" className="px-4 py-3">Course</th>
                  <th scope="col" className="px-4 py-3 text-center">Credits</th>
                  <th scope="col" className="px-4 py-3 text-center">Final Mark</th>
                  <th scope="col" className="px-4 py-3 text-center">Grade</th>
                  <th scope="col" className="px-4 py-3 text-center">Grade Point</th>
                  <th scope="col" className="px-4 py-3 text-center">Weighted Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((row) => (
                  <tr key={row.code} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-bold text-[#172554]">{row.name}</p>
                      <p className="text-xs text-slate-500">{row.code}</p>
                    </td>
                    <td className="px-4 py-3 text-center">{row.credits}</td>
                    <td className="px-4 py-3 text-center">{row.mark?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center font-bold">{row.grade}</td>
                    <td className="px-4 py-3 text-center">{row.gradePoint}</td>
                    <td className="px-4 py-3 text-center">{row.weightedPoints?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-black text-[#172554]">
                <tr>
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-center">{totalCredits}</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">{totalWeightedPoints.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-xs text-slate-500">
            Formula: GPA = Σ (course credits × grade points) ÷ total credits. Total Semester I credits: 21.
          </p>
        </>
      )}

      {history.length > 0 && (
        <section className="bg-white border border-slate-300 shadow-sm overflow-x-auto" aria-labelledby="gpa-history-heading">
          <div className="p-4 border-b border-slate-200">
            <h3 id="gpa-history-heading" className="font-black text-[#172554]">GPA history</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3">Calculated</th>
                <th scope="col" className="px-4 py-3 text-center">Credits</th>
                <th scope="col" className="px-4 py-3 text-center">GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3">{new Date(entry.createdAtMs).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">{entry.totalCredits}</td>
                  <td className="px-4 py-3 text-center font-black text-[#172554]">{entry.gpa.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </section>
  );
};
