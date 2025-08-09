import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const TOAST_DURATION = 3000; // 3 seconds

const Toast = () => {
  const { isDarkMode } = useThemeStore();
  const { message, type, hideToast } = useToastStore();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'error':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-indigo-500 to-purple-600';
    }
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed top-4 md:right-4 left-1/2 md:left-auto md:-translate-x-0 -translate-x-1/2 z-[9999] w-[90vw] md:w-[400px]"
        >
          <div
            className={`${
              isDarkMode 
                ? 'bg-[#141b2d]/95 border-gray-700' 
                : 'bg-white/95 border-gray-200'
            } backdrop-blur-md border rounded-lg shadow-lg overflow-hidden`}
            role="alert"
          >
            {/* Progress Bar */}
            <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ 
                  duration: TOAST_DURATION / 1000,
                  ease: "linear"
                }}
                className={`h-full bg-gradient-to-r ${getGradient()}`}
              />
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`${
                    type === 'success'
                      ? 'text-green-500'
                      : type === 'error'
                        ? 'text-red-500'
                        : 'text-indigo-500'
                  }`}>
                    {getIcon()}
                  </span>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {message}
                  </p>
                </div>
                <button
                  onClick={hideToast}
                  className={`p-1 rounded-full transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Close notification"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast; 