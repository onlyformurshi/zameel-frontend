/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { FiEdit2, FiMapPin, FiPhone, FiMail, FiClock, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getContactInfo, createContactInfo, updateContactInfo } from '../../../api/admin/adminContact';
import { useToastStore } from '../../../store/toastStore';
import ContactForm from './ContactForm';
import { ContactInfo } from '../../../api/admin/types/contact';

const ContactPage = () => {
  const { isDarkMode } = useThemeStore();
  const { showToast } = useToastStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState<ContactInfo | null>(null);
  const [editingSection, setEditingSection] = useState<'whatsapp' | 'details' | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const data = await getContactInfo();
      setContactData(data);
      setWhatsappNumber(data?.whatsapp || '');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact data:', error);
      showToast('Failed to load contact information', 'error');
      setLoading(false);
    }
  };

  const handleWhatsappSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contactData?._id) {
      // If we have existing data, update WhatsApp directly
      try {
        // Only include the necessary fields, excluding MongoDB-specific fields
        const updateData = {
          address: contactData.address,
          phone: contactData.phone,
          email: contactData.email,
          officeHours: contactData.officeHours,
          whatsapp: whatsappNumber
        };
        
        const updatedData = await updateContactInfo(updateData);
        setContactData(updatedData);
        setEditingSection(null);
        showToast('WhatsApp number updated successfully', 'success');
      } catch (error) {
        console.error('Error updating WhatsApp number:', error);
        showToast('Failed to update WhatsApp number', 'error');
      }
    } else {
      // If no existing data, store temporarily
      setWhatsappNumber(whatsappNumber);
      setEditingSection(null);
      showToast('WhatsApp number saved temporarily. Submit the form to save all changes.', 'info');
    }
  };

  const handleFormSubmit = async (formData: Partial<ContactInfo>) => {
    try {
      // Include the whatsappNumber in the form submission
      const dataToSubmit = {
        ...formData,
        whatsapp: whatsappNumber // Include the stored WhatsApp number
      };

      const updatedData = contactData?._id 
        ? await updateContactInfo(dataToSubmit)
        : await createContactInfo(dataToSubmit as any);
      
      setContactData(updatedData);
      setIsSheetOpen(false);
      showToast('Contact information updated successfully', 'success');
    } catch (error) {
      console.error('Error saving contact data:', error);
      showToast('Failed to save contact information', 'error');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'address':
        return <FiMapPin className="w-5 h-5" />;
      case 'phone':
        return <FiPhone className="w-5 h-5" />;
      case 'email':
        return <FiMail className="w-5 h-5" />;
      case 'officeHours':
        return <FiClock className="w-5 h-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const contactSections = [
    { key: 'address', title: 'Address' },
    { key: 'phone', title: 'Phone' },
    { key: 'email', title: 'Email' },
    { key: 'officeHours', title: 'Office Hours' }
  ];

  // Update the WhatsApp button to always allow editing
  const WhatsappButton = () => (
    <button
      onClick={() => setEditingSection('whatsapp')}
      className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
    >
      {contactData?._id ? 'Edit Number' : 'Add Number'}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Contact Information
          </h2>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage contact details and WhatsApp number
          </p>
        </div>
      </div>

      {/* WhatsApp Section */}
      <div className={`p-6 rounded-xl ${
        isDarkMode 
          ? 'bg-[#141b2d] border border-gray-800' 
          : 'bg-white shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FaWhatsapp className="text-2xl text-green-500" />
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              WhatsApp Contact
            </h2>
          </div>
          {editingSection !== 'whatsapp' && <WhatsappButton />}
        </div>
        
        {editingSection === 'whatsapp' ? (
          <form onSubmit={handleWhatsappSubmit} className="flex items-center space-x-4">
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Enter WhatsApp number"
              className={`flex-1 px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-[#1f2937] border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingSection(null)}
              className={`px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              Cancel
            </button>
          </form>
        ) : (
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {contactData?.whatsapp || 'No WhatsApp number set'}
          </p>
        )}
      </div>

      {/* Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {contactSections.map(({ key, title }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-xl ${
              isDarkMode 
                ? 'bg-[#141b2d] border border-gray-800' 
                : 'bg-white shadow-sm'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#1f2937]' : 'bg-gray-100'}`}>
                    {getIcon(key)}
                  </span>
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    {title}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setEditingSection('details');
                    setIsSheetOpen(true);
                  }}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? 'hover:bg-gray-800 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
              </div>

              {contactData?.[key as keyof ContactInfo] ? (
                <div className="space-y-4">
                  <div>
                    <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {(contactData[key as keyof ContactInfo] as any).label}
                    </h3>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {(contactData[key as keyof ContactInfo] as any).value}
                    </p>
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {(contactData[key as keyof ContactInfo] as any).arabicLabel}
                    </h3>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} dir="rtl">
                      {(contactData[key as keyof ContactInfo] as any).arabicValue}
                    </p>
                  </div>
                </div>
              ) : (
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No information set
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Slide-out Sheet */}
      <AnimatePresence>
        {isSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className={`fixed right-0 top-0 h-full w-full max-w-[320px] sm:max-w-[360px] overflow-y-auto ${
                isDarkMode
                  ? 'bg-[#141b2d] border-l border-gray-800'
                  : 'bg-white'
              } shadow-xl z-50`}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 backdrop-blur-xl bg-white/80 dark:bg-[#141b2d]/80">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Edit Contact Information
                </h2>
                <button
                  onClick={() => setIsSheetOpen(false)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? 'hover:bg-gray-800 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4">
                <ContactForm
                  onSubmit={handleFormSubmit}
                  onClose={() => setIsSheetOpen(false)}
                  initialData={contactData || undefined}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactPage; 