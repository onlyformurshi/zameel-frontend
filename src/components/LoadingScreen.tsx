import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';

const LoadingScreen = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
        isDarkMode ? 'bg-dark' : 'bg-white'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <img 
            src={isDarkMode ? "/dark.png" : "/light.png"} 
            alt="Zameel Logo" 
            className="w-24 mx-auto"
          />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
        >
          International Group of Education
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8"
      >
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
          <motion.div
            animate={{ x: [-96, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen; 