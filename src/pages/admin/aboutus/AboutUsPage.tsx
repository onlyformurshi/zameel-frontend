import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { FaPlus, FaEdit, FaTimes } from 'react-icons/fa';
import { AboutUs } from '../../../api/admin/types/adminAboutUs.types';
import { adminAboutUsAPI } from '../../../api/admin/adminAboutUs';
import AboutUsForm from './AboutUsForm';

const StatCard = ({ title, value, isDarkMode }: { title: string; value: string | number; isDarkMode: boolean }) => (
  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#141b2d]' : 'bg-white'} shadow-sm`}>
    <h3 className={`text-3xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
      {value}
    </h3>
    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      {title}
    </p>
  </div>
);

const AboutUsPage = () => {
  const { isDarkMode } = useThemeStore();
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAboutUs();
  }, []);

  const loadAboutUs = async () => {
    try {
      setIsLoading(true);
      const data = await adminAboutUsAPI.getAboutUs();
      setAboutUs(data);
    } catch (error) {
      console.error("Failed to load about us:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsSheetOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const data = {
        title: formData.get('title') as string,
        titleArabic: formData.get('titleArabic') as string,
        description: formData.get('description') as string,
        descriptionArabic: formData.get('descriptionArabic') as string,
        stats: {
          studentsEnrolled: Number(formData.get('studentsEnrolled')),
          successRate: Number(formData.get('successRate')),
          expertEducators: Number(formData.get('expertEducators')),
          yearsOfExcellence: Number(formData.get('yearsOfExcellence')),
        },
        mission: formData.get('mission') as string,
        missionArabic: formData.get('missionArabic') as string,
        vision: formData.get('vision') as string,
        visionArabic: formData.get('visionArabic') as string,
      };

      const result = await adminAboutUsAPI.upsertAboutUs(data);
      setAboutUs(result);
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Failed to save about us:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Manage About Us
          </h2>
          <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Edit your about us section
          </p>
        </div>
        {!aboutUs && (
          <button
            onClick={() => setIsSheetOpen(true)}
            className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow group"
          >
            <FaPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="ml-2 font-medium">Create About Us</span>
          </button>
        )}
      </div>

      {/* Content Display */}
      {aboutUs && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Students Enrolled"
              value={`${aboutUs.stats.studentsEnrolled}+`}
              isDarkMode={isDarkMode}
            />
            <StatCard
              title="Success Rate"
              value={`${aboutUs.stats.successRate}%`}
              isDarkMode={isDarkMode}
            />
            <StatCard
              title="Expert Educators"
              value={`${aboutUs.stats.expertEducators}+`}
              isDarkMode={isDarkMode}
            />
            <StatCard
              title="Years of Excellence"
              value={aboutUs.stats.yearsOfExcellence}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Main Content */}
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-[#141b2d]' : 'bg-white'} shadow-sm relative`}>
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => handleEdit()}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? "hover:bg-gray-800 text-gray-400 hover:text-indigo-400"
                    : "hover:bg-gray-100 text-gray-500 hover:text-indigo-600"
                }`}
              >
                <FaEdit className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  {aboutUs.title}
                </h3>
                <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {aboutUs.description}
                </p>
              </div>

              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Our Mission
                </h4>
                <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {aboutUs.mission}
                </p>
              </div>

              <div>
                <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Our Vision
                </h4>
                <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {aboutUs.vision}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Sheet */}
      <AnimatePresence>
        {isSheetOpen && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className={`absolute right-0 top-0 h-full w-full max-w-[600px] overflow-y-auto ${
                isDarkMode ? "bg-[#141b2d] border-l border-gray-800" : "bg-white"
              } shadow-xl`}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {aboutUs ? "Edit About Us" : "Create About Us"}
                </h2>
                <button
                  onClick={() => setIsSheetOpen(false)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-4">
                <AboutUsForm
                  aboutUs={aboutUs}
                  onSubmit={handleSubmit}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutUsPage;
