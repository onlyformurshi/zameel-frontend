import { create } from 'zustand';

interface LanguageState {
  isArabic: boolean;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  isArabic: false,
  toggleLanguage: () => set((state) => ({ isArabic: !state.isArabic })),
})); 