import axiosInstance from "../axiosInstance/api";
import { useToastStore } from '../../store/toastStore';

export interface DashboardStats {
  
  overview: {
    galleryCount: number,
    upcomingEvents: number,
    activeCourses: number,
    facultyCount: number,
  };
}

export const adminDashboardAPI = {
  getAllStats: async (): Promise<DashboardStats> => {
    try {
      const response = await axiosInstance.get("/dashboard");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to fetch dashboard statistics', 'error');
      throw error;
    }
  },

  getOverviewStats: async () => {
    try {
      const response = await axiosInstance.get("/dashboard/overview");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to fetch overview statistics', 'error');
      throw error;
    }
  },

  getRecentActivity: async (limit?: number) => {
    try {
      const response = await axiosInstance.get("/dashboard/activity", {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to fetch recent activity', 'error');
      throw error;
    }
  },

  getContactStats: async () => {
    try {
      const response = await axiosInstance.get("/dashboard/contact");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to fetch contact statistics', 'error');
      throw error;
    }
  }
}; 