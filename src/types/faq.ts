export interface FAQ {
  id: number;
  question: string;
  arabicQuestion: string;
  answer: string;
  arabicAnswer: string;
  category: 'General' | 'Courses' | 'Admissions' | 'Facilities';
  arabicCategory: 'القبول' | 'عام' | 'الدورات' | 'المرافق';
} 