import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { publicFooterAPI } from '../api/public/footer';
import { useEffect, useState } from 'react';

interface SocialLink {
  _id: string;
  platform: string;
  url: string;
}

interface FooterData {
  description: string;
  arabicDescription: string;
  socialLinks: SocialLink[];
}

interface ContactValue {
  value: string;
  arabicValue: string;
}

interface ContactData {
  address: ContactValue;
  phone: ContactValue;
  officeHours: ContactValue;
}

const socialIcons: { [key: string]: JSX.Element } = {
  twitter: (
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  ),
  instagram: (
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  ),
  linkedin: (
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  ),
  youtube: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
  ),
  facebook: (
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  ),
  whatsapp: (
    <path fillRule="evenodd" d="M17.415 14.382c-.298-.149-1.759-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
  )
};

const Footer = () => {
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);

  const fetchData = async () => {
    const { footer, contact } = await publicFooterAPI.getFooter();
    console.log(footer);
    setFooterData(footer[0]);
    setContactData(contact[0]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <footer className="relative py-20 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-t ${
        isDarkMode 
          ? 'from-dark/90 via-dark/50 to-transparent' 
          : 'from-gray-100/90 via-gray-50/50 to-transparent'
      }`} />
      <div className="relative max-w-screen-xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-16 h-16"
              >
                <img 
                  src={isDarkMode ? "/dark.png" : "/zameel-logo.png"} 
                  alt="Logo" 
                  className="w-full h-full object-contain" 
                />
              </motion.div>
              <div>
                <h3 className={`text-2xl font-light ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ZAMEEL</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} arabic-text`}>
                  {isArabic ? "الأكاديمية العربية" : "Arabic Academy"}
                </p>
              </div>
            </div>
            <p className={`max-w-lg mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isArabic ? footerData?.arabicDescription : footerData?.description}
            </p>
            
            {/* Contact Information */}
            <div className="flex flex-wrap gap-6">
              <div className={`flex items-center space-x-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="max-w-[300px]">
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                    {isArabic ? contactData?.address?.arabicValue : contactData?.address?.value}
                  </p>
                </div>
              </div>

              <div className={`flex items-center space-x-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} 
                border-l ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} pl-6`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>
                    {contactData?.phone?.value}
                  </p>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {isArabic ? contactData?.officeHours?.arabicValue : contactData?.officeHours?.value}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className={`text-lg font-light mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isArabic ? "تواصل معنا" : "Connect With Us"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {footerData?.socialLinks?.map((link: SocialLink) => (
                <a 
                  key={link._id}
                  href={link.url} 
                  className={`flex items-center space-x-3 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                      : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50'
                  } p-2 rounded-lg transition-all duration-300`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {socialIcons[link.platform.toLowerCase()] || (
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    )}
                  </svg>
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={isDarkMode ? 'text-gray-500' : 'text-gray-600 text-center'}>
              {isArabic ? `© ${new Date().getFullYear()} أكاديمية زميل العربية. جميع الحقوق محفوظة.` : `© ${new Date().getFullYear()} Zameel Arabic Academy. All rights reserved.`}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="/privacy-policy" 
                className={`${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-indigo-500'
                } transition-colors`}
              >
                {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
              </a>
              <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <a 
                href="/terms-of-service" 
                className={`${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-indigo-500'
                } transition-colors`}
              >
                {isArabic ? "شروط الخدمة" : "Terms of Service"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 