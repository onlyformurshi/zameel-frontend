import { useState, useEffect } from "react";
import { useThemeStore } from "../../../store/themeStore";
import { ContactInfo, ContactDetail } from "../../../api/admin/types/contact";

interface ContactFormProps {
  onSubmit: (data: Partial<ContactInfo>) => void;
  onClose: () => void;
  initialData?: ContactInfo;
}

type ContactSection = 'address' | 'phone' | 'email' | 'officeHours';
type ContactDetailField = keyof ContactDetail;

const ContactForm = ({ onSubmit, onClose, initialData }: ContactFormProps) => {
  const { isDarkMode } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<ContactInfo>>({
    address: {
      label: "",
      value: "",
      arabicLabel: "",
      arabicValue: "",
    },
    phone: {
      label: "",
      value: "",
      arabicLabel: "",
      arabicValue: "",
    },
    email: {
      label: "",
      value: "",
      arabicLabel: "",
      arabicValue: "",
    },
    officeHours: {
      label: "",
      value: "",
      arabicLabel: "",
      arabicValue: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        address: initialData.address || {
          label: "",
          value: "",
          arabicLabel: "",
          arabicValue: "",
        },
        phone: initialData.phone || {
          label: "",
          value: "",
          arabicLabel: "",
          arabicValue: "",
        },
        email: initialData.email || {
          label: "",
          value: "",
          arabicLabel: "",
          arabicValue: "",
        },
        officeHours: initialData.officeHours || {
          label: "",
          value: "",
          arabicLabel: "",
          arabicValue: "",
        },
      });
    }
  }, [initialData]);

  const handleChange = (
    section: ContactSection,
    field: ContactDetailField,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as ContactDetail),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections: Array<{ key: ContactSection; title: string }> = [
    { key: "address", title: "Address" },
    { key: "phone", title: "Phone" },
    { key: "email", title: "Email" },
    { key: "officeHours", title: "Office Hours" },
  ];

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
      <div className="flex-1 overflow-y-auto">
        {sections.map(({ key, title }) => (
          <div key={key} className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>
              {title}
            </h3>

            {/* English Section */}
            <div className="space-y-4 mb-4">
              <div>
                <label className={labelClassName}>
                  English Label
                </label>
                <input
                  type="text"
                  value={(formData[key] as ContactDetail)?.label || ""}
                  onChange={(e) => handleChange(key, "label", e.target.value)}
                  className={inputClassName}
                  placeholder={`Enter ${title.toLowerCase()} label in English`}
                  required
                />
              </div>
              <div>
                <label className={labelClassName}>
                  English Value
                </label>
                <textarea
                  value={(formData[key] as ContactDetail)?.value || ""}
                  onChange={(e) => handleChange(key, "value", e.target.value)}
                  rows={2}
                  className={`${inputClassName} h-20 sm:h-24 text-[13px] sm:text-sm resize-none`}
                  placeholder={`Enter ${title.toLowerCase()} value in English`}
                  required
                />
              </div>
            </div>

            {/* Arabic Section */}
            <div className="space-y-4">
              <div>
                <label className={labelClassName}>
                  Arabic Label
                </label>
                <input
                  type="text"
                  value={(formData[key] as ContactDetail)?.arabicLabel || ""}
                  onChange={(e) => handleChange(key, "arabicLabel", e.target.value)}
                  className={`${inputClassName} text-right`}
                  placeholder={`Enter ${title.toLowerCase()} label in Arabic`}
                  dir="rtl"
                  required
                />
              </div>
              <div>
                <label className={labelClassName}>
                  Arabic Value
                </label>
                <textarea
                  value={(formData[key] as ContactDetail)?.arabicValue || ""}
                  onChange={(e) => handleChange(key, "arabicValue", e.target.value)}
                  rows={2}
                  className={`${inputClassName} h-20 sm:h-24 text-[13px] sm:text-sm resize-none text-right`}
                  placeholder={`Enter ${title.toLowerCase()} value in Arabic`}
                  dir="rtl"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="mt-6 sm:mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-[13px] sm:text-sm font-medium transition-colors duration-200 ${
            isDarkMode
              ? 'bg-[#1f2937] text-gray-300 hover:bg-[#2d3748]'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-[13px] sm:text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center space-x-2 ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-indigo-800'
          }`}
        >
          <span>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </span>
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
