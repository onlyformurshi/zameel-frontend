import { useState, useEffect } from 'react';
import { useThemeStore } from '../../../store/themeStore';
import { FAQ, FAQCategory, CreateFAQDto } from '../../../api/admin/types/adminFAQ.types';
import { useToastStore } from '../../../store/toastStore';

interface FAQFormProps {
  initialData?: FAQ;
  onSubmit: (data: CreateFAQDto) => void;
  categories: FAQCategory[];
  onClose: () => void;
}

export const FAQForm = ({ initialData, onSubmit, categories, onClose }: FAQFormProps) => {
  const { isDarkMode } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useToastStore(state => state.showToast);

  const [formData, setFormData] = useState<CreateFAQDto>({
    question: '',
    arabicQuestion: '',
    answer: '',
    arabicAnswer: '',
    category: categories.length > 0 ? categories[0]._id : '',
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        question: initialData.question,
        arabicQuestion: initialData.arabicQuestion,
        answer: initialData.answer,
        arabicAnswer: initialData.arabicAnswer,
        category: initialData.category._id,
        order: initialData.order || 0,
      });
    } else if (categories.length > 0) {
      setFormData(prev => ({
        ...prev,
        category: categories[0]._id
      }));
    }
  }, [initialData, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.question || !formData.arabicQuestion || !formData.answer || 
        !formData.arabicAnswer || !formData.category) {
      showToast('All fields are required', 'error');
      return;
    }

    if (!categories.some(cat => cat._id === formData.category)) {
      showToast('Invalid category selected', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting FAQ:', error);
      showToast('Failed to submit FAQ', 'error');
      setIsSubmitting(false);
    }
  };

  const inputClassName = `w-full px-3 py-2 rounded-lg border ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700 text-white'
      : 'bg-white border-gray-300 text-gray-900'
  } focus:ring-2 focus:ring-indigo-500`;

  const labelClassName = `block text-sm font-medium mb-1 ${
    isDarkMode ? 'text-gray-200' : 'text-gray-700'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question Fields */}
      <div className="space-y-4">
        <div>
          <label className={labelClassName}>
            Question (English)
          </label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
            className={inputClassName}
            placeholder="Enter the question in English..."
            required
          />
        </div>

        <div>
          <label className={labelClassName}>
            Question (Arabic)
          </label>
          <input
            type="text"
            value={formData.arabicQuestion}
            onChange={(e) => setFormData(prev => ({ ...prev, arabicQuestion: e.target.value }))}
            className={`${inputClassName} text-right`}
            placeholder="أدخل السؤال بالعربية..."
            dir="rtl"
            required
          />
        </div>
      </div>

      {/* Answer Fields */}
      <div className="space-y-4">
        <div>
          <label className={labelClassName}>
            Answer (English)
          </label>
          <textarea
            value={formData.answer}
            onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
            rows={4}
            className={inputClassName}
            placeholder="Enter the answer in English..."
            required
          />
        </div>

        <div>
          <label className={labelClassName}>
            Answer (Arabic)
          </label>
          <textarea
            value={formData.arabicAnswer}
            onChange={(e) => setFormData(prev => ({ ...prev, arabicAnswer: e.target.value }))}
            rows={4}
            className={`${inputClassName} text-right`}
            placeholder="أدخل الإجابة بالعربية..."
            dir="rtl"
            required
          />
        </div>
      </div>

      {/* Category Field */}
      <div>
        <label className={labelClassName}>
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className={inputClassName}
          required
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name} - {category.arabicName}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2 rounded-lg border ${
            isDarkMode
              ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting 
            ? 'Saving...' 
            : initialData 
              ? 'Update FAQ' 
              : 'Create FAQ'}
        </button>
      </div>
    </form>
  );
}; 