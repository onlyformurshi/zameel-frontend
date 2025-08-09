import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { publicHomeAPI } from '../api/public/home';
import { Course, publicCoursesAPI } from '../api/public/courses';
import { Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

interface CourseCategory {
  _id: string;
  name: string;
  arabicName: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Services = () => {
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchCourseCategories = async () => {
    const response = await publicCoursesAPI.getAllCourseCategories();
    setCourseCategories(response);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await publicHomeAPI.getAllCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
    fetchCourseCategories();
  }, []);

  const filteredCourses = selectedLevel === 'All' 
    ? courses 
    : courses.filter(course => course.category?.name === selectedLevel);

  const handleEnquiry = () => {
    navigate('/contact');
  };

  const checkScrollable = () => {
    if (modalRef.current) {
      const { scrollHeight, clientHeight } = modalRef.current;
      setIsScrollable(scrollHeight > clientHeight);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      checkScrollable();
      const timer = setTimeout(checkScrollable, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedCourse]);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-4xl md:text-6xl font-light mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600`}
          >
            {isArabic ? 'البرامج التعليمية' : 'Educational Programs'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-lg md:text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {isArabic 
              ? 'اكتشف مجموعتنا الشاملة من البرامج التعليمية المصممة لتمكين العقول وتشكيل قادة المستقبل'
              : 'Discover our comprehensive range of educational programs designed to empower minds and shape future leaders'}
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            key="all"
            onClick={() => setSelectedLevel('All')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              selectedLevel === 'All'
                ? 'bg-indigo-600 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isArabic ? 'الكل' : 'All'}
          </button>
          {courseCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedLevel(category.name)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedLevel === category.name
                  ? 'bg-indigo-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isArabic ? category.arabicName : category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              onClick={() => setSelectedCourse(course)}
              className={`group relative p-8 rounded-2xl transition-colors duration-500 cursor-pointer h-[400px] ${
                isDarkMode 
                  ? 'bg-white/5 hover:bg-white/10' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`absolute inset-0 rounded-2xl opacity-0 
                group-hover:opacity-100 transition-opacity duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-600/20'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                }`} 
              />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl" role="img" aria-label="Course icon">
                    {course.icon}
                  </span>
                  <h3 className={`text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isArabic ? course.arabicTitle : course.title}
                  </h3>
                </div>
                <p className={`text-gray-${isDarkMode ? '400' : '600'} mb-6 line-clamp-3`}>
                  {isArabic ? course.arabicDescription : course.description}
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-6">
                    <div>
                      <div className={`text-sm text-gray-${isDarkMode ? '500' : '600'} mb-1`}>
                        {isArabic ? 'المدة' : 'Duration'}
                      </div>
                      <div className={`text-gray-${isDarkMode ? '300' : '700'}`}>
                        {isArabic ? course.arabicDuration : course.duration}
                      </div>
                    </div>
                    <div>
                      <div className={`text-sm text-gray-${isDarkMode ? '500' : '600'} mb-1`}>
                        {isArabic ? 'الجدول' : 'Schedule'}
                      </div>
                      <div className={`text-gray-${isDarkMode ? '300' : '700'}`}>
                        {isArabic ? course.arabicSchedule : course.schedule}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(isArabic ? course.arabicLevel : course.level)
                      .split(',')
                      .map((level, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-full ${
                            isDarkMode 
                              ? 'bg-indigo-500/20 text-indigo-300' 
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {level.trim()}
                        </span>
                      ))}
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnquiry();
                  }}
                  className="w-full py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 mt-auto"
                >
                  {isArabic ? 'استفسر الآن' : 'Enquire Now'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Course Modal */}
      <Dialog
        open={selectedCourse !== null}
        onClose={() => setSelectedCourse(null)}
        className="relative z-[999]"
      >
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[997]" 
          aria-hidden="true"
          onClick={() => setSelectedCourse(null)}
        />
        
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[998]">
          <Dialog.Panel className={`w-full max-w-2xl rounded-2xl transform transition-all max-h-[90vh] relative ${
            isDarkMode 
              ? 'bg-[#1F1F2E] border border-white/10' 
              : 'bg-white shadow-xl'
          }`}>
            {selectedCourse && (
              <>
                <div 
                  ref={modalRef}
                  onScroll={checkScrollable}
                  className="p-6 sm:p-8 overflow-y-auto scrollbar-hide max-h-[calc(80vh-80px)]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full">
                      {selectedCourse.image ? (
                        <img 
                          src={selectedCourse.image} 
                          alt={isArabic ? selectedCourse.arabicTitle : selectedCourse.title}
                          className="w-full sm:w-32 h-32 object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full sm:w-auto text-6xl p-6 rounded-xl bg-white/5">
                          {selectedCourse.icon}
                        </div>
                      )}
                      <div className="w-full sm:w-auto">
                        <Dialog.Title className={`text-2xl font-semibold mb-3 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {isArabic ? selectedCourse.arabicTitle : selectedCourse.title}
                        </Dialog.Title>
                        <div className="hidden sm:flex flex-wrap gap-2">
                          {(isArabic ? selectedCourse.arabicLevel : selectedCourse.level)
                            .split(',')
                            .map((level, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1.5 text-sm rounded-full ${
                                  isDarkMode 
                                    ? 'bg-indigo-500/20 text-indigo-300' 
                                    : 'bg-indigo-100 text-indigo-700'
                                }`}
                              >
                                {level.trim()}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
                        isDarkMode ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className={`mt-4 sm:mt-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
                    {isArabic ? selectedCourse.arabicDescription : selectedCourse.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-white/5' : 'bg-gray-50'
                    }`}>
                      <h4 className={`text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {isArabic ? 'تفاصيل البرنامج' : 'Programme Details'}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {isArabic ? 'المدة' : 'Duration'}
                          </span>
                          <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {isArabic ? selectedCourse.arabicDuration : selectedCourse.duration}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {isArabic ? 'الجدول' : 'Schedule'}
                          </span>
                          <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {isArabic ? selectedCourse.arabicSchedule : selectedCourse.schedule}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {isArabic ? 'المستويات' : 'Levels'}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {(isArabic ? selectedCourse.arabicLevel : selectedCourse.level)
                              .split(',')
                              .map((level, index) => (
                                <span
                                  key={index}
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    isDarkMode 
                                      ? 'bg-indigo-500/20 text-indigo-300' 
                                      : 'bg-indigo-100 text-indigo-700'
                                  }`}
                                >
                                  {level.trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-white/5' : 'bg-gray-50'
                    }`}>
                      <h4 className={`text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {isArabic ? 'المميزات' : 'Features'}
                      </h4>
                      <ul className="space-y-2">
                        {(isArabic ? selectedCourse.arabicFeatures : selectedCourse.features).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <svg className={`w-4 h-4 ${
                              isDarkMode ? 'text-indigo-400' : 'text-indigo-500'
                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={`p-4 border-t ${
                  isDarkMode ? 'border-white/10' : 'border-gray-200'
                }`}>
                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'bg-white/10 hover:bg-white/20 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      }`}
                    >
                      {isArabic ? 'إغلاق' : 'Close'}
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                      {isArabic ? 'استفسر الآن' : 'Enquire Now'}
                    </button>
                  </div>
                </div>

                {isScrollable && (
                  <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
                    <motion.div
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className={`p-2 rounded-full ${
                        isDarkMode 
                          ? 'bg-white/10' 
                          : 'bg-gray-100'
                      }`}
                    >
                      <svg 
                        className={`w-5 h-5 ${
                          isDarkMode ? 'text-white/70' : 'text-gray-600'
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 13l-7 7-7-7m14-8l-7 7-7-7" 
                        />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Services; 