/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../axiosInstance/api';
import type { ApiResponse } from '../types/api.types';

// Public routes
export const publicHomeAPI = {
    getHomePageData: async (): Promise<ApiResponse<any>> => {
        const response = await api.get<ApiResponse<any>>('/public/home');
        console.log(response.data);
        return response.data;
    },
    
    getAllCourses: async (): Promise<ApiResponse<any>> => {
        const response = await api.get<ApiResponse<any>>('/public/home/courses');
        return response.data;
    }
};