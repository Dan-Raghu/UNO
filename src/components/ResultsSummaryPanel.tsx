import React, { useState } from 'react';
import { CalculationBreakdown, SubjectData } from '../types';
import { Check, Copy, Layers } from 'lucide-react';

interface ResultsSummaryPanelProps {
  breakdown: CalculationBreakdown;
  subject: SubjectData;
}

export const ResultsSummaryPanel: React.FC<ResultsSummaryPanelProps> = ({
  breakdown,
  subject,
}) => {
  const [copied, setCopied] = useState(false);

  const testWeight = breakdown.testWeight;
  const labWeight = breakdown.labWeight;
  const actWeight = breakdown.actWeight;
  const eseTheoryWeight = breakdown.eseTheoryWeight;
  const eseLabWeight = breakdown.eseLabWeight;
  const eseWeight = eseTheoryWeight + eseLabWeight;
  const isSplit = eseTheoryWeight > 0 && eseLabWeight > 0;
  const isPracticalOnly = eseTheoryWeight === 0 && eseLabWeight > 0;
  const eseLabMaxNum = Number(subject.eseLabMax) || 100;
  const caMax = breakdown.caMax;
  const internalMax = breakdown.internalMax;
  const hasLab = labWeight > 0;
  const isSelfDevelopment = breakdown.courseType === 'self-development';
  const isIndustryOrientedTests = breakdown.courseType === 'industry-oriented-tests';
  const projectWorkComponents = breakdown.projectWorkComponents;

  const test1MaxNum = Number(subject.test1Max) || 50;
  const test2MaxNum = Number(subject.test2Max) || 50;

  const act1Count = Math.max(0, parseInt(String(subject.act1No), 10) || 0);
  const act1Sum = subject.act1Scores
    .slice(0, act1Count)
    .reduce<number>((acc, v) => acc + (v === '' || isNaN(Number(v)) ? 0 : Number(v)), 0);

  const lab1Count = Math.max(0, parseInt(String(subject.lab1No), 10) || 0);
  const lab1Sum = subject.lab1Scores
    .slice(0, lab1Count)
    .reduce<number>((acc, v) => acc + (v === '' || isNaN(Number(v)) ? 0 : Number(v)), 0);

  const act2Count = Math.max(0, parseInt(String(subject.act2No), 10) || 0);
  const act2Sum = subject.act2Scores
    .slice(0, act2Count)
    .reduce<number>((acc, v) => acc + (v === '' || isNaN(Number(v)) ? 0 : Number(v)), 0);

  const lab2Count = Math.max(0, parseInt(String(subject.lab2No), 10) || 0);
  const lab2Sum = subject.lab2Scores
    .slice(0, lab2Count)
    .reduce<number>((acc, v) => acc + (v === '' || isNaN(Number(v)) ? 0 : Number(v)), 0);

  const handleCopy = () => {
    if (breakdown.projectWorkComponents) {
      const componentLines = projectWorkComponents.map((component) =>
        `- ${component.label}: ${component.score.toFixed(2)}/100 × ${component.weight}% = ${component.contribution.toFixed(2)}`
      );
      const projectText = [
        'PROJECT WORK — TABLE 6',
        `Course: ${subject.name || 'Project Work'}`,
        'CONTINUOUS ASSESSMENT (60%)',
        ...componentLines.slice(0, 3),
        `CA subtotal: ${breakdown.internal_total.toFixed(2)} / 60`,
        'END-SEMESTER EXAMINATION (40%)',
        ...componentLines.slice(3),
        `ESE subtotal: ${breakdown.ese_p.toFixed(2)} / 40`,
        `FINAL TOTAL: ${breakdown.total.toFixed(2)} / 100`,
        `FINAL GRADE: ${breakdown.grade.letter} — ${breakdown.grade.label} | Grade Point: ${breakdown.grade.gradePoint}`,
      ].join('\n');
      navigator.clipboard.writeText(projectText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    const eseText = eseWeight === 0
      ? 'END SEMESTER EXAMINATION: None (two-test course)'
      : isSplit
      ? `END SEMESTER EXAMINATION:
- ESE Theory Exam: Scored ${subject.ese || 0}/100 | Contributed: ${breakdown.ese_theory_p.toFixed(2)} / ${eseTheoryWeight.toFixed(2)}
    - ESE ${isSelfDevelopment ? 'Practical' : 'Lab Practical'} Exam: Scored ${subject.eseLab || 0}/${eseLabMaxNum} | Contributed: ${breakdown.ese_lab_p.toFixed(2)} / ${eseLabWeight.toFixed(2)}
ESE Subtotal: ${breakdown.ese_p.toFixed(2)} / ${eseWeight.toFixed(2)}`
      : isPracticalOnly
        ? `END SEMESTER EXAMINATION: Practical exam scored ${subject.eseLab || 0}/${eseLabMaxNum} | Contributed: ${breakdown.ese_lab_p.toFixed(2)} / ${eseLabWeight.toFixed(2)}`
        : `END SEMESTER EXAMINATION: Scored ${subject.ese || 0}/100 | Contributed: ${breakdown.ese_p.toFixed(2)} / ${eseWeight.toFixed(2)}`;
    const text = `
ACADEMIC MARKS & GRADE SUMMARY
Course: ${subject.name || 'Course'} - ${breakdown.courseTypeLabel}
============================================================
${isIndustryOrientedTests ? 'MID TERM TEST' : 'CONTINUOUS ASSESSMENT 1'}
- ${isIndustryOrientedTests ? 'MID TERM TEST' : 'CA Test 1'}: Scored ${subject.test1 || 0}/${test1MaxNum} | Contributed: ${breakdown.test1_p.toFixed(2)} / ${testWeight}
${actWeight > 0 ? `- ${isSelfDevelopment ? 'Activities' : 'Assignments'}: Scored ${act1Sum}/${act1Count * 10} | Contributed: ${breakdown.act1_p.toFixed(2)} / ${actWeight}\n` : ''}
${hasLab ? `- ${isSelfDevelopment ? 'Lab' : 'Lab Practicals'}: Scored ${lab1Sum}/${lab1Count * 10} | Contributed: ${breakdown.lab1_p.toFixed(2)} / ${labWeight}\n` : ''}CA 1 Subtotal: ${breakdown.ca1_total.toFixed(2)} / ${caMax.toFixed(2)}

${isIndustryOrientedTests ? 'END COURSE TEST' : 'CONTINUOUS ASSESSMENT 2'}
- ${isIndustryOrientedTests ? 'END COURSE TEST' : 'CA Test 2'}: Scored ${subject.test2 || 0}/${test2MaxNum} | Contributed: ${breakdown.test2_p.toFixed(2)} / ${testWeight}
${actWeight > 0 ? `- ${isSelfDevelopment ? 'Activities' : 'Assignments'}: Scored ${act2Sum}/${act2Count * 10} | Contributed: ${breakdown.act2_p.toFixed(2)} / ${actWeight}\n` : ''}
${hasLab ? `- ${isSelfDevelopment ? 'Lab' : 'Lab Practicals'}: Scored ${lab2Sum}/${lab2Count * 10} | Contributed: ${breakdown.lab2_p.toFixed(2)} / ${labWeight}\n` : ''}CA 2 Subtotal: ${breakdown.ca2_total.toFixed(2)} / ${caMax.toFixed(2)}

INTERNAL ASSESSMENT TOTAL: ${breakdown.internal_total.toFixed(2)} / ${internalMax.toFixed(2)}
${eseText}
============================================================
FINAL TOTAL: ${breakdown.total.toFixed(2)} / 100.00
FINAL GRADE: Grade ${breakdown.grade.letter} - ${breakdown.grade.label} | Grade Point: ${breakdown.grade.gradePoint}
============================================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-300 p-4 sm:p-6 shadow-sm">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-5">
        <div>
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#1e3a8a] block">
            Academic Performance Evaluation
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-[#172554] tracking-tight">
            Marks &amp; Grade Summary
          </h2>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <span className="text-xs sm:text-sm font-black text-[#172554]">
              {subject.name || 'Selected Course'}
            </span>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-[#172554] text-white px-2 py-0.5 inline-flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>{breakdown.courseTypeLabel}</span>
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 sm:py-2 sm:px-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-[#172554] text-white hover:bg-[#1e3a8a] transition-colors border border-[#172554] cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>
        </div>
      </div>

      {/* Primary Result Overview Bar */}
      <div className="grid grid-cols-3 border border-slate-200 divide-x divide-slate-200 bg-slate-50 mb-5">
        {/* Total Marks */}
        <div className="p-2 sm:p-4 flex flex-col justify-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1e3a8a] truncate mb-0.5">
            Total Mark
          </span>
          <div className="flex items-baseline gap-1 sm:gap-1.5">
            <span className="text-xl sm:text-4xl font-black text-[#172554] tabular-nums">
              {breakdown.total.toFixed(2)}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ 100</span>
          </div>
        </div>

        {/* Final Letter Grade */}
        <div className="p-2 sm:p-4 flex flex-col justify-center text-center sm:text-left">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1e3a8a] truncate mb-0.5">
            Grade
          </span>
          <div className="text-xl sm:text-4xl font-black text-[#172554]">
            {breakdown.grade.letter}
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a] truncate mt-0.5">
            {breakdown.grade.label}
          </span>
        </div>

        {/* Grade Point */}
        <div className="p-2 sm:p-4 flex flex-col justify-center text-right sm:text-left">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#1e3a8a] truncate mb-0.5">
            Grade Point
          </span>
          <div className="text-xl sm:text-4xl font-black text-[#172554] tabular-nums">
            {breakdown.grade.gradePoint}
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a] mt-0.5">
            Scale 0 - 10
          </span>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="flex sm:hidden items-center justify-between text-[11px] font-bold text-[#1e3a8a] mb-1.5 px-0.5">
        <span>Detailed Distribution:</span>
        <span className="text-[10px] font-bold text-[#172554] bg-slate-100 px-1.5 py-0.5 border border-slate-300">
          ← Scroll horizontally →
        </span>
      </div>

      {projectWorkComponents ? (
      <div className="border border-slate-200 bg-white overflow-x-auto">
        <table className="min-w-[560px] w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#172554] text-white text-[11px] sm:text-xs uppercase tracking-wider font-extrabold">
              <th className="py-2.5 px-3 sm:px-4">Table 6 component</th>
              <th className="py-2.5 px-2 text-center">Weight</th>
              <th className="py-2.5 px-3 text-right">Score / 100</th>
              <th className="py-2.5 px-3 sm:px-4 text-right">Contributed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(['Continuous Assessment', 'End-Semester Examination'] as const).map((section) => {
              const components = projectWorkComponents.filter((component) => component.section === section);
              const weight = components.reduce((sum, component) => sum + component.weight, 0);
              const contribution = components.reduce((sum, component) => sum + component.contribution, 0);
              return (
                <React.Fragment key={section}>
                  <tr className="bg-slate-100 font-extrabold">
                    <td colSpan={2} className="px-3 py-2 uppercase text-[#172554]">{section}</td>
                    <td className="px-3 py-2 text-right text-[#172554]">{weight}%</td>
                    <td className="px-3 py-2 text-right font-black text-[#172554]">{contribution.toFixed(2)} / {weight}</td>
                  </tr>
                  {components.map((component) => (
                    <tr key={component.key} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-semibold text-[#172554]">{component.label}</td>
                      <td className="px-2 py-2 text-center font-bold">{component.weight}%</td>
                      <td className="px-3 py-2 text-right tabular-nums">{component.score.toFixed(2)} / 100</td>
                      <td className="px-3 py-2 text-right font-black tabular-nums">{component.contribution.toFixed(2)} / {component.weight}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
            <tr className="bg-[#172554] text-white font-black">
              <td colSpan={2} className="px-3 py-3 uppercase">Grand Total Score</td>
              <td className="px-3 py-3 text-right">100%</td>
              <td className="px-3 py-3 text-right tabular-nums">{breakdown.total.toFixed(2)} / 100</td>
            </tr>
          </tbody>
        </table>
      </div>
      ) : (
      /* Complete Organized Marks Distribution Table - horizontally scrollable on mobile */
      <div className="border border-slate-200 bg-white overflow-x-auto">
        <table className="min-w-[560px] w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#172554] text-white text-[11px] sm:text-xs uppercase tracking-wider font-extrabold border-b-2 border-[#172554]">
              <th className="py-2.5 px-3 sm:px-4">Assessment Component</th>
              <th className="py-2.5 px-2 text-center w-24">Weightage</th>
              <th className="py-2.5 px-3 text-right">Marks Scored</th>
              <th className="py-2.5 px-3 sm:px-4 text-right">Contributed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {/* --- CA 1 Header --- */}
            <tr className="bg-slate-100 font-extrabold border-t-2 border-[#172554]">
              <td colSpan={2} className="py-2 px-3 sm:px-4 uppercase text-[11px] sm:text-xs tracking-wider text-[#172554]">
                {isIndustryOrientedTests ? 'Mid Term Test' : 'Continuous Assessment 1'}
              </td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] text-[11px]">Max {caMax}M</td>
              <td className="py-2 px-3 sm:px-4 text-right text-[11px] sm:text-xs uppercase tracking-wider font-black text-[#172554]">
                {caMax.toFixed(2)} M
              </td>
            </tr>

            {/* Test 1 */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#172554]">
                {isIndustryOrientedTests ? 'MID TERM TEST' : 'CA Test 1'}
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#172554]">{testWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] tabular-nums whitespace-nowrap">
                {subject.test1 === '' ? '0.00' : Number(subject.test1).toFixed(2)} / {test1MaxNum}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                {breakdown.test1_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {testWeight}</span>
              </td>
            </tr>

            {/* Assignments 1 */}
            {actWeight > 0 && <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#172554]">
                {isSelfDevelopment ? 'Activities' : 'Assignments'}
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#172554]">{actWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] tabular-nums whitespace-nowrap">
                {act1Sum.toFixed(2)} / {act1Count * 10}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                {breakdown.act1_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {actWeight}</span>
              </td>
            </tr>}

            {/* Lab 1 */}
            {hasLab && (
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#172554]">
                Lab Practicals
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#172554]">{labWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] tabular-nums whitespace-nowrap">
                {lab1Sum.toFixed(2)} / {lab1Count * 10}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                {breakdown.lab1_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {labWeight}</span>
              </td>
            </tr>
            )}

            {/* CA 1 Subtotal */}
            <tr className="bg-slate-50 font-bold border-b border-[#172554]">
              <td colSpan={2} className="py-2 px-3 sm:px-4 font-black text-[#172554] uppercase text-[11px] sm:text-xs">
                {isIndustryOrientedTests ? 'Mid Term Test Total' : 'CA 1 Subtotal'}
              </td>
              <td className="py-2 px-3 text-right text-[#172554] font-bold text-[11px]">—</td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                {breakdown.ca1_total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {caMax}</span>
              </td>
            </tr>

            {/* --- CA 2 Header --- */}
            <tr className="bg-slate-100 font-extrabold border-t-2 border-[#172554]">
              <td colSpan={2} className="py-2 px-3 sm:px-4 uppercase text-[11px] sm:text-xs tracking-wider text-[#172554]">
                {isIndustryOrientedTests ? 'End Course Test' : 'Continuous Assessment 2'}
              </td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] text-[11px]">Max {caMax}M</td>
              <td className="py-2 px-3 sm:px-4 text-right text-[11px] sm:text-xs uppercase tracking-wider font-black text-[#172554]">
                {caMax.toFixed(2)} M
              </td>
            </tr>

            {/* Test 2 */}
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#172554]">
                {isIndustryOrientedTests ? 'END COURSE TEST' : 'CA Test 2'}
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#172554]">{testWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] tabular-nums whitespace-nowrap">
                {subject.test2 === '' ? '0.00' : Number(subject.test2).toFixed(2)} / {test2MaxNum}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                {breakdown.test2_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {testWeight}</span>
              </td>
            </tr>

            {/* Assignments 2 */}
            {actWeight > 0 && <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#172554]">
                {isSelfDevelopment ? 'Activities' : 'Assignments'}
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#172554]">{actWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] tabular-nums whitespace-nowrap">
                {act2Sum.toFixed(2)} / {act2Count * 10}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                {breakdown.act2_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {actWeight}</span>
              </td>
            </tr>}

            {/* Lab 2 */}
            {hasLab && (
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#172554]">
                Lab Practicals
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#172554]">{labWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] tabular-nums whitespace-nowrap">
                {lab2Sum.toFixed(2)} / {lab2Count * 10}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                {breakdown.lab2_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {labWeight}</span>
              </td>
            </tr>
            )}

            {/* CA 2 Subtotal */}
            <tr className="bg-slate-50 font-bold border-b border-[#172554]">
              <td colSpan={2} className="py-2 px-3 sm:px-4 font-black text-[#172554] uppercase text-[11px] sm:text-xs">
                {isIndustryOrientedTests ? 'End Course Test Total' : 'CA 2 Subtotal'}
              </td>
              <td className="py-2 px-3 text-right text-[#172554] font-bold text-[11px]">—</td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                {breakdown.ca2_total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {caMax}</span>
              </td>
            </tr>

            {/* Internal Total */}
            <tr className="bg-slate-200 font-black border-t-2 border-b-2 border-[#172554]">
              <td colSpan={2} className="py-2.5 px-3 sm:px-4 text-[#172554] uppercase tracking-wider text-[11px] sm:text-sm">
                {isIndustryOrientedTests ? 'Two-Test Total' : 'Internal Total'}
              </td>
              <td className="py-2.5 px-3 text-right text-[#172554] font-black text-[11px]">{internalMax}%</td>
              <td className="py-2.5 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums text-sm sm:text-lg whitespace-nowrap">
                {breakdown.internal_total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {internalMax}</span>
              </td>
            </tr>

            {/* ESE Rows */}
            {eseWeight > 0 && <>
            {isSplit ? (
              <>
                {/* ESE Theory */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 sm:px-4 font-bold text-[#172554]">
                    ESE Theory Exam
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-[#172554]">{eseTheoryWeight}%</td>
                  <td className="py-2 px-3 text-right font-bold text-[#172554] tabular-nums whitespace-nowrap">
                    {subject.ese === '' ? '0.00' : Number(subject.ese).toFixed(2)} / 100
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                    {breakdown.ese_theory_p.toFixed(2)}{' '}
                    <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {eseTheoryWeight}</span>
                  </td>
                </tr>

                {/* ESE Lab Practicals */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 sm:px-4 font-bold text-[#172554]">
                    ESE Lab Practicals
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-[#172554]">{eseLabWeight}%</td>
                  <td className="py-2 px-3 text-right font-bold text-[#172554] tabular-nums whitespace-nowrap">
                    {subject.eseLab === '' ? '0.00' : Number(subject.eseLab).toFixed(2)} / {eseLabMaxNum}
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                    {breakdown.ese_lab_p.toFixed(2)}{' '}
                    <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {eseLabWeight}</span>
                  </td>
                </tr>

                {/* ESE Combined Subtotal */}
                <tr className="bg-slate-100 font-bold border-b border-[#172554]">
                  <td colSpan={2} className="py-2 px-3 sm:px-4 font-black text-[#172554] uppercase text-[11px] sm:text-xs">
                    ESE Subtotal
                  </td>
                  <td className="py-2 px-3 text-right text-[#172554] font-bold text-[11px]">50%</td>
                  <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                    {breakdown.ese_p.toFixed(2)}{' '}
                    <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ 50</span>
                  </td>
                </tr>
              </>
            ) : isPracticalOnly ? (
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 sm:px-4 font-bold text-[#172554]">
                  ESE Practical Exam
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-[#172554]">{eseLabWeight}%</td>
                <td className="py-2.5 px-3 text-right font-bold text-[#172554] tabular-nums whitespace-nowrap">
                  {subject.eseLab === '' ? '0.00' : Number(subject.eseLab).toFixed(2)} / {eseLabMaxNum}
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                  {breakdown.ese_lab_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {eseLabWeight}</span>
                </td>
              </tr>
            ) : (
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-3 sm:px-4 font-bold text-[#172554]">
                  End Semester Theory
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-[#172554]">{eseTheoryWeight}%</td>
                <td className="py-2.5 px-3 text-right font-bold text-[#172554] tabular-nums whitespace-nowrap">
                  {subject.ese === '' ? '0.00' : Number(subject.ese).toFixed(2)} / 100
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right font-black text-[#172554] tabular-nums whitespace-nowrap">
                  {breakdown.ese_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/ {eseTheoryWeight}</span>
                </td>
              </tr>
            )}
            </>}

            {/* GRAND TOTAL ROW */}
            <tr className="bg-[#172554] text-white font-black border-t-2 border-[#172554]">
              <td colSpan={2} className="py-3 px-3 sm:py-4 sm:px-4 uppercase tracking-wider text-xs sm:text-base">
                Grand Total Score
              </td>
              <td className="py-3 px-3 text-right uppercase tracking-wider text-xs font-black">
                100%
              </td>
              <td className="py-3 px-3 sm:py-4 sm:px-4 text-right tabular-nums text-lg sm:text-2xl text-white whitespace-nowrap">
                {breakdown.total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-slate-200">/ 100</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};
