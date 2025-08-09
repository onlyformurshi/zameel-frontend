import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';

const PrivacyPolicy = () => {
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();

  const sections = [
    {
      title: {
        en: "Information Collection and Use",
        ar: "جمع المعلومات واستخدامها"
      },
      content: {
        en: "We collect several different types of information for various purposes to provide and improve our service to you. While using our website, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you.",
        ar: "نقوم بجمع عدة أنواع مختلفة من المعلومات لأغراض مختلفة لتقديم وتحسين خدمتنا لك. أثناء استخدام موقعنا، قد نطلب منك تزويدنا بمعلومات شخصية معينة يمكن استخدامها للاتصال بك أو تحديد هويتك."
      }
    },
    {
      title: {
        en: "Log Data",
        ar: "بيانات السجل"
      },
      content: {
        en: "We collect information that your browser sends whenever you visit our website. This Log Data may include information such as your computer's Internet Protocol address, browser type, browser version, the pages of our website that you visit, the time and date of your visit, the time spent on those pages, and other statistics.",
        ar: "نقوم بجمع المعلومات التي يرسلها متصفحك عند زيارة موقعنا. قد تتضمن بيانات السجل هذه معلومات مثل عنوان بروتوكول الإنترنت لجهاز الكمبيوتر الخاص بك، ونوع المتصفح، وإصدار المتصفح، وصفحات موقعنا التي تزورها، ووقت وتاريخ زيارتك، والوقت المستغرق في تلك الصفحات، وإحصاءات أخرى."
      }
    },
    {
      title: {
        en: "Cookies",
        ar: "ملفات تعريف الارتباط"
      },
      content: {
        en: "We use cookies and similar tracking technologies to track the activity on our website and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.",
        ar: "نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتتبع النشاط على موقعنا والاحتفاظ بمعلومات معينة. ملفات تعريف الارتباط هي ملفات تحتوي على كمية صغيرة من البيانات التي قد تتضمن معرفًا فريدًا مجهول الهوية."
      }
    },
    {
      title: {
        en: "Security",
        ar: "الأمان"
      },
      content: {
        en: "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.",
        ar: "أمن بياناتك مهم بالنسبة لنا، ولكن تذكر أنه لا توجد طريقة نقل عبر الإنترنت أو طريقة تخزين إلكتروني آمنة بنسبة 100٪. في حين أننا نسعى جاهدين لاستخدام وسائل مقبولة تجاريًا لحماية معلوماتك الشخصية، لا يمكننا ضمان أمنها المطلق."
      }
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`py-20 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-indigo-500/10 to-purple-600/10' 
          : 'bg-gradient-to-br from-gray-100 to-gray-200'
      }`}>
        <div className="max-w-screen-xl mx-auto my-10 px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-4xl md:text-5xl font-light mb-6 text-center ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-center max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {isArabic 
              ? 'نحن نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية' 
              : 'We value your privacy and are committed to protecting your personal data'}
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="space-y-4"
              >
                <h2 className={`text-2xl font-light ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {isArabic ? section.title.ar : section.title.en}
                </h2>
                <div className={`p-6 rounded-xl ${
                  isDarkMode 
                    ? 'bg-white/5' 
                    : 'bg-gray-50'
                }`}>
                  <p className={`leading-relaxed ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {isArabic ? section.content.ar : section.content.en}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Last Updated Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: sections.length * 0.2 }}
              className={`mt-12 p-4 rounded-xl text-center ${
                isDarkMode 
                  ? 'bg-white/5 text-gray-400' 
                  : 'bg-gray-50 text-gray-500'
              }`}
            >
              <p className="text-sm">
                {isArabic 
                  ? 'آخر تحديث: يناير 2024' 
                  : 'Last updated: January 2024'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
