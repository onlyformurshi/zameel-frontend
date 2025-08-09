import { useThemeStore } from '../store/themeStore';
import { useConfirmStore } from '../hooks/useConfirm';

const ConfirmDialog = () => {
  const { isDarkMode } = useThemeStore();
  const { isOpen, title, message, onConfirm, onCancel } = useConfirmStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* Dialog */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-lg shadow-xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className="p-4">
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {title}
              </h2>
            </div>

            {/* Content */}
            <div className="p-4">
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {message}
              </p>
            </div>

            {/* Actions */}
            <div
              className={`flex justify-end gap-3 p-4 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <button
                onClick={onCancel}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog; 