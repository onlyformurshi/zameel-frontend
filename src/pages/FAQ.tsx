import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiSearch, FiBook, FiClock, FiDollarSign, FiMonitor, FiAward, FiUsers } from 'react-icons/fi';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { publicFAQAPI } from '../api/public/faq';

// Add translations
const translations = {
  en: {
    pageTitle: "Frequently Asked Questions",
    pageSubtitle: "Find answers to common questions about our courses and services",
    searchPlaceholder: "Search questions...",
    categories: {
      all: "All",
      Courses: "Courses",
      Schedule: "Schedule",
      Fees: "Fees",
      "Online Learning": "Online Learning",
      Certification: "Certification",
      General: "General"
    }
  },
  ar: {
    pageTitle: "الأسئلة الشائعة",
    pageSubtitle: "اعثر على إجابات للأسئلة الشائعة حول دوراتنا وخدماتنا",
    searchPlaceholder: "ابحث عن الأسئلة...",
    categories: {
      all: "الكل",
      Courses: "الدورات",
      Schedule: "الجدول الزمني",
      Fees: "الرسوم",
      "Online Learning": "التعلم عن بعد",
      Certification: "الشهادات",
      General: "عام"
    }
  }
};

interface FAQItem {
  _id: string;
  question: string;
  arabicQuestion: string;
  answer: string;
  arabicAnswer: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface FAQCategory {
  _id: string;
  name: string;
  arabicName: string;
  createdAt: string;
  updatedAt: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const t = isArabic ? translations.ar : translations.en;

  // New state for API data
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([]);
  const [categoryIcons, setCategoryIcons] = useState<Record<string, typeof FiBook>>({});

  const fetchFAQ = async () => {
    try {
      const faq = await publicFAQAPI.getAllFAQ();
      setFaqItems(faq);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
    }
  }

  const fetchFAQCategories = async () => {
    try {
      const categories = await publicFAQAPI.getAllFAQCategories();
      setFaqCategories(categories);
      
      // Create a fixed mapping of icons for categories
      const icons = [FiBook, FiClock, FiDollarSign, FiMonitor, FiAward, FiUsers];
      const iconMapping = categories.reduce((acc: Record<string, typeof FiBook>, category: FAQCategory, index: number) => {
        acc[category._id] = icons[index % icons.length];
        return acc;
      }, {});
      setCategoryIcons(iconMapping);
    } catch (error) {
      console.error('Error fetching FAQ categories:', error);
    }
  }

  useEffect(() => {
    fetchFAQ();
    fetchFAQCategories();
  }, []);

  // Add a helper function to get icon for a category
  const getCategoryIcon = (categoryId: string) => {
    return categoryIcons[categoryId] || FiUsers; // FiUsers as fallback
  }

  // Filter FAQ items based on search query and category
  const filteredFAQs = useMemo(() => {
    return faqItems.filter(item => {
      const matchesSearch = searchQuery === '' || 
        (isArabic ? 
          item.arabicQuestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.arabicAnswer.toLowerCase().includes(searchQuery.toLowerCase())
        :
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, isArabic, faqItems]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t.pageTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {t.pageSubtitle}
          </motion.p>
        </div>

        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className={`absolute ${isArabic ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isArabic ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-dark/50 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.categories.all}
            </motion.button>
            {faqCategories.map((category) => {
              const Icon = getCategoryIcon(category._id);
              return (
                <motion.button
                  key={category._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category._id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  {isArabic ? category.arabicName : category.name}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFAQs.map((item, index) => {
              const Icon = getCategoryIcon(item.category);
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-xl overflow-hidden ${
                    isDarkMode 
                      ? 'border-gray-700 bg-dark/50 hover:bg-dark/70' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  } transition-colors duration-300`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`p-2 rounded-lg ${
                          isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        <Icon 
                          size={18}
                          className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                        />
                      </motion.div>
                      <span className={`font-medium text-left ${
                        isDarkMode ? 'text-white group-hover:text-indigo-400' : 'text-gray-900 group-hover:text-indigo-600'
                      } transition-colors duration-300`}>
                        {isArabic ? item.arabicQuestion : item.question}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex-shrink-0 ${isArabic ? 'mr-4' : 'ml-4'} ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {openIndex === index ? <FiMinus size={20} /> : <FiPlus size={20} />}
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`px-6 pb-4 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <div className="pt-2 pl-11">
                          <p className="leading-relaxed">
                            {isArabic ? item.arabicAnswer : item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 