import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FloatingAction = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: '📚', label: 'Courses', path: '/courses' },
    { icon: '🎯', label: 'Services', path: '/services' },
    { icon: '📞', label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 space-y-2"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-white/90 dark:bg-dark-800/90 
                    shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-dark-900 dark:text-primary-100">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="p-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg
          hover:shadow-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </motion.div>
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
      </motion.button>
    </div>
  );
};

export default FloatingAction; 