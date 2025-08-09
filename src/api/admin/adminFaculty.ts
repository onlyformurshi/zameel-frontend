import axiosInstance from "../axiosInstance/api";
import { useToastStore } from '../../store/toastStore';
import { 
  AdminFacultyAPI, 
} from './types/adminFaculty.types';

export const adminFacultyAPI: AdminFacultyAPI = {
  getFaculty: async () => {
    try {
      const response = await axiosInstance.get("/faculty");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to fetch courses', 'error');
      throw error;
    }
  },

  createFaculty: async (faculty: FormData) => {
    try {
      const response = await axiosInstance.post("/faculty", faculty);
      useToastStore.getState().showToast('Faculty created successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to create faculty', 'error');
      throw error;
    }
  },

  updateFaculty: async (id: string, faculty: FormData) => {
    try {
      if (!id) throw new Error('Faculty ID is required for update');
      const response = await axiosInstance.patch(`/faculty/${id}`, faculty);
      useToastStore.getState().showToast('Faculty updated successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to update faculty', 'error');
      throw error;
    }
  },

  deleteFaculty: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/faculty/${id}`);
      useToastStore.getState().showToast('Faculty deleted successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to delete faculty', 'error');
      throw error;
    }
  }
};
