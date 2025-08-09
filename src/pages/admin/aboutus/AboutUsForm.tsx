import { useState } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import { AboutUs } from '../../../api/admin/types/adminAboutUs.types';

interface AboutUsFormProps {
  aboutUs?: AboutUs | null;
  mode?: 'create' | 'edit' | 'view';
  onSubmit: (data: FormData) => Promise<void>;
}

const AboutUsForm = ({ aboutUs, mode = 'create', onSubmit }: AboutUsFormProps) => {
  const { isDarkMode } = useThemeStore();
  const [formData, setFormData] = useState({
    title: aboutUs?.title || '',
    titleArabic: aboutUs?.titleArabic || '',
    description: aboutUs?.description || '',
    descriptionArabic: aboutUs?.descriptionArabic || '',
    studentsEnrolled: aboutUs?.stats.studentsEnrolled || 0,
    successRate: aboutUs?.stats.successRate || 0,
    expertEducators: aboutUs?.stats.expertEducators || 0,
    yearsOfExcellence: aboutUs?.stats.yearsOfExcellence || 0,
    mission: aboutUs?.mission || '',
    missionArabic: aboutUs?.missionArabic || '',
    vision: aboutUs?.vision || '',
    visionArabic: aboutUs?.visionArabic || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });
    await onSubmit(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isViewMode = mode === 'view';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={isViewMode}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Title (Arabic)
            </label>
            <input
              type="text"
              name="titleArabic"
              value={formData.titleArabic}
              onChange={handleChange}
              disabled={isViewMode}
              dir="rtl"
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isViewMode}
              rows={3}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description (Arabic)
            </label>
            <textarea
              name="descriptionArabic"
              value={formData.descriptionArabic}
              onChange={handleChange}
              disabled={isViewMode}
              rows={3}
              dir="rtl"
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Students Enrolled
            </label>
            <input
              type="number"
              name="studentsEnrolled"
              value={formData.studentsEnrolled}
              onChange={handleChange}
              disabled={isViewMode}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Success Rate (%)
            </label>
            <input
              type="number"
              name="successRate"
              value={formData.successRate}
              onChange={handleChange}
              disabled={isViewMode}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Expert Educators
            </label>
            <input
              type="number"
              name="expertEducators"
              value={formData.expertEducators}
              onChange={handleChange}
              disabled={isViewMode}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Years of Excellence
            </label>
            <input
              type="number"
              name="yearsOfExcellence"
              value={formData.yearsOfExcellence}
              onChange={handleChange}
              disabled={isViewMode}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Mission
            </label>
            <textarea
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              disabled={isViewMode}
              rows={3}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Mission (Arabic)
            </label>
            <textarea
              name="missionArabic"
              value={formData.missionArabic}
              onChange={handleChange}
              disabled={isViewMode}
              rows={3}
              dir="rtl"
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Vision
            </label>
            <textarea
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              disabled={isViewMode}
              rows={3}
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Vision (Arabic)
            </label>
            <textarea
              name="visionArabic"
              value={formData.visionArabic}
              onChange={handleChange}
              disabled={isViewMode}
              rows={3}
              dir="rtl"
              className={`mt-1 block w-full rounded-md ${
                isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
              } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
          </div>
        </div>
      </div>

      {!isViewMode && (
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {mode === 'edit' ? 'Update' : 'Create'}
          </button>
        </div>
      )}
    </form>
  );
};

export default AboutUsForm; 