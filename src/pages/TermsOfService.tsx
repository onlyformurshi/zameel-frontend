import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';

const TermsOfService = () => {
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();

  const sections = [
    {
      title: {
        en: "Acceptance of Terms",
        ar: "قبول الشروط"
      },
      content: {
        en: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
        ar: "من خلال الوصول إلى هذا الموقع واستخدامه، فإنك تقبل وتوافق على الالتزام بشروط وأحكام هذه الاتفاقية. إذا كنت لا توافق على الالتزام بما ورد أعلاه، فيرجى عدم استخدام هذه الخدمة."
      }
    },
    {
      title: {
        en: "Use License",
        ar: "ترخيص الاستخدام"
      },
      content: {
        en: "Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.",
        ar: "يُمنح الإذن مؤقتًا لتنزيل نسخة واحدة من المواد (المعلومات أو البرامج) على موقعنا للعرض العابر الشخصي وغير التجاري فقط. هذا منح ترخيص، وليس نقل ملكية."
      }
    },
    {
      title: {
        en: "Disclaimer",
        ar: "إخلاء المسؤولية"
      },
      content: {
        en: "The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.",
        ar: "يتم توفير المواد على موقعنا على أساس 'كما هي'. نحن لا نقدم أي ضمانات، صريحة أو ضمنية، وبموجب هذا نخلي ونلغي جميع الضمانات الأخرى بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية أو شروط الرواج، والملاءمة لغرض معين، أو عدم انتهاك الملكية الفكرية."
      }
    },
    {
      title: {
        en: "Limitations",
        ar: "القيود"
      },
      content: {
        en: "In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.",
        ar: "لن نكون نحن أو موردونا مسؤولين بأي حال من الأحوال عن أي أضرار (بما في ذلك، على سبيل المثال لا الحصر، الأضرار الناتجة عن فقدان البيانات أو الربح، أو بسبب تعطل الأعمال) الناشئة عن استخدام أو عدم القدرة على استخدام المواد على موقعنا."
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
            {isArabic ? 'شروط الخدمة' : 'Terms of Service'}
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
              ? 'يرجى قراءة هذه الشروط بعناية قبل استخدام موقعنا' 
              : 'Please read these terms carefully before using our website'}
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

export default TermsOfService;
