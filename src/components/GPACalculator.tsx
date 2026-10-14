import React from 'react';
import { GraduationCap, LockKeyhole } from 'lucide-react';
import type { SubjectData } from '../types';
import {
  calculateMarks,
  getCourseType,
  getCourseWeights,
} from '../calculatorUtils';

export const GPA_COURSES = [
  { code: 'EN23C03', name: 'Foundation English', credits: 3 },
  { code: 'MA23C11', name: 'Calculus', credits: 4 },
  { code: 'PH23C11', name: 'Engineering Physics', credits: 4 },
  {
    code: 'EE23C02',
    name: 'Fundamentals of Electrical and Electronics Engineering',
    credits: 3,
  },
  { code: 'CS23C04', name: 'Programming in C', credits: 4 },
  { code: 'CS23101', name: 'Computational Thinking', credits: 2 },
  { code: 'UC23H01', name: 'Heritage of Tamils', credits: 1 },
] as const;

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
  if (!subject.name?.trim() || !subject.code?.trim()) return false;

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
    const subject = subjects.find((item) => item.code === course.code);
    return Boolean(subject && subjectMarksComplete(subject));
  });
}

interface GPACalculatorProps {
  subjects: SubjectData[];
}

export const GPACalculator: React.FC<GPACalculatorProps> = ({ subjects }) => {
  const rows = GPA_COURSES.map((course) => {
    const subject = subjects.find((item) => item.code === course.code)!;
    const result = calculateMarks(subject);
    return {
      ...course,
      mark: result.total,
      grade: result.grade.letter,
      gradePoint: result.grade.gradePoint,
      weightedPoints: course.credits * result.grade.gradePoint,
    };
  });

  const totalCredits = rows.reduce((sum, row) => sum + row.credits, 0);
  const totalWeightedPoints = rows.reduce((sum, row) => sum + row.weightedPoints, 0);
  const gpa = totalCredits ? totalWeightedPoints / totalCredits : 0;

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

        <p className="text-sm text-slate-600 mt-4">
          GPA is calculated from each course’s final mark, the app’s existing grade-point
          scale, and the credits specified in the Semester I syllabus.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Semester GPA</p>
            <p className="text-3xl font-black text-[#172554] mt-1">{gpa.toFixed(2)}</p>
            <p className="text-xs text-slate-500">Out of 10.00</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total Credits</p>
            <p className="text-3xl font-black text-[#172554] mt-1">{totalCredits}</p>
            <p className="text-xs text-slate-500">Across 7 courses</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Weighted Grade Points</p>
            <p className="text-3xl font-black text-[#172554] mt-1">{totalWeightedPoints.toFixed(2)}</p>
            <p className="text-xs text-slate-500">Credits × grade points</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-300 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#172554] text-white text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3 text-center">Credits</th>
              <th className="px-4 py-3 text-center">Final Mark</th>
              <th className="px-4 py-3 text-center">Grade</th>
              <th className="px-4 py-3 text-center">Grade Point</th>
              <th className="px-4 py-3 text-center">Weighted Points</th>
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
                <td className="px-4 py-3 text-center">{row.mark.toFixed(2)}</td>
                <td className="px-4 py-3 text-center font-bold">{row.grade}</td>
                <td className="px-4 py-3 text-center">{row.gradePoint}</td>
                <td className="px-4 py-3 text-center">{row.weightedPoints.toFixed(2)}</td>
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
        Formula: GPA = Σ (course credits × grade points) ÷ total credits.
        Total Semester I credits: 21.
      </p>
    </section>
  );
};

export const GpaLockedNotice: React.FC = () => (
  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 text-amber-950">
    <LockKeyhole className="w-5 h-5 mt-0.5 shrink-0" />
    <div>
      <p className="font-bold">GPA Calculator is locked</p>
      <p className="text-sm mt-1">
        Please enter marks for all 7 Semester I courses to unlock your GPA Calculator.
        Fill in all applicable assessment marks for each course.
      </p>
    </div>
  </div>
);
