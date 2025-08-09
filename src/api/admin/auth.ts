import axiosInstance from '../axiosInstance/api';
import type { LoginCredentials, AuthResponse } from '../types/auth.types';

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  logout: () => 
    axiosInstance.post('/auth/logout'),
}; 