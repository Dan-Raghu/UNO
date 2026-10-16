import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CourseType } from '../types';

export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type SelectionMode = 'semester' | 'elective';

export interface PresetCourse {
  id: string;
  name: string;
  code: string;
  type: string;
  courseType: CourseType;
  semester: SemesterNumber;
  category?: 'core' | 'elective';
  electiveSlot?: 1 | 2 | 3 | 4 | 5 | 6;
}

const electiveSlotLabels: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: 'Professional Elective I',
  2: 'Professional Elective II',
  3: 'Professional Elective III',
  4: 'Professional Elective IV',
  5: 'Professional Elective V',
  6: 'Professional Elective VI',
};

const ELECTIVE_COURSES: PresetCourse[] = [
  { id: 'PEA-01', name: 'Exploratory Data Analysis', code: 'PEA-01', type: '2-0-2', courseType: '2-0-2', semester: 5, category: 'elective', electiveSlot: 1 },
  { id: 'PEA-02', name: 'Recommender Systems', code: 'PEA-02', type: '2-0-2', courseType: '2-0-2', semester: 5, category: 'elective', electiveSlot: 1 },
  { id: 'PEA-03', name: 'Data Warehousing', code: 'PEA-03', type: 'Theory', courseType: 'theory', semester: 5, category: 'elective', electiveSlot: 1 },
  { id: 'PEA-04', name: 'Data Mining', code: 'PEA-04', type: 'Theory', courseType: 'theory', semester: 5, category: 'elective', electiveSlot: 1 },
  { id: 'PEA-05', name: 'Business Analytics', code: 'PEA-05', type: '2-0-2', courseType: '2-0-2', semester: 5, category: 'elective', electiveSlot: 1 },
  { id: 'PEA-06', name: 'Image and Video Analytics', code: 'PEA-06', type: '2-0-2', courseType: '2-0-2', semester: 5, category: 'elective', electiveSlot: 1 },
  { id: 'PEA-07', name: 'Natural Language Processing', code: 'PEA-07', type: 'Theory', courseType: 'theory', semester: 5, category: 'elective', electiveSlot: 1 },
  { id: 'PEA-08', name: 'Big Data Analytics', code: 'PEA-08', type: '2-0-2', courseType: '2-0-2', semester: 5, category: 'elective', electiveSlot: 1 },
  { id: 'PEA-09', name: 'Bio Informatics', code: 'PEA-09', type: 'Theory', courseType: 'theory', semester: 5, category: 'elective', electiveSlot: 1 },

  { id: 'PEB-01', name: 'Web Technologies', code: 'PEB-01', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 2 },
  { id: 'PEB-02', name: 'App Development', code: 'PEB-02', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 2 },
  { id: 'PEB-03', name: 'Cloud Services Management', code: 'PEB-03', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 2 },
  { id: 'PEB-04', name: 'UI and UX Design', code: 'PEB-04', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 2 },
  { id: 'PEB-05', name: 'Software Testing and Automation', code: 'PEB-05', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 2 },
  { id: 'PEB-06', name: 'Web Application Security', code: 'PEB-06', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 2 },
  { id: 'PEB-07', name: 'DevOps', code: 'PEB-07', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 2 },
  { id: 'PEB-08', name: 'Programming Paradigms', code: 'PEB-08', type: 'Theory', courseType: 'theory', semester: 6, category: 'elective', electiveSlot: 2 },
  { id: 'PEB-09', name: 'Software Project Management', code: 'PEB-09', type: 'Theory', courseType: 'theory', semester: 6, category: 'elective', electiveSlot: 2 },

  { id: 'PEC-01', name: 'Cloud Computing', code: 'PEC-01', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 3 },
  { id: 'PEC-02', name: 'Virtualization', code: 'PEC-02', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 3 },
  { id: 'PEC-03', name: 'Information Visualization', code: 'PEC-03', type: 'Theory', courseType: 'theory', semester: 6, category: 'elective', electiveSlot: 3 },
  { id: 'PEC-04', name: 'Unix Internals', code: 'PEC-04', type: 'Theory', courseType: 'theory', semester: 6, category: 'elective', electiveSlot: 3 },
  { id: 'PEC-05', name: 'Storage Technologies', code: 'PEC-05', type: 'Theory', courseType: 'theory', semester: 6, category: 'elective', electiveSlot: 3 },
  { id: 'PEC-06', name: 'Software Defined Networks', code: 'PEC-06', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 3 },
  { id: 'PEC-07', name: 'Stream Processing', code: 'PEC-07', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 3 },
  { id: 'PEC-08', name: 'Security and Privacy in Cloud', code: 'PEC-08', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'elective', electiveSlot: 3 },
  { id: 'PEC-09', name: 'GPU Computing', code: 'PEC-09', type: 'Theory', courseType: 'theory', semester: 6, category: 'elective', electiveSlot: 3 },

  { id: 'PED-01', name: 'Ethical Hacking', code: 'PED-01', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 4 },
  { id: 'PED-02', name: 'Digital and Mobile Forensics', code: 'PED-02', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 4 },
  { id: 'PED-03', name: 'Social Network Security', code: 'PED-03', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 4 },
  { id: 'PED-04', name: 'Modern Cryptography', code: 'PED-04', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 4 },
  { id: 'PED-05', name: 'Engineering Secure Software Systems', code: 'PED-05', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 4 },
  { id: 'PED-06', name: 'Cyber Security', code: 'PED-06', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 4 },
  { id: 'PED-07', name: 'Network Security', code: 'PED-07', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 4 },
  { id: 'PED-08', name: 'Information Security', code: 'PED-08', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 4 },
  { id: 'PED-09', name: 'Mobile Networks', code: 'PED-09', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 4 },

  { id: 'PEE-01', name: 'Distributed Systems', code: 'PEE-01', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 5 },
  { id: 'PEE-02', name: 'Multimedia and Animation', code: 'PEE-02', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 5 },
  { id: 'PEE-03', name: 'Video Creation and Editing', code: 'PEE-03', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 5 },
  { id: 'PEE-04', name: 'Game Theory', code: 'PEE-04', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 5 },
  { id: 'PEE-05', name: 'Digital Marketing', code: 'PEE-05', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 5 },
  { id: 'PEE-06', name: 'Visual Effects', code: 'PEE-06', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 5 },
  { id: 'PEE-07', name: 'Game Development', code: 'PEE-07', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 5 },
  { id: 'PEE-08', name: 'Graph Theory', code: 'PEE-08', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 5 },
  { id: 'PEE-09', name: 'Image Processing', code: 'PEE-09', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 5 },

  { id: 'PEF-01', name: 'Augmented Reality / Virtual Reality', code: 'PEF-01', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEF-02', name: 'Robotic Process Automation', code: 'PEF-02', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEF-03', name: 'Healthcare Analytics', code: 'PEF-03', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEF-04', name: 'Large Language Models', code: 'PEF-04', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEF-05', name: 'Quantum Computing', code: 'PEF-05', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEF-06', name: 'Cryptocurrency and Blockchain Technologies', code: 'PEF-06', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEF-07', name: 'Metaverse', code: 'PEF-07', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEF-08', name: '3D Printing and Design', code: 'PEF-08', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEF-09', name: 'Autonomous Vehicles', code: 'PEF-09', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 6 },

  { id: 'PEG-01', name: 'Knowledge Engineering', code: 'PEG-01', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEG-02', name: 'Soft Computing', code: 'PEG-02', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEG-03', name: 'Deep Learning', code: 'PEG-03', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEG-04', name: 'Text and Speech Analysis', code: 'PEG-04', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEG-05', name: 'Optimization Techniques', code: 'PEG-05', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEG-06', name: 'Social Network Analysis', code: 'PEG-06', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEG-07', name: 'Cognitive Science', code: 'PEG-07', type: '2-0-2', courseType: '2-0-2', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEG-08', name: 'Responsible AI', code: 'PEG-08', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 6 },
  { id: 'PEG-09', name: 'Generative AI', code: 'PEG-09', type: 'Theory', courseType: 'theory', semester: 7, category: 'elective', electiveSlot: 6 },
];

export const PRESET_COURSES: PresetCourse[] = [
  // Semester I
  { id: 'EN23C03', name: 'Foundation English', code: 'EN23C03', type: '2-0-2', courseType: '2-0-2', semester: 1, category: 'core' },
  { id: 'PH23C11', name: 'Engineering Physics', code: 'PH23C11', type: '3-0-2', courseType: '3-0-2', semester: 1, category: 'core' },
  { id: 'CS23C04', name: 'Programming in C', code: 'CS23C04', type: '2-0-4', courseType: '2-0-4', semester: 1, category: 'core' },
  { id: 'CS23101', name: 'Computational Thinking', code: 'CS23101', type: '1-0-2', courseType: '1-0-2', semester: 1, category: 'core' },
  { id: 'HERITAGE_OF_TAMILS', name: 'Heritage of Tamils', code: 'UC23H01', type: 'Theory', courseType: 'theory', semester: 1, category: 'core' },
  { id: 'CALCULUS', name: 'Calculus', code: 'MA23C11', type: 'Theory', courseType: 'theory', semester: 1, category: 'core' },
  { id: 'FEEE', name: 'Fundamentals of Electrical and Electronics Engineering', code: 'EE23C02', type: 'Theory', courseType: 'theory', semester: 1, category: 'core' },

  // Semester II
  { id: 'EN23C04', name: 'Professional Communication', code: 'EN23C04', type: '2-0-2', courseType: '2-0-2', semester: 2, category: 'core' },
  { id: 'MA23C04', name: 'Discrete Mathematics', code: 'MA23C04', type: 'Theory', courseType: 'theory', semester: 2, category: 'core' },
  { id: 'CY23C10', name: 'Engineering Chemistry', code: 'CY23C10', type: '3-0-2', courseType: '3-0-2', semester: 2, category: 'core' },
  { id: 'ME23C01', name: 'Engineering Drawing and 3D Modeling', code: 'ME23C01', type: '2-0-4', courseType: '2-0-4', semester: 2, category: 'core' },
  { id: 'ME23C04', name: 'Makespace', code: 'ME23C04', type: '1-0-4', courseType: '1-0-4', semester: 2, category: 'core' },
  { id: 'UC23H02', name: 'Tamils and Technology', code: 'UC23H02', type: 'Theory', courseType: 'theory', semester: 2, category: 'core' },
  { id: 'CS23201', name: 'Object Oriented Programming', code: 'CS23201', type: '2-0-2', courseType: '2-0-2', semester: 2, category: 'core' },

  // Semester III
  { id: 'MA23C05', name: 'Probability and Statistics', code: 'MA23C05', type: 'Theory', courseType: 'theory', semester: 3, category: 'core' },
  { id: 'CS23301', name: 'Software Engineering', code: 'CS23301', type: 'Theory', courseType: 'theory', semester: 3, category: 'core' },
  { id: 'CS23U01', name: 'Standards - Computer Science & Engg.', code: 'CS23U01', type: 'Theory', courseType: 'theory', semester: 3, category: 'core' },
  { id: 'UC23U01', name: 'Universal Human Values', code: 'UC23U01', type: '1-0-2', courseType: '1-0-2', semester: 3, category: 'core' },
  { id: 'CS23302', name: 'Data Structures', code: 'CS23302', type: '3-0-4', courseType: '3-0-4', semester: 3, category: 'core' },
  { id: 'CS23303', name: 'Digital System Design', code: 'CS23303', type: '3-0-4', courseType: '3-0-4', semester: 3, category: 'core' },
  { id: 'CS23304', name: 'Java Programming', code: 'CS23304', type: '3-0-4', courseType: '3-0-4', semester: 3, category: 'core' },

  // Semester IV
  { id: 'MA23C03', name: 'Linear Algebra and Numerical Methods', code: 'MA23C03', type: 'Theory', courseType: 'theory', semester: 4, category: 'core' },
  { id: 'CS23402', name: 'Computer Architecture', code: 'CS23402', type: '3-0-2', courseType: '3-0-2', semester: 4, category: 'core' },
  { id: 'CS23403', name: 'Full Stack Technologies', code: 'CS23403', type: '2-0-4', courseType: '2-0-4', semester: 4, category: 'core' },
  { id: 'CS23404', name: 'Design and Analysis of Algorithms', code: 'CS23404', type: 'Theory', courseType: 'theory', semester: 4, category: 'core' },
  { id: 'CS23401', name: 'Database Management Systems', code: 'CS23401', type: '3-0-4', courseType: '3-0-4', semester: 4, category: 'core' },

  // Semester V
  { id: 'CS23501', name: 'Operating Systems', code: 'CS23501', type: '3-0-4', courseType: '3-0-4', semester: 5, category: 'core' },
  { id: 'CS23502', name: 'Networks and Data Communication', code: 'CS23502', type: '3-0-4', courseType: '3-0-4', semester: 5, category: 'core' },
  { id: 'CS23503', name: 'Theory of Computation', code: 'CS23503', type: 'Theory', courseType: 'theory', semester: 5, category: 'core' },
  { id: 'CS23504', name: 'Open Elective I', code: 'CS23504', type: 'Theory', courseType: 'theory', semester: 5, category: 'core' },
  { id: 'CS23505', name: 'Self Learning Course', code: 'CS23505', type: 'Theory', courseType: 'theory', semester: 5, category: 'core' },
  { id: 'CS23506', name: 'Engineering Entrepreneurship Development', code: 'CS23506', type: '2-0-2', courseType: '2-0-2', semester: 5, category: 'core' },

  // Semester VI
  { id: 'CS23601', name: 'Cryptography and System Security', code: 'CS23601', type: '3-0-4', courseType: '3-0-4', semester: 6, category: 'core' },
  { id: 'CS23602', name: 'Compiler Design', code: 'CS23602', type: '3-0-4', courseType: '3-0-4', semester: 6, category: 'core' },
  { id: 'CS23603', name: 'Machine Learning', code: 'CS23603', type: '3-0-4', courseType: '3-0-4', semester: 6, category: 'core' },
  { id: 'CS23604', name: 'Open Elective II', code: 'CS23604', type: 'Theory', courseType: 'theory', semester: 6, category: 'core' },
  { id: 'CS23605', name: 'Perspectives of Sustainable Development', code: 'CS23605', type: '2-0-2', courseType: '2-0-2', semester: 6, category: 'core' },
  { id: 'CS23606', name: 'Creative and Innovative Project', code: 'CS23606', type: 'Project', courseType: 'theory', semester: 6, category: 'core' },

  // Semester VII
  { id: 'CS23701', name: 'Emerging Technology Course I', code: 'CS23701', type: '3-0-2', courseType: '3-0-2', semester: 7, category: 'core' },
  { id: 'CS23702', name: 'Emerging Technology Course II', code: 'CS23702', type: 'Theory', courseType: 'theory', semester: 7, category: 'core' },
  { id: 'CS23703', name: 'Industry Oriented Course III', code: 'CS23703', type: 'Industry', courseType: 'theory', semester: 7, category: 'core' },

  // Semester VIII
  { id: 'CS23801', name: 'Project Work / Internship cum Project Work', code: 'CS23801', type: '0-0-16', courseType: 'theory', semester: 8, category: 'core' },
  ...ELECTIVE_COURSES,
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
  const [selectedSemester, setSelectedSemester] = useState<SemesterNumber>(1);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('semester');
  const [selectedElectiveSlot, setSelectedElectiveSlot] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedCourse, setSelectedCourse] = useState<PresetCourse>(PRESET_COURSES[0]);

  useEffect(() => {
    if (!isOpen) return;

    const found = currentSubjectName
      ? PRESET_COURSES.find((c) => c.name.toLowerCase() === currentSubjectName.toLowerCase())
      : null;

    if (found) {
      setSelectedSemester(found.semester);
      setSelectedCourse(found);
      setSelectionMode(found.category === 'elective' ? 'elective' : 'semester');
      if (found.electiveSlot) {
        setSelectedElectiveSlot(found.electiveSlot);
      }
      return;
    }

    const sourceCourses = selectionMode === 'elective'
      ? ELECTIVE_COURSES.filter((course) => course.electiveSlot === selectedElectiveSlot)
      : PRESET_COURSES.filter((course) => course.semester === selectedSemester && course.category !== 'elective');

    const fallback = sourceCourses[0] ?? PRESET_COURSES[0];
    setSelectedSemester(fallback.semester);
    setSelectedCourse(fallback);
    if (fallback.electiveSlot) {
      setSelectedElectiveSlot(fallback.electiveSlot);
    }
  }, [isOpen, currentSubjectName, selectedSemester, selectedElectiveSlot, selectionMode]);

  const semesterCourses = PRESET_COURSES.filter(
    (course) => course.semester === selectedSemester && course.category !== 'elective'
  );
  const electiveCourses = ELECTIVE_COURSES.filter((course) => course.electiveSlot === selectedElectiveSlot);
  const visibleCourses = selectionMode === 'elective' ? electiveCourses : semesterCourses;

  const handleSemesterChange = (nextSemester: SemesterNumber) => {
    setSelectedSemester(nextSemester);
    setSelectionMode('semester');
    const firstCourse = PRESET_COURSES.find(
      (course) => course.semester === nextSemester && course.category !== 'elective'
    ) ?? PRESET_COURSES[0];
    setSelectedCourse(firstCourse);
  };

  const handleElectiveSlotChange = (slot: 1 | 2 | 3 | 4 | 5 | 6) => {
    setSelectedElectiveSlot(slot);
    setSelectionMode('elective');
    const firstCourse = ELECTIVE_COURSES.find((course) => course.electiveSlot === slot) ?? ELECTIVE_COURSES[0];
    setSelectedCourse(firstCourse);
  };

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

        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => {
              const isSelected = selectedSemester === semester && selectionMode === 'semester';
              return (
                <button
                  key={semester}
                  type="button"
                  onClick={() => handleSemesterChange(semester as SemesterNumber)}
                  className={`px-3 py-2 text-xs font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#172554] text-white border-[#172554]'
                      : 'bg-white text-[#172554] border-slate-300 hover:border-[#172554] hover:bg-slate-50'
                  }`}
                >
                  Sem {semester}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {([1, 2, 3, 4, 5, 6] as const).map((slot) => {
              const isSelected = selectionMode === 'elective' && selectedElectiveSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleElectiveSlotChange(slot)}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#172554] text-white border-[#172554]'
                      : 'bg-white text-[#172554] border-slate-300 hover:border-[#172554] hover:bg-slate-50'
                  }`}
                >
                  {electiveSlotLabels[slot]}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {visibleCourses.map((course) => {
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
                    <span className="text-sm sm:text-base font-black text-[#172554]">{course.name}</span>
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
        </div>

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
