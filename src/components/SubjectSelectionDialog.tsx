import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CourseType } from '../types';

export type SemesterNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface PresetCourse {
  id: string;
  name: string;
  code: string;
  type: string;
  courseType: CourseType;
  semester: SemesterNumber;
  group?: 'core' | 'elective';
  electiveSlot?: string;
}

export const ELECTIVE_SLOTS_BY_SEMESTER: Record<number, string[]> = {
  5: ['Professional Elective I'],
  6: ['Professional Elective II', 'Professional Elective III'],
  7: ['Professional Elective IV', 'Professional Elective V', 'Professional Elective VI'],
};

const ELECTIVE_COURSE_OPTIONS: Omit<PresetCourse, 'id'>[] = [
  { name: 'Exploratory Data Analysis', code: 'DS-EDA', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Recommender Systems', code: 'DS-RS', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Data Warehousing', code: 'DS-DW', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Data Mining', code: 'DS-DM', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Business Analytics', code: 'DS-BA', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Image and Video Analytics', code: 'DS-IVA', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Natural Language Processing', code: 'DS-NLP', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Big Data Analytics', code: 'DS-BDA', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Bio Informatics', code: 'DS-BI', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },

  { name: 'Web Technologies', code: 'FSD-WT', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'App Development', code: 'FSD-AD', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Cloud Services Management', code: 'FSD-CSM', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'UI and UX Design', code: 'FSD-UIUX', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Software Testing and Automation', code: 'FSD-STA', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Web Application Security', code: 'FSD-WAS', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'DevOps', code: 'FSD-DEVOPS', type: '2-0-2', courseType: '2-0-2', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Programming Paradigms', code: 'FSD-PP', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },
  { name: 'Software Project Management', code: 'FSD-SPM', type: '3-0-0', courseType: 'theory', semester: 5, group: 'elective', electiveSlot: 'Professional Elective I' },

  { name: 'Cloud Computing', code: 'CCD-CC', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Virtualization', code: 'CCD-V', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Information Visualization', code: 'CCD-IV', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Unix Internals', code: 'CCD-UI', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Storage Technologies', code: 'CCD-ST', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Software Defined Networks', code: 'CCD-SDN', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Stream Processing', code: 'CCD-SP', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'Security and Privacy in Cloud', code: 'CCD-SPC', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },
  { name: 'GPU Computing', code: 'CCD-GPU', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective II' },

  { name: 'Ethical Hacking', code: 'CSDP-EH', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Digital and Mobile Forensics', code: 'CSDP-DMF', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Social Network Security', code: 'CSDP-SNS', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Modern Cryptography', code: 'CSDP-MC', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Engineering Secure Software Systems', code: 'CSDP-ESSS', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Cyber Security', code: 'CSDP-CS', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Network Security', code: 'CSDP-NS', type: '2-0-2', courseType: '2-0-2', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Information Security', code: 'CSDP-IS', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },
  { name: 'Mobile Networks', code: 'CSDP-MN', type: '3-0-0', courseType: 'theory', semester: 6, group: 'elective', electiveSlot: 'Professional Elective III' },

  { name: 'Distributed Systems', code: 'CM-DS', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Multimedia and Animation', code: 'CM-MA', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Video Creation and Editing', code: 'CM-VCE', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Game Theory', code: 'CM-GT', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Digital Marketing', code: 'CM-DM', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Visual Effects', code: 'CM-VE', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Game Development', code: 'CM-GD', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Graph Theory', code: 'CM-GRTH', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },
  { name: 'Image Processing', code: 'CM-IP', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective IV' },

  { name: 'Augmented Reality / Virtual Reality', code: 'ET-ARVR', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Robotic Process Automation', code: 'ET-RPA', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Healthcare Analytics', code: 'ET-HA', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Large Language Models', code: 'ET-LLM', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Quantum Computing', code: 'ET-QC', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Cryptocurrency and Blockchain Technologies', code: 'ET-CBT', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Metaverse', code: 'ET-METAVERSE', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: '3D Printing and Design', code: 'ET-3DPD', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },
  { name: 'Autonomous Vehicles', code: 'ET-AV', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective V' },

  { name: 'Knowledge Engineering', code: 'AI-KE', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Soft Computing', code: 'AI-SC', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Deep Learning', code: 'AI-DL', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Text and Speech Analysis', code: 'AI-TSA', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Optimization Techniques', code: 'AI-OT', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Social Network Analysis', code: 'AI-SNA', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Cognitive Science', code: 'AI-CS', type: '2-0-2', courseType: '2-0-2', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Responsible AI', code: 'AI-RAI', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
  { name: 'Generative AI', code: 'AI-GAI', type: '3-0-0', courseType: 'theory', semester: 7, group: 'elective', electiveSlot: 'Professional Elective VI' },
];

const ELECTIVE_OPTION_BOOK: PresetCourse[] = ELECTIVE_COURSE_OPTIONS.map((course, index) => ({
  id: `${course.semester}-${course.electiveSlot}-${index}`,
  ...course,
}));

export const PRESET_COURSES: PresetCourse[] = [
  // Semester I
  {
    id: 'EN23C03',
    name: 'Foundation English',
    code: 'EN23C03',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 1,
  },
  {
    id: 'PH23C11',
    name: 'Engineering Physics',
    code: 'PH23C11',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 1,
  },
  {
    id: 'CS23C04',
    name: 'Programming in C',
    code: 'CS23C04',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 1,
  },
  {
    id: 'CS23101',
    name: 'Computational Thinking',
    code: 'CS23101',
    type: '1-0-2',
    courseType: '1-0-2',
    semester: 1,
  },
  {
    id: 'HERITAGE_OF_TAMILS',
    name: 'Heritage of Tamils',
    code: 'UC23H01',
    type: 'Theory',
    courseType: 'theory',
    semester: 1,
  },
  {
    id: 'CALCULUS',
    name: 'Calculus',
    code: 'MA23C11',
    type: 'Theory',
    courseType: 'theory',
    semester: 1,
  },
  {
    id: 'FEEE',
    name: 'Fundamentals of Electrical and Electronics Engineering',
    code: 'EE23C02',
    type: 'Theory',
    courseType: 'theory',
    semester: 1,
  },

  // Semester II
  {
    id: 'EN23C04',
    name: 'Professional Communication',
    code: 'EN23C04',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 2,
  },
  {
    id: 'MA23C04',
    name: 'Discrete Mathematics',
    code: 'MA23C04',
    type: 'Theory',
    courseType: 'theory',
    semester: 2,
  },
  {
    id: 'CY23C10',
    name: 'Engineering Chemistry',
    code: 'CY23C10',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 2,
  },
  {
    id: 'ME23C01',
    name: 'Engineering Drawing and 3D Modeling',
    code: 'ME23C01',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 2,
  },
  {
    id: 'ME23C04',
    name: 'Makespace',
    code: 'ME23C04',
    type: '1-0-4',
    courseType: '1-0-4',
    semester: 2,
  },
  {
    id: 'UC23H02',
    name: 'Tamils and Technology',
    code: 'UC23H02',
    type: 'Theory',
    courseType: 'theory',
    semester: 2,
  },
  {
    id: 'CS23201',
    name: 'Object Oriented Programming',
    code: 'CS23201',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 2,
  },

  // Semester III
  {
    id: 'MA23C05',
    name: 'Probability and Statistics',
    code: 'MA23C05',
    type: 'Theory',
    courseType: 'theory',
    semester: 3,
  },
  {
    id: 'CS23301',
    name: 'Software Engineering',
    code: 'CS23301',
    type: 'Theory',
    courseType: 'theory',
    semester: 3,
  },
  {
    id: 'CS23U01',
    name: 'Standards - Computer Science & Engg.',
    code: 'CS23U01',
    type: 'Theory',
    courseType: 'theory',
    semester: 3,
  },
  {
    id: 'UC23U01',
    name: 'Universal Human Values',
    code: 'UC23U01',
    type: '1-0-2',
    courseType: '1-0-2',
    semester: 3,
  },
  {
    id: 'CS23302',
    name: 'Data Structures',
    code: 'CS23302',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 3,
  },
  {
    id: 'CS23303',
    name: 'Digital System Design',
    code: 'CS23303',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 3,
  },
  {
    id: 'CS23304',
    name: 'Java Programming',
    code: 'CS23304',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 3,
  },
  {
    id: 'SDC_SEM3_I',
    name: 'Skill Development Course – I',
    code: '',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 3,
    group: 'core',
  },

  // Semester IV
  {
    id: 'MA23C03',
    name: 'Linear Algebra and Numerical Methods',
    code: 'MA23C03',
    type: 'Theory',
    courseType: 'theory',
    semester: 4,
  },
  {
    id: 'CS23402',
    name: 'Computer Architecture',
    code: 'CS23402',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 4,
  },
  {
    id: 'CS23403',
    name: 'Full Stack Technologies',
    code: 'CS23403',
    type: '2-0-4',
    courseType: '2-0-4',
    semester: 4,
  },
  {
    id: 'CS23404',
    name: 'Design and Analysis of Algorithms',
    code: 'CS23404',
    type: 'Theory',
    courseType: 'theory',
    semester: 4,
  },
  {
    id: 'CS23401',
    name: 'Database Management Systems',
    code: 'CS23401',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 4,
  },
  {
    id: 'SDC_SEM4_II',
    name: 'Skill Development Course – II',
    code: '',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 4,
    group: 'core',
  },
  {
    id: 'IOC_SEM4_I',
    name: 'Industry Oriented Course I',
    code: '',
    type: 'Two Tests · 50% each',
    courseType: 'industry-oriented-tests',
    semester: 4,
    group: 'core',
  },

  // Semester V
  {
    id: 'CS23501',
    name: 'Operating Systems',
    code: 'CS23501',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CS23502',
    name: 'Networks and Data Communication',
    code: 'CS23502',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CS23503',
    name: 'Theory of Computation',
    code: 'CS23503',
    type: '3-0-0',
    courseType: 'theory',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CS23504',
    name: 'Open Elective I',
    code: 'CS23504',
    type: '3-0-0',
    courseType: 'theory',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CS23505',
    name: 'Self Learning Course',
    code: 'CS23505',
    type: '3-0-0',
    courseType: 'theory',
    semester: 5,
    group: 'core',
  },
  {
    id: 'CS23506',
    name: 'Engineering Entrepreneurship Development',
    code: 'CS23506',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 5,
    group: 'core',
  },
  {
    id: 'IOC_SEM5_II',
    name: 'Industry Oriented Course – II',
    code: '',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 5,
    group: 'core',
  },
  {
    id: 'SDC_SEM5_III',
    name: 'Skill Development Course – III',
    code: '',
    type: 'SDC · 60% CA / 40% ESE',
    courseType: 'self-development',
    semester: 5,
    group: 'core',
  },

  // Semester VI
  {
    id: 'CS23601',
    name: 'Cryptography and System Security',
    code: 'CS23601',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 6,
    group: 'core',
  },
  {
    id: 'CS23602',
    name: 'Compiler Design',
    code: 'CS23602',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 6,
    group: 'core',
  },
  {
    id: 'CS23603',
    name: 'Machine Learning',
    code: 'CS23603',
    type: '3-0-4',
    courseType: '3-0-4',
    semester: 6,
    group: 'core',
  },
  {
    id: 'CS23604',
    name: 'Open Elective II',
    code: 'CS23604',
    type: '3-0-0',
    courseType: 'theory',
    semester: 6,
    group: 'core',
  },
  {
    id: 'CS23605',
    name: 'Perspectives of Sustainable Development',
    code: 'CS23605',
    type: '2-0-2',
    courseType: '2-0-2',
    semester: 6,
    group: 'core',
  },

  // Semester VII
  {
    id: 'CS23701',
    name: 'Emerging Technology Course I',
    code: 'CS23701',
    type: '3-0-2',
    courseType: '3-0-2',
    semester: 7,
    group: 'core',
  },
  {
    id: 'CS23702',
    name: 'Emerging Technology Course II',
    code: 'CS23702',
    type: '3-0-0',
    courseType: 'theory',
    semester: 7,
    group: 'core',
  },

  // Semester VIII
  {
    id: 'CS23801',
    name: 'Internship cum Project Work',
    code: 'CS23801',
    type: '60% CA / 40% ESE',
    courseType: 'project',
    semester: 8,
    group: 'core',
  },
  {
    id: 'CS23801-PW',
    name: 'Project Work',
    code: 'CS23801-PW',
    type: 'Table 6 · 60% CA / 40% ESE',
    courseType: 'project-work',
    semester: 8,
    group: 'core',
  },

  ...ELECTIVE_OPTION_BOOK,
];

interface SubjectSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (course: PresetCourse) => void;
  currentSubjectName: string;
  initialSemester?: SemesterNumber | null;
  initialGroup?: 'core' | 'elective';
  initialElectiveSlot?: string | null;
}

export const SubjectSelectionDialog: React.FC<SubjectSelectionDialogProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  currentSubjectName,
  initialSemester,
  initialGroup,
  initialElectiveSlot,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<SemesterNumber>(1);
  const [selectedCourse, setSelectedCourse] = useState<PresetCourse>(PRESET_COURSES[0]);
  const [selectedCourseGroup, setSelectedCourseGroup] = useState<'core' | 'elective'>('core');
  const [selectedElectiveSlot, setSelectedElectiveSlot] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const found = currentSubjectName
      ? PRESET_COURSES.find((c) => c.name.toLowerCase() === currentSubjectName.toLowerCase())
      : null;

    if (found) {
      setSelectedSemester(found.semester);
      setSelectedCourse(found);
      setSelectedCourseGroup(found.group === 'elective' ? 'elective' : 'core');
      setSelectedElectiveSlot(found.electiveSlot ?? null);
      return;
    }

    const semester = initialSemester ?? selectedSemester;
    const group = initialGroup ?? 'core';
    const slot = initialElectiveSlot ?? ELECTIVE_SLOTS_BY_SEMESTER[semester]?.[0] ?? null;
    const fallback = PRESET_COURSES.find((course) =>
      course.semester === semester && (group === 'elective'
        ? course.group === 'elective' && course.electiveSlot === slot
        : course.group !== 'elective')
    ) ?? PRESET_COURSES.find((course) => course.semester === semester) ?? PRESET_COURSES[0];
    setSelectedSemester(fallback.semester);
    setSelectedCourse(fallback);
    setSelectedCourseGroup(fallback.group === 'elective' ? 'elective' : 'core');
    setSelectedElectiveSlot(fallback.electiveSlot ?? slot);
  }, [isOpen, currentSubjectName, initialSemester, initialGroup, initialElectiveSlot]);

  const electiveSlots = ELECTIVE_SLOTS_BY_SEMESTER[selectedSemester] ?? [];
  const filteredCourses = PRESET_COURSES.filter((course) => {
    if (course.semester !== selectedSemester) return false;
    if (selectedCourseGroup === 'core') return course.group !== 'elective';
    return course.group === 'elective' && course.electiveSlot === selectedElectiveSlot;
  });

  const handleSemesterChange = (nextSemester: SemesterNumber) => {
    setSelectedSemester(nextSemester);
    const nextSlots = ELECTIVE_SLOTS_BY_SEMESTER[nextSemester] ?? [];
    const nextDefaultSlot = nextSlots[0] ?? null;
    const nextDefaultCourse = PRESET_COURSES.find(
      (course) => course.semester === nextSemester && course.group !== 'elective'
    ) ?? PRESET_COURSES.find((course) => course.semester === nextSemester) ?? PRESET_COURSES[0];
    setSelectedCourse(nextDefaultCourse);
    setSelectedCourseGroup(nextDefaultCourse.group === 'elective' ? 'elective' : 'core');
    setSelectedElectiveSlot(nextDefaultSlot);
  };

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectCourse(selectedCourse);
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

        {/* Dialog Body - Semester selector and course list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => {
              const isSelected = selectedSemester === semester;
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
                  Semester {semester}
                </button>
              );
            })}
          </div>

          {electiveSlots.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCourseGroup('core')}
                  className={`px-3 py-2 text-[11px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                    selectedCourseGroup === 'core'
                      ? 'bg-[#172554] text-white border-[#172554]'
                      : 'bg-white text-[#172554] border-slate-300 hover:border-[#172554] hover:bg-slate-50'
                  }`}
                >
                  Core Courses
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourseGroup('elective');
                    setSelectedElectiveSlot((current) => current ?? electiveSlots[0]);
                  }}
                  className={`px-3 py-2 text-[11px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                    selectedCourseGroup === 'elective'
                      ? 'bg-[#172554] text-white border-[#172554]'
                      : 'bg-white text-[#172554] border-slate-300 hover:border-[#172554] hover:bg-slate-50'
                  }`}
                >
                  Electives
                </button>
              </div>

              {selectedCourseGroup === 'elective' && (
                <div className="flex flex-wrap gap-2">
                  {electiveSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedElectiveSlot(slot);
                        const firstOption = PRESET_COURSES.find(
                          (course) => course.semester === selectedSemester && course.group === 'elective' && course.electiveSlot === slot
                        );
                        if (firstOption) {
                          setSelectedCourse(firstOption);
                        }
                      }}
                      className={`px-3 py-2 text-[11px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
                        selectedElectiveSlot === slot
                          ? 'bg-blue-100 text-[#172554] border-[#172554]'
                          : 'bg-white text-[#172554] border-slate-300 hover:border-[#172554] hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            {filteredCourses.map((course) => {
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
