import React, { useState, useEffect, useMemo } from 'react';
import { SubjectData, CourseType } from './types';
import {
  DEFAULT_SUBJECT,
  calculateMarks,
  syncScoresArray,
  GRADE_SCALE,
  SPECIAL_GRADES,
} from './calculatorUtils';
import { ContinuousAssessmentSection } from './components/ContinuousAssessmentSection';
import { EndSemesterSection } from './components/EndSemesterSection';
import { ResultsSummaryPanel } from './components/ResultsSummaryPanel';
import { SubjectHeader } from './components/SubjectHeader';
import { SubjectSelectionDialog } from './components/SubjectSelectionDialog';
import { GPACalculator, GpaLockedNotice, isGpaReady } from './components/GPACalculator';
import {
  Calculator,
  TableProperties,
  Plus,
  Trash2,
  ArrowDown,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

const STORAGE_KEY = 'ca_ese_calculator_sem1_user_selected_v18';

export const INITIAL_EMPTY_SUBJECT: SubjectData = {
  ...DEFAULT_SUBJECT,
  id: 'sub_1',
  name: '',
  code: '',
  courseType: '2-0-2',
};

export default function App() {
  // Load saved subjects from localStorage or ask the user to select their courses
  const [subjects, setSubjects] = useState<SubjectData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.name) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved subjects:', e);
    }
    return [INITIAL_EMPTY_SUBJECT];
  });

  const [currentSubjectId, setCurrentSubjectId] = useState<string>(
    subjects[0]?.id || 'sub_1'
  );
  const [activeTab, setActiveTab] = useState<'calculator' | 'grades' | 'gpa'>('calculator');
  const gpaReady = useMemo(() => isGpaReady(subjects), [subjects]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(() => {
    // Open dialog on load if user hasn't selected a course yet
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return true;
    try {
      const parsed = JSON.parse(saved);
      return !parsed[0]?.name;
    } catch {
      return true;
    }
  });

  // Save to localStorage whenever subjects changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    } catch (e) {
      console.error('Failed to save subjects to localStorage:', e);
    }
  }, [subjects]);

  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id === currentSubjectId) || subjects[0] || DEFAULT_SUBJECT;
  }, [subjects, currentSubjectId]);

  const hasSubjectSelected = Boolean(currentSubject.name && currentSubject.name.trim().length > 0);
  const isComputationalThinking =
    currentSubject.code === 'CS23101' ||
    currentSubject.courseType === '1-0-2' ||
    Boolean(currentSubject.name && currentSubject.name.toLowerCase().includes('computational'));

  // Update specific fields of the current subject
  const updateCurrentSubject = (updates: Partial<SubjectData>) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== currentSubject.id) return s;

        const updated = { ...s, ...updates };

        // Ensure dynamic arrays stay synced if counts changed without filling mock values
        if (updates.act1No !== undefined) {
          updated.act1Scores = syncScoresArray(updated.act1Scores, updates.act1No);
        }
        if (updates.act2No !== undefined) {
          updated.act2Scores = syncScoresArray(updated.act2Scores, updates.act2No);
        }
        if (updates.lab1No !== undefined) {
          updated.lab1Scores = syncScoresArray(updated.lab1Scores, updates.lab1No);
        }
        if (updates.lab2No !== undefined) {
          updated.lab2Scores = syncScoresArray(updated.lab2Scores, updates.lab2No);
        }

        return updated;
      })
    );
  };

  const handleSelectSubjectFromDialog = (name: string, code: string, courseType: CourseType) => {
    updateCurrentSubject({ name, code, courseType });
    setIsDialogOpen(false);
  };

  const handleAddNewSubject = () => {
    const newId = `sub_${Date.now()}`;
    const newSub: SubjectData = {
      ...DEFAULT_SUBJECT,
      id: newId,
      name: '',
      code: '',
      courseType: '2-0-2',
    };
    setSubjects((prev) => [...prev, newSub]);
    setCurrentSubjectId(newId);
    setIsDialogOpen(true);
  };

  const handleDeleteSubject = (idToDelete: string) => {
    if (subjects.length <= 1) return;
    const remaining = subjects.filter((s) => s.id !== idToDelete);
    setSubjects(remaining);
    if (currentSubjectId === idToDelete) {
      setCurrentSubjectId(remaining[0].id);
    }
  };

  const handleReset = () => {
    updateCurrentSubject({
      ...DEFAULT_SUBJECT,
      id: currentSubject.id,
      name: currentSubject.name,
      code: currentSubject.code,
      courseType: currentSubject.courseType,
    });
  };

  // Perform calculations
  const breakdown = useMemo(() => {
    return calculateMarks(currentSubject);
  }, [currentSubject]);

  const scrollToSummary = () => {
    const el = document.getElementById('summary-at-end');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand wordmark */}
          <a href="#" className="text-base sm:text-lg font-black tracking-tight text-[#172554] flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="w-9 h-9 bg-[#172554] text-white flex items-center justify-center text-xs font-black shadow-sm">
              CA
            </span>
            <span className="uppercase">Academic Marks Calculator</span>
          </a>

          {/* Quick status bar */}
          <div className="hidden lg:flex items-center gap-3 border border-slate-200 px-3.5 py-1.5 bg-slate-50 text-xs shadow-sm">
            {hasSubjectSelected ? (
              <>
                <span className="font-bold text-[#172554] uppercase tracking-wider">{currentSubject.name}:</span>
                <span className="font-semibold text-slate-600 bg-white px-1.5 py-0.5 border border-slate-300">
                  {breakdown.courseTypeLabel}
                </span>
                <span className="font-black text-[#172554] tabular-nums text-sm">
                  {breakdown.total.toFixed(2)} / 100
                </span>
                <span className="text-[#172554] font-bold">·</span>
                <span className="font-black text-[#172554]">Grade {breakdown.grade.letter}</span>
                <span className="text-[#172554] font-bold">·</span>
                <button
                  type="button"
                  onClick={scrollToSummary}
                  className="text-[#1e3a8a] hover:underline font-bold inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider ml-1 cursor-pointer"
                >
                  <span>Summary at End</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <span className="font-bold text-slate-600 uppercase tracking-wider">
                Select a Semester I subject
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#172554]">
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`transition-colors flex items-center gap-2 py-1 cursor-pointer ${
                activeTab === 'calculator'
                  ? 'text-[#172554] font-black border-b-2 border-[#172554]'
                  : 'text-slate-600 hover:text-[#172554]'
              }`}
            >
              <Calculator className="w-5 h-5" />
              <span>Assessment Calculator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('grades')}
              className={`transition-colors flex items-center gap-2 py-1 cursor-pointer ${
                activeTab === 'grades'
                  ? 'text-[#172554] font-black border-b-2 border-[#172554]'
                  : 'text-slate-600 hover:text-[#172554]'
              }`}
            >
              <TableProperties className="w-5 h-5" />
              <span>Grading System</span>
            </button>
            <button
              type="button"
              disabled={!gpaReady}
              onClick={() => setActiveTab('gpa')}
              title={gpaReady ? 'Open GPA Calculator' : 'Enter marks for all seven courses first'}
              className={`transition-colors flex items-center gap-2 py-1 ${!gpaReady ? 'text-slate-400 cursor-not-allowed' : activeTab === 'gpa' ? 'text-[#172554] font-black border-b-2 border-[#172554] cursor-pointer' : 'text-slate-600 hover:text-[#172554] cursor-pointer'}`}
            >
              <GraduationCap className="w-5 h-5" />
              <span>GPA Calculator</span>
              {!gpaReady && <span className="text-[10px]">(Locked)</span>}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Course Tab Selector Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 overflow-x-auto gap-3 border-b border-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#172554] whitespace-nowrap hidden sm:inline">
              Courses:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {subjects.map((sub, idx) => {
                const isSelected = sub.id === currentSubject.id;
                const label = sub.name || `Course ${idx + 1} - Unselected`;
                return (
                  <div
                    key={sub.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#172554] text-white border-[#172554]'
                        : 'bg-white text-[#172554] border-slate-300 hover:border-[#172554] hover:bg-slate-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setCurrentSubjectId(sub.id)}
                      className="whitespace-nowrap cursor-pointer"
                    >
                      {label}
                    </button>
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubject(sub.id);
                        }}
                        aria-label={`Delete ${sub.name || 'course'}`}
                        className={`p-0.5 transition-colors cursor-pointer ${
                          isSelected ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-rose-600'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddNewSubject}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-white text-[#172554] border border-slate-300 hover:border-[#172554] hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>

        {/* Mobile Navigation Segmented Control */}
        <div className="grid grid-cols-3 md:hidden mb-6 border border-slate-300 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            aria-pressed={activeTab === 'calculator'}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'calculator' ? 'bg-[#172554] text-white' : 'text-[#172554]'
            }`}
          >
            Calculator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grades')}
            aria-pressed={activeTab === 'grades'}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-l border-slate-300 ${
              activeTab === 'grades' ? 'bg-[#172554] text-white' : 'text-[#172554]'
            }`}
          >
            Grading Scale
          </button>
          <button
            type="button"
            disabled={!gpaReady}
            onClick={() => setActiveTab('gpa')}
            aria-pressed={activeTab === 'gpa'}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-l border-slate-300 ${!gpaReady ? 'text-slate-400 cursor-not-allowed' : activeTab === 'gpa' ? 'bg-[#172554] text-white' : 'text-[#172554]'}`}
          >
            GPA {!gpaReady && '🔒'}
          </button>
        </div>

        {!gpaReady && <div className="mb-6"><GpaLockedNotice /></div>}
        {/* Subject Header with Dialog Box Trigger */}
        <SubjectHeader
          subject={currentSubject}
          onOpenDialog={() => setIsDialogOpen(true)}
          onResetToBlank={handleReset}
        />

        {activeTab === 'calculator' && (
          <>
            {hasSubjectSelected ? (
              <div className="space-y-8">
                {/* Course Type Specification */}
                <div>
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#172554] mb-2.5">
                    Course Type = {breakdown.courseTypeLabel}
                  </div>

                  {/* CA 1 Section */}
                  <ContinuousAssessmentSection
                    number={1}
                    title="Continuous Assessment 1"
                    testMax={currentSubject.test1Max}
                    test={currentSubject.test1}
                    onTestMaxChange={(val) => updateCurrentSubject({ test1Max: val })}
                    onTestChange={(val) => updateCurrentSubject({ test1: val })}
                    testPoints={breakdown.test1_p}
                    testWeight={breakdown.testWeight}
                    allowCustomTestMax={isComputationalThinking}
                    actNo={currentSubject.act1No}
                    onActNoChange={(val) => updateCurrentSubject({ act1No: val })}
                    actScores={currentSubject.act1Scores}
                    onActScoresChange={(scores) => updateCurrentSubject({ act1Scores: scores })}
                    actPoints={breakdown.act1_p}
                    actWeight={breakdown.actWeight}
                    actStartIndex={1}
                    labNo={currentSubject.lab1No}
                    onLabNoChange={(val) => updateCurrentSubject({ lab1No: val })}
                    labScores={currentSubject.lab1Scores}
                    onLabScoresChange={(scores) => updateCurrentSubject({ lab1Scores: scores })}
                    labPoints={breakdown.lab1_p}
                    labWeight={breakdown.labWeight}
                    labStartIndex={1}
                    subtotal={breakdown.ca1_total}
                    caMax={breakdown.caMax}
                  />
                </div>

                {/* CA 2 Section */}
                <ContinuousAssessmentSection
                  number={2}
                  title="Continuous Assessment 2"
                  testMax={currentSubject.test2Max}
                  test={currentSubject.test2}
                  onTestMaxChange={(val) => updateCurrentSubject({ test2Max: val })}
                  onTestChange={(val) => updateCurrentSubject({ test2: val })}
                  testPoints={breakdown.test2_p}
                  testWeight={breakdown.testWeight}
                  allowCustomTestMax={isComputationalThinking}
                  actNo={currentSubject.act2No}
                  onActNoChange={(val) => updateCurrentSubject({ act2No: val })}
                  actScores={currentSubject.act2Scores}
                  onActScoresChange={(scores) => updateCurrentSubject({ act2Scores: scores })}
                  actPoints={breakdown.act2_p}
                  actWeight={breakdown.actWeight}
                  actStartIndex={(Number(currentSubject.act1No) || 0) + 1}
                  labNo={currentSubject.lab2No}
                  onLabNoChange={(val) => updateCurrentSubject({ lab2No: val })}
                  labScores={currentSubject.lab2Scores}
                  onLabScoresChange={(scores) => updateCurrentSubject({ lab2Scores: scores })}
                  labPoints={breakdown.lab2_p}
                  labWeight={breakdown.labWeight}
                  labStartIndex={(Number(currentSubject.lab1No) || 0) + 1}
                  subtotal={breakdown.ca2_total}
                  caMax={breakdown.caMax}
                />

                {/* End Semester Section */}
                <EndSemesterSection
                  courseType={breakdown.courseType}
                  ese={currentSubject.ese}
                  onEseChange={(val) => updateCurrentSubject({ ese: val })}
                  eseLab={currentSubject.eseLab}
                  onEseLabChange={(val) => updateCurrentSubject({ eseLab: val })}
                  eseLabMax={currentSubject.eseLabMax}
                  onEseLabMaxChange={(val) => updateCurrentSubject({ eseLabMax: val })}
                  esePoints={breakdown.ese_p}
                  eseTheoryPoints={breakdown.ese_theory_p}
                  eseLabPoints={breakdown.ese_lab_p}
                  eseTheoryWeight={breakdown.eseTheoryWeight}
                  eseLabWeight={breakdown.eseLabWeight}
                  internalTotal={breakdown.internal_total}
                  internalMax={breakdown.internalMax}
                />

                {/* THE SUMMARY AT THE END: Large text size, single organized table */}
                <div id="summary-at-end" className="pt-2">
                  <ResultsSummaryPanel breakdown={breakdown} subject={currentSubject} />
                </div>
              </div>
            ) : (
              /* Prompt when no subject has been selected yet from dialog box */
              <div className="bg-white border-2 border-[#172554] p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-xs">
                <div className="w-16 h-16 bg-slate-50 border-2 border-[#172554] text-[#172554] flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#172554] mb-2">
                  Please Select Subject
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mb-6 max-w-lg mx-auto leading-relaxed">
                  Choose one of your Semester I subjects (<span className="font-bold text-[#172554]">Foundation English</span>, <span className="font-bold text-[#172554]">Engineering Physics</span>, <span className="font-bold text-[#172554]">Programming in C</span>, <span className="font-bold text-[#172554]">Computational Thinking</span>, <span className="font-bold text-[#172554]">Heritage of Tamils</span>, <span className="font-bold text-[#172554]">Calculus</span>, or <span className="font-bold text-[#172554]">Fundamentals of Electrical and Electronics Engineering</span>) to calculate your Continuous Assessment and End Semester grades.
                </p>
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="px-6 py-3 bg-[#172554] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#1e3a8a] transition-colors inline-flex items-center gap-2.5 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>Select Course Now</span>
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'grades' && (
          <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            {/* Table 11: Grading of Courses */}
            <div className="bg-white border border-slate-300 p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#172554] mb-1 uppercase tracking-wide">
                Table 11 – Grading of Courses
              </h2>
              <p className="text-xs font-semibold text-slate-600 mb-4">
                Official Letter Grades, Descriptions, and Grade Points.
              </p>

              <div className="overflow-x-auto border border-slate-200">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#172554] text-white border-b-2 border-[#172554] text-xs font-extrabold uppercase tracking-wider">
                      <th className="py-3 px-4">Grade</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-center">Grade Points</th>
                      <th className="py-3 px-4">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                    {GRADE_SCALE.map((grade) => {
                      const isCurrent = hasSubjectSelected && breakdown.grade.letter === grade.letter;
                      return (
                        <tr
                          key={grade.letter}
                          className={isCurrent ? 'bg-blue-50 font-bold text-[#172554]' : 'hover:bg-slate-50'}
                        >
                          <td className="py-3 px-4 text-base font-black text-[#172554]">{grade.letter}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{grade.label}</td>
                          <td className="py-3 px-4 text-center font-bold text-[#172554]">{grade.gradePoint}</td>
                          <td className="py-3 px-4">
                            {isCurrent ? (
                              <span className="inline-flex items-center gap-1 text-xs font-black text-[#172554] bg-blue-50 border border-blue-200 px-2 py-0.5 uppercase tracking-wider">
                                Current Grade
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Special grades from Table 11 */}
                    {SPECIAL_GRADES.map((sg) => (
                      <tr key={sg.code} className="hover:bg-slate-50 text-slate-600">
                        <td className="py-3 px-4 text-base font-black text-[#172554]">{sg.code}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{sg.description}</td>
                        <td className="py-3 px-4 text-center font-bold text-[#172554]">{sg.gradePoint}</td>
                        <td className="py-3 px-4 text-slate-400">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 12: Range of Marks for Absolute grading system */}
            <div className="bg-white border border-slate-300 p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#172554] mb-1 uppercase tracking-wide">
                Table 12 – Range of Marks for Absolute grading system
              </h2>
              <p className="text-xs font-semibold text-slate-600 mb-4">
                Score ranges out of 100 total marks.
              </p>

              <div className="overflow-x-auto border border-slate-200">
                <table className="w-full text-center text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#172554] text-white border-b-2 border-[#172554] text-xs font-extrabold uppercase tracking-wider divide-x divide-white">
                      {GRADE_SCALE.map((g) => (
                        <th key={g.letter} className="py-3 px-3">
                          {g.letter}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="divide-x divide-[#172554] text-xs sm:text-sm font-bold text-[#172554]">
                      {GRADE_SCALE.map((g) => {
                        const isCurrent = hasSubjectSelected && breakdown.grade.letter === g.letter;
                        return (
                          <td
                            key={g.letter}
                            className={`py-3.5 px-3 ${isCurrent ? 'bg-slate-200 font-black' : ''}`}
                          >
                            {g.rangeLabel}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
    
        {activeTab === 'gpa' && (
          gpaReady ? <GPACalculator subjects={subjects} /> : <GpaLockedNotice />
        )}
</main>


      {/* Subject Selection Modal Dialog Box */}
      <SubjectSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelectSubject={handleSelectSubjectFromDialog}
        currentSubjectName={currentSubject.name}
      />
    </div>
  );
}
