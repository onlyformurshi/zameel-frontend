import { Link } from 'react-router-dom';
import { useLanguageStore } from '../store/languageStore';
import { motion } from 'framer-motion';

interface LocalizedButtonProps {
  to?: string;
  onClick?: () => void;
  englishText: string;
  arabicText: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const LocalizedButton = ({
  to,
  onClick,
  englishText,
  arabicText,
  variant = 'primary',
  className = ''
}: LocalizedButtonProps) => {
  const { isArabic } = useLanguageStore();

  const baseStyles = variant === 'primary'
    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/20'
    : 'border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5';

  const buttonContent = (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-8 py-4 rounded-full text-lg uppercase tracking-wider transition-all duration-300 ${baseStyles} ${className}`}
    >
      {isArabic ? arabicText : englishText}
    </motion.span>
  );

  if (to) {
    return <Link to={to}>{buttonContent}</Link>;
  }

  return (
    <button onClick={onClick}>
      {buttonContent}
    </button>
  );
};

export default LocalizedButton; 