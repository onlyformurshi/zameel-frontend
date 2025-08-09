import axiosInstance from "../axiosInstance/api";
import {
  AdminHomeAPI,
  CreateHeroSectionDto,
  UpdateHeroSectionDto,
  CreateWhyChooseUsDto,
  UpdateWhyChooseUsDto
} from './types/adminHome.types';
import { useToastStore } from '../../store/toastStore';

export const adminHomeAPI: AdminHomeAPI = {
  getHomePageData: async () => {
    try {
      const response = await axiosInstance.get("/admin/home");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to fetch home page data', 'error');
      throw error;
    }
  },

  createHeroSection: async (heroSection: CreateHeroSectionDto) => {
    try {
      const response = await axiosInstance.post(
        "/admin/hero-section",
        heroSection
      );
      useToastStore.getState().showToast('Hero section created successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to create hero section', 'error');
      throw error;
    }
  },

  updateHeroSection: async (id: string, heroSection: UpdateHeroSectionDto) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/hero-section/${id}`,
        heroSection
      );
      useToastStore.getState().showToast('Hero section updated successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to update hero section', 'error');
      throw error;
    }
  },

  deleteHeroSection: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/admin/hero-section/${id}`);
      useToastStore.getState().showToast('Hero section deleted successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to delete hero section', 'error');
      throw error;
    }
  },

  createWhyChooseUs: async (whyChooseUs: CreateWhyChooseUsDto) => {
    try {
      const response = await axiosInstance.post(
        "/admin/why-choose-us",
        whyChooseUs
      );
      useToastStore.getState().showToast('Card created successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to create card', 'error');
      throw error;
    }
  },

  updateWhyChooseUs: async (id: string, whyChooseUs: UpdateWhyChooseUsDto) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/why-choose-us/${id}`,
        whyChooseUs
      );
      useToastStore.getState().showToast('Card updated successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to update card', 'error');
      throw error;
    }
  },

  deleteWhyChooseUs: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/admin/why-choose-us/${id}`);
      useToastStore.getState().showToast('Card deleted successfully', 'success');
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast('Failed to delete card', 'error');
      throw error;
    }
  },
};
