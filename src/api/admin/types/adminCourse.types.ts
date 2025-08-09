export interface Course {
  _id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  features: string[];
  arabicFeatures: string[];
  duration: string;
  arabicDuration: string;
  schedule: string;
  arabicSchedule: string;
  level: string;
  arabicLevel: string;
  category?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CourseCategory {
  _id: string;
  name: string;
  arabicName: string;
}

export type CreateCourseDto = Omit<Course, '_id' | 'createdAt' | 'updatedAt' | '__v'>;
export type UpdateCourseDto = Partial<CreateCourseDto>;

export interface AdminCourseAPI {
  getCourses: () => Promise<Course[]>;
  getCourseCategories: () => Promise<CourseCategory[]>;
  createCourse: (course: FormData) => Promise<Course>;
  updateCourse: (id: string, course: FormData) => Promise<Course>;
  deleteCourse: (id: string) => Promise<void>;
  createCourseCategory: (category: FormData) => Promise<CourseCategory>;
  updateCourseCategory: (id: string, category: FormData) => Promise<CourseCategory>;
  deleteCourseCategory: (id: string) => Promise<void>;
} 