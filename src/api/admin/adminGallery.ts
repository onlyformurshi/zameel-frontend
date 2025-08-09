import axiosInstance from "../axiosInstance/api";
import { useToastStore } from "../../store/toastStore";
import { AdminGalleryAPI } from "./types/adminGallery.types";

export const adminGalleryAPI: AdminGalleryAPI = {
  getGallery: async () => {
    try {
      const response = await axiosInstance.get("/gallery");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to fetch gallery", "error");
      throw error;
    }
  },

  createGallery: async (formData: FormData) => {
    try {
      const response = await axiosInstance.post("/gallery", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      useToastStore.getState().showToast("Gallery item created successfully", "success");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to create gallery item", "error");
      throw error;
    }
  },

  updateGallery: async (id: string, formData: FormData) => {
    try {
      if (!id) throw new Error("Gallery ID is required for update");
      const response = await axiosInstance.patch(`/gallery/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      useToastStore.getState().showToast("Gallery item updated successfully", "success");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to update gallery item", "error");
      throw error;
    }
  },

  deleteGallery: async (id: string) => {
    try {
      if (!id) throw new Error("Gallery ID is required for delete");
      await axiosInstance.delete(`/gallery/${id}`);
      useToastStore.getState().showToast("Gallery item deleted successfully", "success");
    } catch (error) {
      useToastStore.getState().showToast("Failed to delete gallery item", "error");
      throw error;
    }
  },

  createGalleryCategory: async (formData: { name: string; arabicName: string }) => {
    try {
      const response = await axiosInstance.post("/gallery/category", formData);
      useToastStore.getState().showToast("Gallery category created successfully", "success");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to create gallery category", "error");
      throw error;
    }
  },

  getGalleryCategories: async () => {
    try {
      const response = await axiosInstance.get("/gallery/category");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to fetch gallery categories", "error");
      throw error;
    }
  },

  updateGalleryCategory: async (id: string, formData: { name: string; arabicName: string }) => {
    try {
      const response = await axiosInstance.patch(`/gallery/category/${id}`, formData);
      useToastStore.getState().showToast("Gallery category updated successfully", "success");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to update gallery category", "error");
      throw error;
    }
  },

  deleteGalleryCategory: async (id: string) => {
    try {
      await axiosInstance.delete(`/gallery/category/${id}`);
      useToastStore.getState().showToast("Gallery category deleted successfully", "success");
    } catch (error) {
      useToastStore.getState().showToast("Failed to delete gallery category", "error");
      throw error;
    }
  },
}; 