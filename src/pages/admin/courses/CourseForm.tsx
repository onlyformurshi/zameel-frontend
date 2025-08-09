import { useState, useEffect } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { Course, CourseCategory, CreateCourseDto } from '../../../api/admin/types/adminCourse.types';

interface CourseFormProps {
  course?: Course;
  onSubmit: (formData: FormData) => Promise<void>;
  mode: 'create' | 'edit' | 'view';
  courseCategories: CourseCategory[];
}

const CourseForm = ({ course, onSubmit, mode, courseCategories }: CourseFormProps) => {
  const { isDarkMode } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [, setImageFile] = useState<File | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [newArabicFeature, setNewArabicFeature] = useState('');
  
  const [formData, setFormData] = useState<CreateCourseDto>({
    title: '',
    arabicTitle: '',
    description: '',
    arabicDescription: '',
    features: [],
    arabicFeatures: [],
    duration: '',
    arabicDuration: '',
    category: '',
    schedule: '',
    arabicSchedule: '',
    level: '',
    arabicLevel: '',
  });

  useEffect(() => {
    if (course) {
      const { image, ...courseData } = course;
      setFormData(courseData);
      if (image) {
        setImagePreview(image);
      }
    }
  }, [course]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleAddArabicFeature = () => {
    if (newArabicFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        arabicFeatures: [...prev.arabicFeatures, newArabicFeature.trim()],
      }));
      setNewArabicFeature('');
    }
  };

  const handleRemoveArabicFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      arabicFeatures: prev.arabicFeatures.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    // Validate features
    if (formData.features.length === 0 || formData.arabicFeatures.length === 0) {
      alert('Please add at least one feature in both English and Arabic');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const formDataToSubmit = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // For arrays, append each item separately with array notation in the key
          value.forEach((item, index) => {
            formDataToSubmit.append(`${key}[${index}]`, item);
          });
        } else if (value !== undefined && value !== null) {
          formDataToSubmit.append(key, value);
        }
      });

      // Add image as base64 string
      if (imagePreview) {
        formDataToSubmit.append('image', imagePreview);
      }

      await onSubmit(formDataToSubmit);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = `w-full px-3 sm:px-4 py-2 text-[13px] sm:text-sm rounded-lg ${
    isDarkMode
      ? 'bg-[#1f2937] border-gray-700 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  } border focus:ring-2 focus:ring-indigo-500 focus:border-transparent`;

  const labelClassName = `block text-[13px] sm:text-sm font-medium mb-1.5 sm:mb-2 ${
    isDarkMode ? 'text-gray-300' : 'text-gray-700'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full max-w-3xl mx-auto">
      {/* Image Upload Field */}
      <div>
        <label htmlFor="image" className={labelClassName}>Course Image</label>
        <div className="space-y-2">
          {imagePreview && (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Course preview"
                className="w-full max-h-[300px] object-contain rounded-lg cursor-pointer"
                onClick={() => setIsPreviewOpen(true)}
              />
              {mode !== 'view' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setImageFile(null);
                    const fileInput = document.getElementById('image') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          {mode !== 'view' && (
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className={inputClassName}
              accept="image/*"
            />
          )}
        </div>

        {/* Image Preview Modal */}
        {isPreviewOpen && imagePreview && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsPreviewOpen(false)}
          >
            <div 
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
                onClick={() => setIsPreviewOpen(false)}
              >
                <FaTimes className="w-6 h-6" />
              </button>
              <img
                src={imagePreview}
                alt="Course preview"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Category
        </label>
        <select
          name="category"
          id="category"
          required
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'border-gray-300 text-gray-900'
          } focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          disabled={mode === 'view'}
        >
          <option value="">Select a category</option>
          {courseCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name} - {category.arabicName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Level */}
        <div>
          <label htmlFor="level" className={labelClassName}>
            Level (English)
          </label>
          <input
            type="text"
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Foundation, Intermediate, Advanced"
            required
            disabled={mode === 'view'}
          />
        </div>

        {/* Arabic Level */}
        <div>
          <label htmlFor="arabicLevel" className={labelClassName}>
            Level (Arabic)
          </label>
          <input
            type="text"
            id="arabicLevel"
            name="arabicLevel"
            value={formData.arabicLevel}
            onChange={handleChange}
            className={`${inputClassName} text-right`}
            placeholder="تأسيسي، متوسط، متقدم"
            required
            disabled={mode === 'view'}
            dir="rtl"
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClassName}>
            Title (English)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Course Title"
            required
            disabled={mode === 'view'}
          />
        </div>

        {/* Arabic Title */}
        <div>
          <label htmlFor="arabicTitle" className={labelClassName}>
            Title (Arabic)
          </label>
          <input
            type="text"
            id="arabicTitle"
            name="arabicTitle"
            value={formData.arabicTitle}
            onChange={handleChange}
            className={`${inputClassName} text-right`}
            placeholder="عنوان الدورة"
            required
            disabled={mode === 'view'}
            dir="rtl"
          />
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className={labelClassName}>
            Duration (English)
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className={inputClassName}
            placeholder="1 year, 6 months, etc."
            required
            disabled={mode === 'view'}
          />
        </div>

        {/* Arabic Duration */}
        <div>
          <label htmlFor="arabicDuration" className={labelClassName}>
            Duration (Arabic)
          </label>
          <input
            type="text"
            id="arabicDuration"
            name="arabicDuration"
            value={formData.arabicDuration}
            onChange={handleChange}
            className={`${inputClassName} text-right`}
            placeholder="سنة واحدة، ستة أشهر، الخ"
            required
            disabled={mode === 'view'}
            dir="rtl"
          />
        </div>

        {/* Schedule */}
        <div>
          <label htmlFor="schedule" className={labelClassName}>
            Schedule (English)
          </label>
          <input
            type="text"
            id="schedule"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className={inputClassName}
            placeholder="Full-time, Part-time, etc."
            required
            disabled={mode === 'view'}
          />
        </div>

        {/* Arabic Schedule */}
        <div>
          <label htmlFor="arabicSchedule" className={labelClassName}>
            Schedule (Arabic)
          </label>
          <input
            type="text"
            id="arabicSchedule"
            name="arabicSchedule"
            value={formData.arabicSchedule}
            onChange={handleChange}
            className={`${inputClassName} text-right`}
            placeholder="دوام كامل، دوام جزئي، الخ"
            required
            disabled={mode === 'view'}
            dir="rtl"
          />
        </div>
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label htmlFor="description" className={labelClassName}>
          Description (English)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`${inputClassName} h-24 sm:h-32 text-[13px] sm:text-sm resize-none`}
          placeholder="Course description..."
          required
          disabled={mode === 'view'}
        />
      </div>

      {/* Arabic Description */}
      <div className="md:col-span-2">
        <label htmlFor="arabicDescription" className={labelClassName}>
          Description (Arabic)
        </label>
        <textarea
          id="arabicDescription"
          name="arabicDescription"
          value={formData.arabicDescription}
          onChange={handleChange}
          className={`${inputClassName} h-24 sm:h-32 text-[13px] sm:text-sm resize-none text-right`}
          placeholder="وصف الدورة..."
          required
          dir="rtl"
          disabled={mode === 'view'}
        />
      </div>

      {/* Features */}
      <div className="md:col-span-2">
        <label className={labelClassName}>Features (English)</label>
        <div className="space-y-3 sm:space-y-4">
          {mode !== 'view' && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className={inputClassName}
                placeholder="Add a feature..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <FaPlus className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[13px] sm:text-sm ${
                  isDarkMode
                    ? 'bg-[#1f2937] text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span>{feature}</span>
                {mode !== 'view' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arabic Features */}
      <div className="md:col-span-2">
        <label className={labelClassName}>Features (Arabic)</label>
        <div className="space-y-3 sm:space-y-4">
          {mode !== 'view' && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newArabicFeature}
                onChange={(e) => setNewArabicFeature(e.target.value)}
                className={`${inputClassName} text-right`}
                placeholder="أضف ميزة..."
                dir="rtl"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddArabicFeature();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddArabicFeature}
                className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <FaPlus className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {formData.arabicFeatures.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-[13px] sm:text-sm ${
                  isDarkMode
                    ? 'bg-[#1f2937] text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <span className="text-right">{feature}</span>
                {mode !== 'view' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveArabicFeature(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {mode !== 'view' && (
        <div className="mt-6 sm:mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-[13px] sm:text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center space-x-2 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-indigo-800'
            }`}
          >
            <span>
              {isSubmitting 
                ? 'Saving...' 
                : mode === 'create' 
                  ? 'Create Course' 
                  : 'Save Changes'}
            </span>
          </button>
        </div>
      )}
    </form>
  );
};

export default CourseForm;
