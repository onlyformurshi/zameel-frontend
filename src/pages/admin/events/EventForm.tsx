import { useState, useEffect } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import { FiCalendar, FiMapPin, FiClock, FiImage, FiX } from 'react-icons/fi';
import { Event } from '../../../api/admin/types/adminEvent.types';

interface EventFormProps {
  event?: Event;
  onSubmit: (formData: FormData) => void;
  mode: 'create' | 'edit';
}

const EventForm = ({ event, onSubmit, mode }: EventFormProps) => {
  const { isDarkMode } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    arabicTitle: '',
    description: '',
    arabicDescription: '',
    date: '',
    time: '',
    location: '',
    arabicLocation: '',
  });
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
  const [eventImages, setEventImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        arabicTitle: event.arabicTitle,
        description: event.description,
        arabicDescription: event.arabicDescription,
        date: event.date,
        time: event.time,
        location: event.location,
        arabicLocation: event.arabicLocation,
      });
      // Set the main event image
      setEventImagePreview(event.thumbnail);
      // Set additional event images
      setEventImages(event.eventImages || []);
      // Reset removed images
      setRemovedImages([]);
    }
  }, [event]);

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEventImagePreview(base64String);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleEventImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setEventImages(prev => [...prev, base64String]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeEventImage = (index: number) => {
    const imageToRemove = eventImages[index];
    setEventImages(prev => prev.filter((_, i) => i !== index));
    // Add to removed images list if it's an existing image (not a new upload)
    if (!imageToRemove.startsWith('data:')) {
      setRemovedImages(prev => [...prev, imageToRemove]);
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
        if (value !== undefined && value !== null) {
          submitData.append(key, value.toString());
        }
      });

      // Add thumbnail (required)
      if (eventImagePreview) {
        submitData.append('thumbnail', eventImagePreview);
      }

      // Add eventImages (optional)
      if (eventImages && eventImages.length > 0) {
        // Clear any existing eventImages array
        submitData.delete('eventImages');
        // Add each image to the array
        eventImages.forEach(image => {
          submitData.append('eventImages', image);
        });
      }

      // Add removed images list
      if (removedImages.length > 0) {
        removedImages.forEach(image => {
          submitData.append('removedImages', image);
        });
      }

      console.log('Submitting form data:', {
        ...Object.fromEntries(submitData.entries()),
        thumbnail: eventImagePreview ? 'present' : 'missing',
        eventImages: eventImages.length,
        removedImages: removedImages.length
      });

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            placeholder="Enter event title in English..."
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
            placeholder="أدخل عنوان الحدث بالعربية..."
            dir="rtl"
            required
          />
        </div>
      </div>

      {/* Description Fields */}
      <div className="space-y-4">
        <div>
          <label className={`block mb-2 text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Description (English)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-indigo-500`}
            placeholder="Enter detailed event description in English..."
            required
          />
        </div>

        <div>
          <label className={`block mb-2 text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Description (Arabic)
          </label>
          <textarea
            value={formData.arabicDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, arabicDescription: e.target.value }))}
            rows={4}
            className={`w-full px-3 py-2 rounded-lg border text-right ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-indigo-500`}
            placeholder="أدخل وصفاً مفصلاً للحدث بالعربية..."
            dir="rtl"
            required
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block mb-2 text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Date
          </label>
          <div className="relative">
            <FiCalendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-indigo-500`}
              required
            />
          </div>
        </div>

        <div>
          <label className={`block mb-2 text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Time
          </label>
          <div className="relative">
            <FiClock className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-indigo-500`}
              placeholder="e.g., 9:00 AM - 1:00 PM"
              required
            />
          </div>
        </div>
      </div>

      {/* Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block mb-2 text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Location (English)
          </label>
          <div className="relative">
            <FiMapPin className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter event location (e.g., Main Campus, Room A101)..."
              required
            />
          </div>
        </div>

        <div>
          <label className={`block mb-2 text-sm font-medium ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Location (Arabic)
          </label>
          <div className="relative">
            <FiMapPin className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={formData.arabicLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, arabicLocation: e.target.value }))}
              className={`w-full pr-10 pl-3 py-2 rounded-lg border text-right ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-indigo-500`}
              placeholder="أدخل موقع الحدث (مثال: الحرم الرئيسي، قاعة أ١٠١)..."
              dir="rtl"
              required
            />
          </div>
        </div>
      </div>

      {/* Event Main Image Upload */}
      <div>
        <label className={`block mb-2 text-sm font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Event Main Image (Required)
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
                  Click to upload main event image
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleEventImageChange}
                required={!eventImagePreview}
              />
            </label>
          </div>

          {/* Main Image Preview */}
          {eventImagePreview && (
            <div className="relative group overflow-hidden rounded-lg">
              <img
                src={eventImagePreview}
                alt="Event main image preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
              <button
                type="button"
                onClick={() => setEventImagePreview(null)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Event Images Upload */}
      <div>
        <label className={`block mb-2 text-sm font-medium ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          Additional Event Images
        </label>
        <div className="space-y-4">
          {/* Existing Images */}
          {eventImages.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {eventImages.map((image, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt={`Event image ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                  <button
                    type="button"
                    onClick={() => removeEventImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 hover:bg-red-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload New Images */}
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
                  Click to upload additional event images
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleEventImagesChange}
                multiple
              />
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !eventImagePreview}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting 
            ? 'Saving...' 
            : mode === 'create' 
              ? 'Create Event' 
              : 'Update Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm; 