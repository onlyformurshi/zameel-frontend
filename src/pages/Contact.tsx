/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { publicContactAPI } from '../api/public/contact';
import { useToastStore } from '../store/toastStore';

// Update translations to use dynamic data
const getTranslations = (contactData: any) => ({
  en: {
    pageTitle: "Get in Touch",
    pageSubtitle: "Have questions about our educational programs? We're here to help you on your learning journey.",
    contactInfo: {
      title: "Contact Information",
      visitUs: contactData?.address?.label || "Visit Us",
      address: {
        line1: contactData?.address?.value || "",
      },
      callUs: contactData?.phone?.label || "Call Us",
      emailUs: contactData?.email?.label || "Email Us",
      officeHours: contactData?.officeHours?.label || "Office Hours",
      workingDays: contactData?.officeHours?.value || "",
    },
    quickContact: {
      title: "Quick Contact",
      whatsapp: "Chat with us on WhatsApp"
    },
    form: {
      title: "Send us a Message",
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      submit: "Send Message"
    }
  },
  ar: {
    pageTitle: "تواصل معنا",
    pageSubtitle: "هل لديك أسئلة حول برامجنا التعليمية؟ نحن هنا لمساعدتك في رحلتك التعليمية.",
    contactInfo: {
      title: "معلومات الاتصال",
      visitUs: contactData?.address?.arabicLabel || "زورونا",
      address: {
        line1: contactData?.address?.arabicValue || "",
      },
      callUs: contactData?.phone?.arabicLabel || "اتصل بنا",
      emailUs: contactData?.email?.arabicLabel || "راسلنا",
      officeHours: contactData?.officeHours?.arabicLabel || "ساعات العمل",
      workingDays: contactData?.officeHours?.arabicValue || "",
    },
    quickContact: {
      title: "اتصال سريع",
      whatsapp: "تحدث معنا على واتساب"
    },
    form: {
      title: "أرسل لنا رسالة",
      name: "الاسم",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "الرسالة",
      submit: "إرسال الرسالة"
    }
  }
});

const Contact = () => {
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const [contactData, setContactData] = useState<any>(null);
  const t = isArabic ? getTranslations(contactData).ar : getTranslations(contactData).en;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const showToast = useToastStore(state => state.showToast);

  const fetchContact = async () => {
    try {
      const response = await publicContactAPI.getAllContact();
      if (response && response.length > 0) {
        setContactData(response[0]);
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Add your API call here to send the message
      // await yourAPI.sendMessage(formData);
      
      // Show success toast
      showToast('Thank you for your message! We will get back to you soon.', 'success');
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      // Show error toast
      showToast('Failed to send message. Please try again.', 'error');
      console.error('Error sending message:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            {t.pageTitle}
          </h1>
          <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.pageSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className={`glass-card p-8 rounded-xl border ${
              isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600`}>
                {t.contactInfo.title}
              </h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
                  }`}>
                    <FaMapMarkerAlt className={`w-6 h-6 ${
                      isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {t.contactInfo.visitUs}
                    </p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {t.contactInfo.address.line1}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
                  }`}>
                    <FaPhone className={`w-6 h-6 ${
                      isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {t.contactInfo.callUs}
                    </p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {contactData?.phone?.value || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
                  }`}>
                    <FaEnvelope className={`w-6 h-6 ${
                      isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {t.contactInfo.emailUs}
                    </p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {contactData?.email?.value || ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
                  }`}>
                    <FaClock className={`w-6 h-6 ${
                      isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {t.contactInfo.officeHours}
                    </p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {t.contactInfo.workingDays}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className={`glass-card p-8 rounded-xl border ${
              isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600`}>
                {t.quickContact.title}
              </h2>
              <a
                href={`https://wa.me/${contactData?.whatsapp?.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-6 py-4 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <FaWhatsapp className="w-6 h-6" />
                <span>{t.quickContact.whatsapp}</span>
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`glass-card p-8 rounded-xl border ${
              isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
            }`}
          >
            <h2 className={`text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600`}>
              {t.form.title}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>{t.form.name}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 text-white focus:border-indigo-500' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-300`}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className={`block font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>{t.form.email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 text-white focus:border-indigo-500' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-300`}
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className={`block font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>{t.form.subject}</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 text-white focus:border-indigo-500' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-300`}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className={`block font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>{t.form.message}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 text-white focus:border-indigo-500' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-300`}
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                {t.form.submit}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 