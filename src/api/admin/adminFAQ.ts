import axiosInstance from "../axiosInstance/api";
import { useToastStore } from "../../store/toastStore";
import { AdminFAQAPI, CreateFAQDto, FAQ, FAQCategory, UpdateFAQDto } from "./types/adminFAQ.types";

export const adminFAQAPI: AdminFAQAPI = {
  getFAQs: async () => {
    try {
      const response = await axiosInstance.get<FAQ[]>("/faq");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to fetch FAQs", "error");
      throw error;
    }
  },

  getFAQCategories: async () => {
    try {
      const response = await axiosInstance.get<FAQCategory[]>("/faq/categories");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to fetch FAQ categories", "error");
      throw error;
    }
  },

  createFAQ: async (data: CreateFAQDto) => {
    try {
      const response = await axiosInstance.post<FAQ>("/faq", data);
      useToastStore.getState().showToast("FAQ created successfully", "success");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to create FAQ", "error");
      throw error;
    }
  },

  updateFAQ: async (id: string, data: UpdateFAQDto) => {
    try {
      if (!id) throw new Error("FAQ ID is required for update");
      const response = await axiosInstance.patch<FAQ>(`/faq/${id}`, data);
      useToastStore.getState().showToast("FAQ updated successfully", "success");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to update FAQ", "error");
      throw error;
    }
  },

  deleteFAQ: async (id: string) => {
    try {
      if (!id) throw new Error("FAQ ID is required for delete");
      await axiosInstance.delete(`/faq/${id}`);
      useToastStore.getState().showToast("FAQ deleted successfully", "success");
    } catch (error) {
      useToastStore.getState().showToast("Failed to delete FAQ", "error");
      throw error;
    }
  },

  createFAQCategory: async (data: Omit<FAQCategory, '_id'>) => {
    try {
      const response = await axiosInstance.post<FAQCategory>("/faq/categories", data);
      useToastStore.getState().showToast("FAQ category created successfully", "success");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to create FAQ category", "error");
      throw error;
    }
  },

  updateFAQCategory: async (id: string, data: Partial<Omit<FAQCategory, '_id'>>) => {
    try {
      if (!id) throw new Error("Category ID is required for update");
      const response = await axiosInstance.patch<FAQCategory>(`/faq/categories/${id}`, data);
      useToastStore.getState().showToast("FAQ category updated successfully", "success");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to update FAQ category", "error");
      throw error;
    }
  },

  deleteFAQCategory: async (id: string) => {
    try {
      if (!id) throw new Error("Category ID is required for delete");
      await axiosInstance.delete(`/faq/categories/${id}`);
      useToastStore.getState().showToast("FAQ category deleted successfully", "success");
    } catch (error) {
      useToastStore.getState().showToast("Failed to delete FAQ category", "error");
      throw error;
    }
  }
}; 