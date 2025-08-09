import axiosInstance from "../axiosInstance/api";
import { AboutUs, CreateAboutUsDTO } from './types/adminAboutUs.types';

export const adminAboutUsAPI = {
  getAboutUs: async (): Promise<AboutUs> => {
    const response = await axiosInstance.get('/aboutus');
    return response.data;
  },

  upsertAboutUs: async (data: CreateAboutUsDTO): Promise<AboutUs> => {
    const response = await axiosInstance.post('/aboutus/', data);
    return response.data;
  },
}; 