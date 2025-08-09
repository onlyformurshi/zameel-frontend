import { create } from 'zustand';

interface ToastStore {
  message: string | null;
  type: 'success' | 'error' | 'info';
  timeoutId: ReturnType<typeof setTimeout> | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  clearTimeout: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  message: null,
  type: 'info',
  timeoutId: null,

  showToast: (message, type) => {
    const { clearTimeout } = get();
    // Clear any existing timeout
    clearTimeout();
    
    // Set new timeout
    const timeoutId = setTimeout(() => {
      get().hideToast();
    }, 3000);

    set({ 
      message, 
      type,
      timeoutId 
    });
  },

  hideToast: () => {
    const { clearTimeout } = get();
    clearTimeout();
    set({ 
      message: null, 
      type: 'info',
      timeoutId: null 
    });
  },

  clearTimeout: () => {
    const { timeoutId } = get();
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    set({ timeoutId: null });
  }
})); 