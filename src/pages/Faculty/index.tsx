import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { FaLinkedin, FaEnvelope, FaTimes } from 'react-icons/fa';
import { useLanguageStore } from '../../store/languageStore';
import { publicFacultiesAPI } from '../../api/public/faculties';

// Add translations for UI text
const translations = {
  en: {
    pageTitle: "Our Faculty",
    pageSubtitle: "Meet our distinguished professors and instructors",
    searchPlaceholder: "Search faculty members...",
    specialization: "Specialization",
    bio: "Bio",
    contact: "Contact",
    linkedinProfile: "LinkedIn Profile",
    twitterProfile: "Twitter Profile",
    noResults: "No faculty members found"
  },
  ar: {
    pageTitle: "أعضاء هيئة التدريس",
    pageSubtitle: "تعرف على أساتذتنا ومدرسينا المتميزين",
    searchPlaceholder: "البحث عن أعضاء هيئة التدريس...",
    specialization: "التخصص",
    bio: "السيرة الذاتية",
    contact: "معلومات الاتصال",
    linkedinProfile: "الملف الشخصي في ليند إن",
    twitterProfile: "الملف الشخصي في تويتر",
    noResults: "لم يتم العثور على أعضاء هيئة التدريس"
  }
};

interface Faculty {
  _id: string;
  name: string;
  arabicName: string;
  position: string;
  arabicPosition: string;
  image: string;
  bio: string;
  arabicBio: string;
  specialization: string[];
  arabicSpecialization: string[];
  email: string;
  socialLinks?: {
    linkedin?: string;
    _id: string;
  };
}

// Sheet component for faculty details
const FacultySheet = ({ 
  faculty, 
  isOpen, 
  onClose,
  isDarkMode 
}: { 
  faculty: Faculty; 
  isOpen: boolean; 
  onClose: () => void;
  isDarkMode: boolean;
}) => {
  const { isArabic } = useLanguageStore();
  const t = isArabic ? translations.ar : translations.en;
  
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? '-100%' : '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isArabic ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed ${isArabic ? 'left-0' : 'right-0'} top-0 h-full w-full max-w-xl z-50 ${
              isDarkMode ? 'bg-dark-800' : 'bg-white'
            } shadow-xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-6">
              {/* Image */}
              <div className="h-72 rounded-xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-800">
                <img
                  src={faculty.image}
                  alt={isArabic ? faculty.arabicName : faculty.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div>
                  <h3 className={`text-2xl font-semibold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isArabic ? faculty.arabicName : faculty.name}
                  </h3>
                  <p className={`text-lg ${
                    isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>
                    {isArabic ? faculty.arabicPosition : faculty.position}
                  </p>
                </div>

                <div>
                  <h4 className={`font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {t.specialization}
                  </h4>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {isArabic ? faculty.arabicSpecialization : faculty.specialization}
                  </p>
                </div>

                <div>
                  <h4 className={`font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {t.bio}
                  </h4>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {isArabic ? faculty.arabicBio : faculty.bio}
                  </p>
                </div>

                <div>
                  <h4 className={`font-medium mb-3 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {t.contact}
                  </h4>
                  <div className={`flex items-center ${isArabic ? 'space-x-reverse' : ''} space-x-4`}>
                    <a
                      href={`mailto:${faculty.email}`}
                      className={`p-3 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-400 hover:text-white' 
                          : 'bg-gray-100 text-gray-600 hover:text-indigo-600'
                      }`}
                    >
                      <FaEnvelope className="w-5 h-5" />
                    </a>
                    {faculty.socialLinks?.linkedin && (
                      <a
                        href={faculty.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t.linkedinProfile}
                        className={`p-3 rounded-lg transition-colors duration-200 ${
                          isDarkMode 
                            ? 'bg-gray-800 text-gray-400 hover:text-white' 
                            : 'bg-gray-100 text-gray-600 hover:text-indigo-600'
                        }`}
                      >
                        <FaLinkedin className="w-5 h-5" aria-hidden="true" />
                        <span className="sr-only">{t.linkedinProfile}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Faculty = () => {
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  
  const t = isArabic ? translations.ar : translations.en;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await publicFacultiesAPI.getAllFaculties();
      setFaculties(response);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t.pageTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {t.pageSubtitle}
          </motion.p>
        </div>

        {/* Faculty Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {faculties.map((faculty) => (
            <motion.div
              key={faculty._id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedFaculty(faculty)}
              className={`rounded-xl overflow-hidden cursor-pointer h-[400px] ${
                isDarkMode 
                  ? 'bg-dark-800 hover:bg-dark-700' 
                  : 'bg-white hover:bg-gray-50'
              } shadow-lg transition-all duration-300`}
            >
              <div className="h-52 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <img
                  src={faculty.image}
                  alt={isArabic ? faculty.arabicName : faculty.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <div className="mb-3">
                  <h3 className={`text-lg font-semibold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isArabic ? faculty.arabicName : faculty.name}
                  </h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>
                    {isArabic ? faculty.arabicPosition : faculty.position}
                  </p>
                </div>
                <p className={`text-sm mb-4 line-clamp-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isArabic ? faculty.arabicBio : faculty.bio}
                </p>
                <div className="flex items-center space-x-3 mt-auto">
                  <a
                    href={`mailto:${faculty.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-400 hover:text-white' 
                        : 'bg-gray-100 text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    <FaEnvelope className="w-4 h-4" />
                  </a>
                  {faculty?.socialLinks?.linkedin && (
                    <a
                      href={faculty?.socialLinks?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.linkedinProfile}
                      onClick={(e) => e.stopPropagation()}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'bg-gray-800 text-gray-400 hover:text-white' 
                          : 'bg-gray-100 text-gray-600 hover:text-indigo-600'
                      }`}
                    >
                      <FaLinkedin className="w-4 h-4" aria-hidden="true" />
                      <span className="sr-only">{t.linkedinProfile}</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Faculty Detail Sheet */}
        {selectedFaculty && (
          <FacultySheet
            faculty={selectedFaculty}
            isOpen={!!selectedFaculty}
            onClose={() => setSelectedFaculty(null)}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};

export default Faculty; 