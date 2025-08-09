import { motion } from 'framer-motion';
import { useLanguageStore } from '../store/languageStore';
import { useThemeStore } from '../store/themeStore';

const LanguageSwitcher = () => {
  const { isArabic, toggleLanguage } = useLanguageStore();
  const { isDarkMode } = useThemeStore();

  const ariaLabel = `Switch to ${isArabic ? 'English' : 'Arabic'} language`;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      aria-label={ariaLabel}
      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
        isDarkMode 
          ? 'text-gray-200 hover:text-white hover:bg-white/10' 
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center gap-2" role="presentation">
        <span 
          className={`text-sm ${isArabic ? 'font-normal' : 'font-semibold'}`}
          aria-hidden={isArabic}
        >
          English
        </span>
        <span 
          className={`text-sm opacity-40 ${isDarkMode ? 'text-white' : 'text-black'}`} 
          aria-hidden="true"
        >
          |
        </span>
        <span 
          className={`text-sm font-arabic ${isArabic ? 'font-semibold' : 'font-normal'}`}
          aria-hidden={!isArabic}
        >
          العربية
        </span>
      </div>
    </motion.button>
  );
};

export default LanguageSwitcher;