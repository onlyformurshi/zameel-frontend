import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { FaSun, FaMoon } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const navItems = [
    { path: '/', label: 'Home', arabicLabel: 'الرئيسية' },
    { path: '/courses', label: 'Courses', arabicLabel: 'الدورات' },
    { path: '/events', label: 'Events', arabicLabel: 'الفعاليات' },
    { path: '/faculty', label: 'Faculty', arabicLabel: 'أعضاء هيئة التدريس' },
    { path: '/gallery', label: 'Gallery', arabicLabel: 'معرض الصور' },
    { path: '/about', label: 'About Us', arabicLabel: 'من نحن' },
    { path: '/faq', label: 'FAQ', arabicLabel: 'الأسئلة الشائعة' },
    { path: '/contact', label: 'Contact', arabicLabel: 'اتصل بنا' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (isOpen && mobileMenuRef.current && menuButtonRef.current) {
        const target = event.target as Node;
        // Check if the click is outside both the menu and the toggle button
        if (!mobileMenuRef.current.contains(target) && !menuButtonRef.current.contains(target)) {
          setIsOpen(false);
        }
      }
    };

    // Add both click and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-surface/80 dark:bg-dark/80 backdrop-blur-lg' 
          : 'bg-transparent'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between h-24 px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative w-16 h-16"
            >
              <img 
                src={isDarkMode ? "/dark.png" : "/zameel-logo-light.png"} 
                alt="Logo" 
                className="w-full h-full object-contain" 
              />
            </motion.div>
            <div className="flex flex-col">
              <span className={`text-2xl font-light tracking-wider ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ZAMEEL
              </span>
              <span className={`text-sm tracking-wide arabic-text ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                الأكاديمية العربية
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-2 py-2 text-sm uppercase tracking-wider transition-colors duration-300
                    ${location.pathname === item.path 
                      ? isDarkMode ? 'text-white' : 'text-gray-900' 
                      : isDarkMode 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-600 hover:text-indigo-500'
                    } ${isArabic ? 'font-arabic' : ''}`}
                >
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-indigo-500 to-purple-600"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {isArabic ? item.arabicLabel : item.label}
                </Link>
              ))}
            </div>

            {/* Right side items grouped together */}
            <div className={`flex items-center space-x-4 ${isArabic ? 'border-r' : 'border-l'} border-gray-200 dark:border-gray-700 ${isArabic ? 'mr-4' : 'pl-4'}`}>
              <LanguageSwitcher />

              {/* Desktop Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                aria-label={isDarkMode 
                  ? isArabic ? "التبديل إلى الوضع المضيء" : "Switch to Light Mode"
                  : isArabic ? "التبديل إلى الوضع المظلم" : "Switch to Dark Mode"
                }
                className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                  hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                {isDarkMode ? <FaSun size={18} aria-hidden="true" /> : <FaMoon size={18} aria-hidden="true" />}
                <span className="sr-only">
                  {isDarkMode 
                    ? isArabic ? "التبديل إلى الوضع المضيء" : "Switch to Light Mode"
                    : isArabic ? "التبديل إلى الوضع المظلم" : "Switch to Dark Mode"
                  }
                </span>
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            ref={menuButtonRef}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <motion.span
                animate={{ rotateZ: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
                className={`w-full h-px block ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`}
              />
              <motion.span
                animate={{ width: isOpen ? 0 : '100%' }}
                className={`h-px block ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`}
              />
              <motion.span
                animate={{ rotateZ: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
                className={`w-full h-px block ${isDarkMode ? 'bg-white' : 'bg-gray-900'}`}
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden backdrop-blur-lg border-t ${
                isDarkMode 
                  ? 'bg-dark/95 border-white/10' 
                  : 'bg-surface/95 border-gray-200'
              }`}
            >
              <div className="max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="px-8 py-6 space-y-4">
                  {/* Navigation Items */}
                  {navItems.map((item) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block py-3 text-sm uppercase tracking-widest ${
                          location.pathname === item.path 
                            ? isDarkMode ? 'text-white' : 'text-gray-900'
                            : isDarkMode 
                              ? 'text-gray-400 hover:text-white' 
                              : 'text-gray-600 hover:text-indigo-500'
                          } ${isArabic ? 'font-arabic text-right' : ''}`}
                      >
                        {isArabic ? item.arabicLabel : item.label}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Language Switcher in Mobile Menu */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm uppercase tracking-widest ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {isArabic ? 'اللغة' : 'Language'}
                      </span>
                      <LanguageSwitcher />
                    </div>
                  </motion.div>

                  {/* Theme Toggle in Mobile Menu */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm uppercase tracking-widest ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {isArabic ? 'المظهر' : 'Theme'}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        aria-label={isDarkMode 
                          ? isArabic ? "التبديل إلى الوضع المضيء" : "Switch to Light Mode"
                          : isArabic ? "التبديل إلى الوضع المظلم" : "Switch to Dark Mode"
                        }
                        className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                          hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                      >
                        {isDarkMode ? <FaSun size={18} aria-hidden="true" /> : <FaMoon size={18} aria-hidden="true" />}
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 