import api from "../axiosInstance/api";

export interface Course {
  _id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  level: string;
  arabicLevel: string;
  duration: string;
  arabicDuration: string;
  schedule: string;
  arabicSchedule: string;
  features: string[];
  category: {
    _id: string;
    name: string;
    arabicName: string;
  };
  arabicFeatures: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive: boolean;
  order: number;
  icon?: string;
}

export const publicCoursesAPI = {
  getAllCourses: async () => {
    const response = await api.get('/public/courses');
    return response.data;
  },
  getAllCourseCategories: async () => {
    const response = await api.get('/public/courses/categories');
    return response.data;
  }
}; 