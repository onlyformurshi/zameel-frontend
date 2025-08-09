import { useState, useEffect } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import { FiImage, FiX } from 'react-icons/fi';
import { Gallery } from '../../../api/admin/types/adminGallery.types';

interface Category {
  _id: string;
  name: string;
  arabicName: string;
}

interface GalleryFormProps {
  gallery?: Gallery;
  onSubmit: (formData: FormData) => Promise<void>;
  mode: 'create' | 'edit';
  categories: Category[];
}

const GalleryForm = ({ gallery, onSubmit, mode, categories }: GalleryFormProps) => {
  const { isDarkMode } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    arabicTitle: '',
    category: '',
    arabicCategory: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title || '',
        arabicTitle: gallery.arabicTitle || '',
        category: gallery.category?._id || '',
        arabicCategory: gallery.arabicCategory?._id || '',
      });
      if (gallery.image) {
        setImagePreview(gallery.image);
      }
    }
  }, [gallery]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setImageFile(files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const submitData = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          submitData.append(key, value.toString());
        }
      });

      // Add image file if it exists
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          No categories found. Please create categories first.
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Fields */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={`block mb-2 text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Title (English)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-indigo-500`}
            placeholder="Enter title in English..."
            required
          />
        </div>

        <div>
          <label className={`block mb-2 text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Title (Arabic)
          </label>
          <input
            type="text"
            value={formData.arabicTitle}
            onChange={(e) => setFormData(prev => ({ ...prev, arabicTitle: e.target.value }))}
            className={`w-full px-3 py-2 rounded-lg border text-right ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-indigo-500`}
            placeholder="أدخل العنوان بالعربية..."
            dir="rtl"
            required
          />
        </div>
      </div>

      {/* Category Fields */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className={`block mb-2 text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => {
              const categoryId = e.target.value;
              setFormData(prev => ({
                ...prev,
                category: categoryId,
                arabicCategory: categoryId // Use the same ID for both fields
              }));
            }}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-indigo-500`}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className={`block mb-2 text-sm font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Image
        </label>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
              isDarkMode 
                ? 'border-gray-700 hover:border-gray-600' 
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiImage className={`w-8 h-8 mb-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Click to upload image
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                required={!imagePreview}
              />
            </label>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative group overflow-hidden rounded-lg">
              <img
                src={imagePreview}
                alt="Image preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !imagePreview || !formData.category}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting 
            ? 'Saving...' 
            : mode === 'create' 
              ? 'Create Gallery Item' 
              : 'Update Gallery Item'}
        </button>
      </div>
    </form>
  );
};

export default GalleryForm; 