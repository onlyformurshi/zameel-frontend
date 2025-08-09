import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { FaTimes } from 'react-icons/fa';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: Array<{ path: string; label: string }>;
  currentPath: string;
}

const MobileMenu = ({ isOpen, onClose, navItems, currentPath }: MobileMenuProps) => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const itemVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Menu */}
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`fixed top-0 right-0 h-full w-4/5 max-w-sm z-50 ${
              isDarkMode ? 'bg-dark-800' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={`p-4 flex justify-between items-center border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h2 className="text-xl font-bold gradient-text">Menu</h2>
              <button
                onClick={onClose}
                aria-label="Close mobile menu"
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'text-gray-200 hover:bg-gray-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FaTimes className="w-6 h-6" aria-hidden="true" />
                <span className="sr-only">Close Menu</span>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-4">
              <ul className="space-y-4">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.path}
                    custom={i}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`block p-3 rounded-lg transition-all duration-300 ${
                        currentPath === item.path
                          ? 'bg-primary/20 text-primary'
                          : isDarkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Theme Toggle and Footer */}
            <motion.div
              variants={itemVariants}
              custom={navItems.length}
              className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className="flex flex-col space-y-4">
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className={`flex items-center justify-center space-x-2 p-3 rounded-lg w-full transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {isDarkMode ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>

                <button 
                  className="btn btn-primary"
                  aria-label="Get Started"
                >
                  Get Started
                </button>
                <button 
                  className="btn btn-outline"
                  aria-label="Contact Us"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu; 