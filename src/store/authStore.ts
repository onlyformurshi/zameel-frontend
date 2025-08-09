import { create } from 'zustand';
import { authAPI } from '../api/admin/auth';
import type { LoginCredentials, UserData } from '../api/types/auth.types';
import { AxiosError } from 'axios';

const TOKEN_EXPIRY_DAYS = 1;

interface AuthStore {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  error: string | null;
  previousPath: string;
  
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<boolean>;
  setPreviousPath: (path: string) => void;
}

const isTokenExpired = () => {
  const expiryTime = localStorage.getItem("tokenExpiry");
  if (!expiryTime) return true;
  return new Date().getTime() > parseInt(expiryTime);
};

const setTokenWithExpiry = (token: string) => {
  localStorage.setItem("token", token);
  const expiryTime = new Date().getTime() + (TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  localStorage.setItem("tokenExpiry", expiryTime.toString());
};

const setUserData = (userData: UserData) => {
  localStorage.setItem("userData", JSON.stringify(userData));
};

const getUserData = (): UserData | null => {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
};

// Initialize auth state from localStorage
const initializeAuthState = () => {
  const token = localStorage.getItem("token");
  const userData = getUserData();
  return {
    isAuthenticated: !!(token && !isTokenExpired() && userData),
    user: userData,
    loading: false,
    error: null,
    previousPath: '/'
  };
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initializeAuthState(),

  login: async (credentials) => {
    try {
      set({ error: null, loading: true });
      const response = await authAPI.login(credentials);
      
      setTokenWithExpiry(response.access_token);
      setUserData(response.admin);
      
      set({ 
        user: response.admin, 
        isAuthenticated: true,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Login error:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      set({ 
        error: axiosError.response?.data?.message || "Invalid credentials",
        loading: false,
        isAuthenticated: false,
        user: null
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear all auth-related data from localStorage
      localStorage.clear();  // This will remove all localStorage items
      
      // Reset the auth store state
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: null,
        loading: false,
        previousPath: '/'
      });
    }
  },

  checkAuthStatus: async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = getUserData();

      if (!token || isTokenExpired() || !userData) {
        set({ loading: false, isAuthenticated: false });
        return false;
      }

      set({ 
        user: userData,
        isAuthenticated: true, 
        error: null,
        loading: false
      });
      return true;
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ loading: false, isAuthenticated: false });
      return false;
    }
  },

  setPreviousPath: (path: string) => {
    if (!path.includes('/admin/login')) {
      set({ previousPath: path });
    }
  },
})); 