import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { motion } from 'framer-motion';
import { Course, publicCoursesAPI } from '../api/public/courses';

const Courses = () => {
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('All Programs');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await publicCoursesAPI.getAllCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const levels = ['All Programs', 'Foundation', 'Advanced', 'Professional', 'Specialized'];

  const filteredCourses = selectedLevel === 'All Programs' 
    ? courses 
    : courses.filter(course => course.level === selectedLevel);

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
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedLevel === level
                  ? 'bg-indigo-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {level}
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
              className="group relative p-8 rounded-2xl bg-[#2A2A3C] hover:bg-[#32324A] transition-colors duration-300"
            >
              <div className="relative z-10">
                <div className="mb-4">
                  <span className={`text-sm px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400`}>
                    {isArabic ? course.arabicLevel : course.level}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {isArabic ? course.arabicTitle : course.title}
                </h3>
                <p className="text-gray-400 mb-6">
                  {isArabic ? course.arabicDescription : course.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {isArabic ? 'المدة' : 'Duration'}
                      </div>
                      <div className="text-gray-300">
                        {isArabic ? course.arabicDuration : course.duration}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {isArabic ? 'الجدول' : 'Schedule'}
                      </div>
                      <div className="text-gray-300">
                        {isArabic ? course.arabicSchedule : course.schedule}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(isArabic ? course.arabicFeatures : course.features).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-sm px-3 py-1 rounded-full bg-gray-700/50 text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300">
                  {isArabic ? 'استفسر الآن' : 'Enquire Now'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses; 