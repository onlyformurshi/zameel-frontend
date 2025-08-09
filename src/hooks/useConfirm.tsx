import { create } from 'zustand';

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  showConfirmDialog: (title: string, message: string) => Promise<boolean>;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
  onCancel: () => {},
  showConfirmDialog: (title: string, message: string) =>
    new Promise((resolve) => {
      set({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          set({ isOpen: false });
          resolve(true);
        },
        onCancel: () => {
          set({ isOpen: false });
          resolve(false);
        },
      });
    }),
}));

export const useConfirm = () => {
  const showConfirmDialog = useConfirmStore((state) => state.showConfirmDialog);

  const showConfirmation = async (title: string, message: string) => {
    return await showConfirmDialog(title, message);
  };

  return { showConfirmation };
}; 