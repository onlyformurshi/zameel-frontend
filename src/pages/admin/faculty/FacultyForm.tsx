import { useState, useEffect } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import { FaTimes } from 'react-icons/fa';
import { Faculty } from '../../../api/admin/types/adminFaculty.types';

interface FacultyFormProps {
  faculty?: Faculty;
  onSubmit: (formData: FormData) => void;
  mode: 'create' | 'edit' | 'view';
}

const FacultyForm = ({ faculty, onSubmit, mode }: FacultyFormProps) => {
  const { isDarkMode } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newArabicSpecialization, setNewArabicSpecialization] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    arabicName: '',
    position: '',
    arabicPosition: '',
    specialization: [] as string[],
    arabicSpecialization: [] as string[],
    bio: '',
    arabicBio: '',
    email: '',
    socialLinks: {
      linkedin: '',
    },
    isLeadershipTeam: 'false' as string
  });

  useEffect(() => {
    if (faculty) {
      setFormData({
        name: faculty.name,
        arabicName: faculty.arabicName,
        position: faculty.position,
        arabicPosition: faculty.arabicPosition,
        specialization: faculty.specialization,
        arabicSpecialization: faculty.arabicSpecialization,
        bio: faculty.bio,
        arabicBio: faculty.arabicBio,
        email: faculty.email,
        socialLinks: {
          linkedin: faculty.socialLinks?.linkedin || '',
        },
        isLeadershipTeam: faculty.isLeadershipTeam === 'true' ? 'true' : 'false',
      });
      setImagePreview(faculty.image);
    }
  }, [faculty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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

  const handleAddSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData(prev => ({
        ...prev,
        specialization: [...prev.specialization, newSpecialization.trim()],
      }));
      setNewSpecialization('');
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.filter((_, i) => i !== index),
    }));
  };

  const handleAddArabicSpecialization = () => {
    if (newArabicSpecialization.trim()) {
      setFormData(prev => ({
        ...prev,
        arabicSpecialization: [...prev.arabicSpecialization, newArabicSpecialization.trim()],
      }));
      setNewArabicSpecialization('');
    }
  };

  const handleRemoveArabicSpecialization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      arabicSpecialization: prev.arabicSpecialization.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const submitData = new FormData();

      // Add all form fields except socialLinks
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'socialLinks') {
          // Handle socialLinks separately
          Object.entries(value).forEach(([socialKey, socialValue]) => {
            if (socialValue) {
              submitData.append(`socialLinks[${socialKey}]`, socialValue);
            }
          });
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            submitData.append(`${key}[${index}]`, item);
          });
        } else {
          submitData.append(key, value.toString());
        }
      });

      // Add image as base64 string
      if (imagePreview) {
        submitData.append('image', imagePreview);
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeadershipToggle = () => {
    const newValue = formData.isLeadershipTeam === 'true' ? 'false' : 'true';
    setFormData({...formData, isLeadershipTeam: newValue});
    console.log('Toggled isLeadershipTeam:', newValue);
  };

  const inputClassName = `w-full px-3 py-2 rounded-lg border ${
    isDarkMode
      ? 'bg-[#1f2937] border-gray-700 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  } focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  const labelClassName = `block text-sm font-medium mb-1 ${
    isDarkMode ? 'text-gray-200' : 'text-gray-700'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label htmlFor="image" className={labelClassName}>Faculty Image</label>
        <div className="space-y-2">
          {imagePreview && (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
              {mode !== 'view' && (
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
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
              onChange={handleImageChange}
              className={inputClassName}
              accept="image/*"
              required={!imagePreview} // Required only if no image exists
            />
          )}
        </div>
      </div>

      {/* Leadership Team Toggle - Add this right after the image upload */}
      <div className="flex items-center justify-between">
        <label htmlFor="isLeadershipTeam" className={`${labelClassName} inline-flex items-center`}>
          Leadership Team Member
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={formData.isLeadershipTeam === 'true'}
          onClick={handleLeadershipToggle}
          className={`${
            formData.isLeadershipTeam === 'true' ? 'bg-indigo-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
            mode === 'view' ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={mode === 'view'}
        >
          <span
            aria-hidden="true"
            className={`${
              formData.isLeadershipTeam === 'true' ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className={labelClassName}>Name (English)</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClassName}
            required
            disabled={mode === 'view'}
          />
        </div>

        {/* Arabic Name */}
        <div>
          <label htmlFor="arabicName" className={labelClassName}>Name (Arabic)</label>
          <input
            type="text"
            id="arabicName"
            name="arabicName"
            value={formData.arabicName}
            onChange={handleChange}
            className={`${inputClassName} text-right`}
            required
            disabled={mode === 'view'}
            dir="rtl"
          />
        </div>

        {/* Position */}
        <div>
          <label htmlFor="position" className={labelClassName}>Position (English)</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={inputClassName}
            required
            disabled={mode === 'view'}
          />
        </div>

        {/* Arabic Position */}
        <div>
          <label htmlFor="arabicPosition" className={labelClassName}>Position (Arabic)</label>
          <input
            type="text"
            id="arabicPosition"
            name="arabicPosition"
            value={formData.arabicPosition}
            onChange={handleChange}
            className={`${inputClassName} text-right`}
            required
            disabled={mode === 'view'}
            dir="rtl"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClassName}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClassName}
            required
            disabled={mode === 'view'}
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label htmlFor="linkedin" className={labelClassName}>LinkedIn Profile</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.socialLinks.linkedin}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              socialLinks: {
                ...prev.socialLinks,
                linkedin: e.target.value
              }
            }))}
            className={inputClassName}
            disabled={mode === 'view'}
          />
        </div>
      </div>

      {/* Specialization */}
      <div>
        <label className={labelClassName}>Specialization (English)</label>
        <div className="space-y-2">
          {mode !== 'view' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                className={inputClassName}
                placeholder="Add specialization"
              />
              <button
                type="button"
                onClick={handleAddSpecialization}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {formData.specialization.map((spec, index) => (
              <div key={index} className={`flex items-center gap-1 px-2 py-1 rounded ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <span>{spec}</span>
                {mode !== 'view' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialization(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arabic Specialization */}
      <div>
        <label className={labelClassName}>Specialization (Arabic)</label>
        <div className="space-y-2">
          {mode !== 'view' && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newArabicSpecialization}
                onChange={(e) => setNewArabicSpecialization(e.target.value)}
                className={`${inputClassName} text-right`}
                placeholder="أضف تخصصاً"
                dir="rtl"
              />
              <button
                type="button"
                onClick={handleAddArabicSpecialization}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {formData.arabicSpecialization.map((spec, index) => (
              <div key={index} className={`flex items-center gap-1 px-2 py-1 rounded ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <span className="text-right">{spec}</span>
                {mode !== 'view' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveArabicSpecialization(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className={labelClassName}>Bio (English)</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className={`${inputClassName} h-24`}
          required
          disabled={mode === 'view'}
        />
      </div>

      {/* Arabic Bio */}
      <div>
        <label htmlFor="arabicBio" className={labelClassName}>Bio (Arabic)</label>
        <textarea
          id="arabicBio"
          name="arabicBio"
          value={formData.arabicBio}
          onChange={handleChange}
          className={`${inputClassName} h-24 text-right`}
          required
          disabled={mode === 'view'}
          dir="rtl"
        />
      </div>

      {mode !== 'view' && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting 
              ? 'Saving...' 
              : mode === 'create' 
                ? 'Create Faculty' 
                : 'Update Faculty'}
          </button>
        </div>
      )}
    </form>
  );
};

export default FacultyForm;
