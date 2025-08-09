import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useThemeStore } from '../store/themeStore';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 overflow-y-auto`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            className={`w-full max-w-2xl rounded-lg shadow-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className={`p-1 rounded-full hover:bg-opacity-10 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-white' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-black'
                }`}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal; 