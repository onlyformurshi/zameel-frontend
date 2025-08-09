import axiosInstance from "../axiosInstance/api";
import { useToastStore } from '../../store/toastStore';
import { 
  AdminCourseAPI, 
} from './types/adminCourse.types';

export const adminCourseAPI: AdminCourseAPI = {
  getCourses: async () => {
    try {
      const response = await axiosInstance.get("/courses");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to fetch courses', 'error');
      throw error;
    }
  },

  createCourse: async (course: FormData) => {
    try {
      const response = await axiosInstance.post("/courses", course);
      useToastStore.getState().showToast('Course created successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to create course', 'error');
      throw error;
    }
  },

  updateCourse: async (id: string, course: FormData) => {
    try {
      if (!id) throw new Error('Course ID is required for update');
      const response = await axiosInstance.patch(`/courses/${id}`, course);
      useToastStore.getState().showToast('Course updated successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to update course', 'error');
      throw error;
    }
  },

  deleteCourse: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/courses/${id}`);
      useToastStore.getState().showToast('Course deleted successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to delete course', 'error');
      throw error;
    }
  },

  getCourseCategories: async () => {
    try {
      const response = await axiosInstance.get("/courses/course-categories");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to fetch course categories', 'error');
      throw error;
    }
  },

  createCourseCategory: async (category: FormData) => {
    try {
      const response = await axiosInstance.post("/courses/course-categories", category);
      useToastStore.getState().showToast('Course category created successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to create course category', 'error');
      throw error;
    }
  },

  updateCourseCategory: async (id: string, category: FormData) => {
    try {
      const response = await axiosInstance.patch(`/courses/course-categories/${id}`, category);
      useToastStore.getState().showToast('Course category updated successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to update course category', 'error');
      throw error;
    }
  },

  deleteCourseCategory: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/courses/course-categories/${id}`);
      useToastStore.getState().showToast('Course category deleted successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to delete course category', 'error');
      throw error;
    }
  }
};
