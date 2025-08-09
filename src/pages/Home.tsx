import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useThemeStore } from "../store/themeStore";
import { useLanguageStore } from "../store/languageStore";
import LocalizedButton from "../components/LocalizedButton";
import { publicHomeAPI } from "../api/public/home";
import { Dialog } from "@headlessui/react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface HomePageData {
  heroSection: {
    _id: string;
    title: string;
    arabicTitle: string;
    subtitle: string;
    arabicSubtitle: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  } | null;
  whyChooseUs: Array<{
    _id: string;
    title: string;
    arabicTitle: string;
    description: string;
    arabicDescription: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  latestCourses: Array<{
    _id: string;
    title: string;
    arabicTitle: string;
    description: string;
    arabicDescription: string;
    level: string;
    arabicLevel: string;
    duration: string;
    arabicDuration: string;
    schedule: string;
    arabicSchedule: string;
    features: string[];
    arabicFeatures: string[];
    image: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  upcomingEvents: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    description_ar: string;
    category: string;
    images: string[];
  }>;
  galleryImages: Array<{
    _id: string;
    title: string;
    arabicTitle: string;
    image: string; // base64 string
    category: string;
    arabicCategory: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
}

const featureIcons: { [key: string]: string } = {
  "Expert Instructors": "🏆",
  "Global Recognition": "⭐",
  "Modern Learning": "💻",
  "Diverse Programs": "📚",
  "Industry Connections": "🤝",
  "Practical Experience": "🎯",
};

const getFeatureIcon = (title: string): string => {
  // First check our exact mapping
  if (featureIcons[title]) {
    return featureIcons[title];
  }

  // If no exact match, check for keywords in the title
  const titleLower = title.toLowerCase();
  if (titleLower.includes("expert") || titleLower.includes("instructor"))
    return "👨‍🏫";
  if (titleLower.includes("global") || titleLower.includes("recognition"))
    return "🌟";
  if (titleLower.includes("modern") || titleLower.includes("technology"))
    return "💻";
  if (titleLower.includes("program") || titleLower.includes("course"))
    return "📚";
  if (titleLower.includes("industry") || titleLower.includes("connection"))
    return "🤝";
  if (titleLower.includes("practical") || titleLower.includes("experience"))
    return "🎯";
  if (titleLower.includes("quality") || titleLower.includes("standard"))
    return "✨";
  if (titleLower.includes("support") || titleLower.includes("help"))
    return "🤲";
  if (titleLower.includes("career") || titleLower.includes("job")) return "💼";
  if (titleLower.includes("certificate") || titleLower.includes("degree"))
    return "🎓";

  // Default icons array for random selection if no keyword matches
  const defaultIcons = [
    "🌟",
    "💫",
    "✨",
    "🎯",
    "💡",
    "🎨",
    "📈",
    "🌍",
    "🔥",
    "⭐",
  ];
  return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
};

const staticReviews = [
  {
    _id: "1",
    name: "Muhammed Ashraf K",
    description:
      "മറ്റു ഓൺലൈൻ ക്ലാസ്സുകളിൽ നിന്നും വ്യത്യസ്തമായി, അധ്യാപകരുടെ ആത്മാർത്ഥതയും സമയ ബന്ധിതവുമായ ഇടപെടലുകലും Zameel Academy എന്ന ഈ  വിദ്യാഭ്യാസ സ്ഥാപനത്തെ മുന്നോട്ടു നയിച്ചു എന്ന് ഞാൻ മനസിലാക്കുന്നു.  അതിലുപരിയായി ഈ സ്ഥാപനത്തിന്റെ മാനേജ്‌മെന്റിന്റെ അർപ്പണബോധവും നിശ്ചയ ദാർഢ്യവും ഇതിന്റെ വളർച്ചയിൽ നിർണായക പങ്ക് വഹിച്ചിട്ടുണ്ട് എന്നുള്ളത്  എന്റെ അനുഭവ സാക്ഷ്യമാണ്. വിദ്യാർത്ഥികളുടെ അറബി ഭാഷയോടുള്ള ആഭിമുഖ്യവും ഖുർആനിന്റെ ഭാഷ അറബി ഭാഷയാണെന്നുള്ള തിരിച്ചറിവും അവരുടെ ആത്മീയവബോധവും ഞാനുൾപ്പെടെയുള്ള ഈ ബാച്ചിന്റെ strength വർധിപ്പിച്ചു എന്നതാണ് വാസ്തവം. അതുപോലെതന്നെ  കുട്ടികളുടെ വിദ്യാഭ്യാസ പുരോഗതിയിൽ രക്ഷിതാക്കളുടെ താല്പര്യവും അവരുടെ അകമഴിഞ്ഞ സഹകരണവും ഈ യാത്രയെ മുന്നോട്ടു നയിക്കാൻ സഹായക മായിട്ടുണ്ട്. എന്നാൽ, വ്യത്യസ്ത വീക്ഷണ ചിന്താഗതികളും ആദർശങ്ങളും വെച്ചു പുലർത്തുന്നവരും സമൂഹത്തിന്റെ വിവിധ തലങ്ങളിൽ നിന്നുള്ളവരുമായ എല്ലാ വിദ്യാർത്ഥികളെയും ഏകോപിപ്പിച്ചു മുന്നോട്ടു കൊണ്ടു പോകാൻ കഴിയുന്നതിലാണ് ഈ അക്കാദമി യുടെ വിജയം നില കൊള്ളുന്നത്. അങ്ങിനെ  വ്യത്യസ്ത ചിന്താ ധാരകളെ സമന്വയിപ്പിച്ചും വിദ്യാഭ്യാസ  രംഗത്ത് നിലനിൽക്കുന്ന അനിശ്ചിതത്തെ ഇല്ലായ്മ ചെയ്‌തും പുതിയ കാലഘട്ടത്തിന്റെ ഉൾ തുടിപ്പുകൾ തൊട്ടറിഞ്ഞും   പുതിയൊരു വിദ്യാഭ്യാസ പ്രക്രിയക്ക് തുടക്കം കുറിക്കാൻ Zameel അക്കാദമിക്ക് സാധ്യമാകട്ടെ എന്ന് ഞാൻ ആശംസിക്കുന്നു.",
    date: "2024-03-20",
  },
  {
    _id: "1",
    name: "Salam Muhammed",
    description: "Their short-term courses helped us a lot. Highly recommended",
    date: "2024-03-15",
  },
  {
    _id: "2",
    name: "Arshila Jabin",
    description:
      "By my own experience it is very useful to me & I feel very good",
    date: "2024-03-10",
  },
  {
    _id: "3",
    name: "Hamna Mansoor",
    description: "Very useful and beneficial classes",
    date: "2024-03-05",
  },
  {
    _id: "4",
    name: "Fayisa",
    description:
      "Masha Allah.... Highly dedicated teachers especially Mubeenul Haqq sir.... It's a best academy to enrich Arab scholars......",
    date: "2024-03-01",
  },
  {
    _id: "5",
    name: "JASIR T.P",
    description: "An ideal center for those who want to master Arabic",
    date: "2024-02-28",
  },
  {
    _id: "6",
    name: "RAHEEMA MS",
    description:
      "I was very scared about how to write the exam but this class gave me self confidence to write the exam without fear even though it took some time..... Thank you mubeen sir",
    date: "2024-02-25",
  },
  {
    _id: "7",
    name: "Jubi Rahmankt",
    description:
      "I recently started a language course at ZAMEEL ACADEMY and I'm extremely satisfied with the experience! The instructors were knowledgeable, supportive, and made learning fun. The curriculum was well-structured and tailored to my needs. I saw significant improvement in my language skills and confidence.",
    date: "2024-02-20",
  },
  {
    _id: "8",
    name: "الحمدلله",
    description:
      "كان برنامج أمس جميل جدا ومميز ذا فوائد عظيمة. حقاً لا أعرف أي أكاديمية تقدم مثل هذه المميزات العظيمة بدون مقابل مادي. الشكر الجزيل موصول لكل الأساتذة والمعلمين وشكر خاص للأستاذ مبين الجاهز لكل شيء من أجل مصلحتنا. أسأل الله ان يبارك في عمره وعمله وعلمه. كان الاستاذ شعيب جاهز لإعطائنا المزيد ولكن لضيق الوقت بسبب تأخرنا نحن الطلبة استأذن الكثير من الطلبة للمغادرة باذن الله سوف ناتي مبكرا مرة اخرى",
    date: "2024-02-15",
  },
];

const Home = () => {
  const containerRef = useRef(null);
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const [homeData, setHomeData] = useState<HomePageData>({
    heroSection: null,
    whyChooseUs: [],
    latestCourses: [],
    upcomingEvents: [],
    galleryImages: [],
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [selectedProgramme, setSelectedProgramme] = useState<
    (typeof homeData.latestCourses)[0] | null
  >(null);
  const [selectedFeature, setSelectedFeature] = useState<
    (typeof homeData.whyChooseUs)[0] | null
  >(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [, setIsLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<(typeof staticReviews)[0] | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const checkScrollable = () => {
    if (modalContentRef.current) {
      const { scrollHeight, clientHeight } = modalContentRef.current;
      setIsScrollable(scrollHeight > clientHeight);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await publicHomeAPI.getHomePageData();
        setHomeData((prevData) => ({
          ...prevData,
          ...response.data,
        }));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedReview) {
      checkScrollable();
      // Also check after a short delay to account for dynamic content
      const timer = setTimeout(checkScrollable, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedReview]);

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  useEffect(() => {
    if (selectedProgramme) {
      checkScrollable();
      // Also check after a short delay to account for dynamic content
      const timer = setTimeout(checkScrollable, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedProgramme]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className={`absolute inset-0 ${
              isDarkMode
                ? "bg-gradient-to-b from-indigo-500/10 to-purple-600/10"
                : "bg-gradient-to-b from-gray-200/50 to-gray-300/50"
            } mix-blend-overlay`}
          />
        </motion.div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-8 text-center">
          {homeData.heroSection && (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-7xl md:text-8xl font-bold mb-8"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                  {isArabic
                    ? homeData.heroSection.arabicTitle
                    : homeData.heroSection.title}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`text-lg md:text-xl max-w-2xl mx-auto mb-12 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {isArabic
                  ? homeData.heroSection.arabicSubtitle
                  : homeData.heroSection.subtitle}
              </motion.p>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-y-10 sm:flex-row justify-center"
          >
            <div className="mb-4 sm:mb-0 sm:mr-3">
              <LocalizedButton
                to="/courses"
                englishText="Explore Programs"
                arabicText="استكشف البرامج"
                variant="primary"
              />
            </div>
            <div>
              <LocalizedButton
                to="/about"
                englishText="Learn More"
                arabicText="اعرف المزيد"
                variant="secondary"
              />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className={`w-6 h-10 rounded-full flex justify-center ${
              isDarkMode
                ? "border-2 border-white/20"
                : "border-2 border-gray-300"
            }`}
          >
            <motion.div
              animate={{ height: ["0%", "30%", "0%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-1 rounded-full mt-2 ${
                isDarkMode ? "bg-white/50" : "bg-gray-400"
              }`}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-screen-xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`text-3xl md:text-5xl font-light mb-12 tracking-wider text-center ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {isArabic
              ? "لماذا تختار أكاديمية زميل؟"
              : "Why Choose Zameel Academy?"}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {homeData.whyChooseUs.map((feature, index) => (
              <motion.div
                key={feature._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                onClick={() => setSelectedFeature(feature)}
                className={`group relative p-8 rounded-2xl transition-colors duration-500 cursor-pointer h-[200px] ${
                  isDarkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 
                  group-hover:opacity-100 transition-opacity duration-500 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-indigo-500/20 to-purple-600/20"
                      : "bg-gradient-to-br from-gray-100 to-gray-200"
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">
                      {getFeatureIcon(feature.title)}
                    </div>
                    <h3
                      className={`text-2xl font-light ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {isArabic ? feature.arabicTitle : feature.title}
                    </h3>
                  </div>
                  <p
                    className={`line-clamp-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {isArabic ? feature.arabicDescription : feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Modal */}
        <Dialog
          open={selectedFeature !== null}
          onClose={() => setSelectedFeature(null)}
          className="relative z-[999]"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[997]"
            aria-hidden="true"
            onClick={() => setSelectedFeature(null)}
          />

          <div className="fixed inset-0 flex items-center justify-center p-4 z-[998]">
            <Dialog.Panel
              className={`w-full max-w-2xl rounded-2xl transform transition-all ${
                isDarkMode
                  ? "bg-[#1F1F2E] border border-white/10"
                  : "bg-white shadow-xl"
              }`}
            >
              {selectedFeature && (
                <>
                  <div
                    className={`p-8 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-indigo-500/10 to-purple-600/10"
                        : "bg-gradient-to-br from-gray-50 to-gray-100"
                    } rounded-t-2xl border-b ${
                      isDarkMode ? "border-white/10" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div
                          className={`text-5xl p-4 rounded-xl ${
                            isDarkMode ? "bg-white/5" : "bg-white shadow-sm"
                          }`}
                        >
                          {getFeatureIcon(selectedFeature.title)}
                        </div>
                        <div>
                          <Dialog.Title
                            className={`text-2xl font-semibold mb-2 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {isArabic
                              ? selectedFeature.arabicTitle
                              : selectedFeature.title}
                          </Dialog.Title>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {isArabic
                              ? "تعرف على المزيد"
                              : "Learn more about this feature"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFeature(null)}
                        className={`p-2 rounded-full transition-colors ${
                          isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 ${
                            isDarkMode ? "text-white" : "text-gray-500"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-8">
                    <div
                      className={`prose max-w-none ${
                        isDarkMode
                          ? "prose-invert text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      <p className="text-lg leading-relaxed">
                        {isArabic
                          ? selectedFeature.arabicDescription
                          : selectedFeature.description}
                      </p>
                    </div>

                    <div
                      className={`mt-8 p-4 rounded-xl ${
                        isDarkMode ? "bg-white/5" : "bg-gray-50"
                      }`}
                    >
                      <h4
                        className={`text-sm font-semibold mb-2 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {isArabic ? "ملاحظة مهمة" : "Key Highlight"}
                      </h4>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {isArabic
                          ? "نحن نسعى دائماً لتقديم أفضل تجربة تعليمية لطلابنا"
                          : "We are committed to providing the best learning experience for our students"}
                      </p>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                      <button
                        onClick={() => setSelectedFeature(null)}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                          isDarkMode
                            ? "bg-white/10 hover:bg-white/20 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                        }`}
                      >
                        {isArabic ? "إغلاق" : "Close"}
                      </button>
                      <Link
                        to="/about"
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                      >
                        {isArabic ? "اعرف المزيد" : "Learn More"}
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </section>

      {/* Latest Programmes Section */}
      <section className="py-20 relative">
        <div className="max-w-screen-xl mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className={`text-3xl md:text-5xl font-light mb-12 tracking-wider text-center ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {isArabic ? "البرامج المميزة" : "Featured Programmes"}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {homeData.latestCourses.map((programme, index) => (
              <motion.div
                key={programme._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                onClick={() => setSelectedProgramme(programme)}
                className={`group relative p-8 rounded-2xl transition-colors duration-500 cursor-pointer ${
                  isDarkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 
                  group-hover:opacity-100 transition-opacity duration-500 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-indigo-500/20 to-purple-600/20"
                      : "bg-gradient-to-br from-gray-100 to-gray-200"
                  }`}
                />

                <div className="relative z-10">
                  <h3
                    className={`text-2xl font-semibold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {isArabic ? programme.arabicTitle : programme.title}
                  </h3>
                  <p
                    className={`mb-6 line-clamp-3 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {isArabic
                      ? programme.arabicDescription
                      : programme.description}
                  </p>
                  <div
                    className={`flex items-center text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>
                      {isArabic ? programme.arabicDuration : programme.duration}
                    </span>
                    <span className="mx-2">·</span>
                    <span>
                      {isArabic ? programme.arabicSchedule : programme.schedule}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Programme Modal */}
          <Dialog
            open={selectedProgramme !== null}
            onClose={() => setSelectedProgramme(null)}
            className="relative z-[999]"
          >
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[997]"
              aria-hidden="true"
              onClick={() => setSelectedProgramme(null)}
            />

            <div className="fixed inset-0 flex items-center justify-center p-4 z-[998]">
              <Dialog.Panel
                className={`w-full max-w-2xl rounded-2xl transform transition-all max-h-[90vh] relative ${
                  isDarkMode
                    ? "bg-[#1F1F2E] border border-white/10"
                    : "bg-white shadow-xl"
                }`}
              >
                {selectedProgramme && (
                  <>
                    <div
                      ref={modalRef}
                      onScroll={checkScrollable}
                      className="p-6 sm:p-8 overflow-y-auto scrollbar-hide max-h-[calc(80vh-80px)]"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <Dialog.Title
                          className={`text-2xl font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {isArabic
                            ? selectedProgramme.arabicTitle
                            : selectedProgramme.title}
                        </Dialog.Title>
                        <button
                          onClick={() => setSelectedProgramme(null)}
                          className={`p-2 rounded-full transition-colors ${
                            isDarkMode
                              ? "hover:bg-white/10"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`w-5 h-5 ${
                              isDarkMode ? "text-white" : "text-gray-500"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div
                        className={`mb-8 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {isArabic
                          ? selectedProgramme.arabicDescription
                          : selectedProgramme.description}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                          className={`p-4 rounded-xl ${
                            isDarkMode ? "bg-white/5" : "bg-gray-50"
                          }`}
                        >
                          <h4
                            className={`text-sm font-semibold mb-2 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {isArabic ? "تفاصيل البرنامج" : "Programme Details"}
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span
                                className={
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {isArabic ? "المدة" : "Duration"}
                              </span>
                              <span
                                className={
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }
                              >
                                {isArabic
                                  ? selectedProgramme.arabicDuration
                                  : selectedProgramme.duration}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span
                                className={
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {isArabic ? "الجدول" : "Schedule"}
                              </span>
                              <span
                                className={
                                  isDarkMode ? "text-white" : "text-gray-900"
                                }
                              >
                                {isArabic
                                  ? selectedProgramme.arabicSchedule
                                  : selectedProgramme.schedule}
                              </span>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span
                                className={
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                }
                              >
                                {isArabic ? "المستويات" : "Levels"}
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {(isArabic
                                  ? selectedProgramme.arabicLevel
                                  : selectedProgramme.level
                                )
                                  .split(",")
                                  .map((level, index) => (
                                    <span
                                      key={index}
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        isDarkMode
                                          ? "bg-indigo-500/20 text-indigo-300"
                                          : "bg-indigo-100 text-indigo-700"
                                      }`}
                                    >
                                      {level.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`p-4 rounded-xl ${
                            isDarkMode ? "bg-white/5" : "bg-gray-50"
                          }`}
                        >
                          <h4
                            className={`text-sm font-semibold mb-2 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {isArabic ? "المميزات" : "Features"}
                          </h4>
                          <ul className="space-y-2">
                            {(isArabic
                              ? selectedProgramme.arabicFeatures
                              : selectedProgramme.features
                            ).map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <svg
                                  className={`w-4 h-4 ${
                                    isDarkMode
                                      ? "text-indigo-400"
                                      : "text-indigo-500"
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span
                                  className={
                                    isDarkMode
                                      ? "text-gray-300"
                                      : "text-gray-600"
                                  }
                                >
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Buttons Section */}
                    <div
                      className={`p-4 border-t ${
                        isDarkMode ? "border-white/10" : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => setSelectedProgramme(null)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? "bg-white/10 hover:bg-white/20 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                          }`}
                        >
                          {isArabic ? "إغلاق" : "Close"}
                        </button>
                        <Link
                          to="/courses"
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                        >
                          {isArabic ? "اكتشف المزيد" : "Explore More"}
                        </Link>
                      </div>
                    </div>

                    {/* Scroll Indicator */}
                    {isScrollable && (
                      <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className={`p-2 rounded-full ${
                            isDarkMode ? "bg-white/10" : "bg-gray-100"
                          }`}
                        >
                          <svg
                            className={`w-5 h-5 ${
                              isDarkMode ? "text-white/70" : "text-gray-600"
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                            />
                          </svg>
                        </motion.div>
                      </div>
                    )}
                  </>
                )}
              </Dialog.Panel>
            </div>
          </Dialog>

          <div className="text-center mt-12">
            <LocalizedButton
              to="/courses"
              englishText="VIEW ALL COURSES"
              arabicText="عرض جميع الدورات"
              variant="primary"
            />
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {homeData.upcomingEvents.length > 0 && (
        <section
          className={`py-20 relative ${
            isDarkMode
              ? "bg-gradient-to-br from-indigo-500/10 to-purple-600/10"
              : "bg-gradient-to-br from-gray-100/70 to-gray-200/70"
          }`}
        >
          <div className="max-w-screen-xl mx-auto px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={`text-3xl md:text-5xl font-light mb-12 tracking-wider text-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {isArabic ? "الفعاليات القادمة" : "Upcoming Events"}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homeData.upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`group relative rounded-xl overflow-hidden ${
                    isDarkMode ? "bg-white/5" : "bg-white"
                  } shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="aspect-video">
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        isDarkMode
                          ? "from-black/80 to-transparent"
                          : "from-black/60 to-transparent"
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full 
                        bg-gradient-to-r from-indigo-500 to-purple-600 text-white`}
                      >
                        {event.category}
                      </span>
                      <div
                        className={`flex items-center gap-2 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <span className="text-sm">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <h3
                      className={`text-xl font-bold mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {event.title}
                    </h3>

                    <p
                      className={`mb-4 text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {isArabic ? event.description_ar : event.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {event.time}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <LocalizedButton
                to="/events"
                englishText="View All Events"
                arabicText="عرض جميع الفعاليات"
                variant="primary"
              />
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {homeData.galleryImages.length > 0 && (
        <section className="py-20 relative">
          <div className="max-w-screen-xl mx-auto px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={`text-3xl md:text-5xl font-light mb-12 tracking-wider text-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {isArabic ? "معرض الصور" : "Gallery"}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeData.galleryImages.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative group h-72 rounded-xl overflow-hidden bg-black"
                >
                  <img
                    src={item.image}
                    alt={isArabic ? item.arabicTitle : item.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                    style={{
                      transform: "translateZ(0)",
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                    }}
                    loading="eager"
                    decoding="sync"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-lg font-semibold">
                        {isArabic ? item.arabicTitle : item.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <LocalizedButton
                to="/gallery"
                englishText="View Full Gallery"
                arabicText="عرض معرض الصور كاملاً"
                variant="primary"
              />
            </div>
          </div>
        </section>
      )}

      {/* Student Reviews Section */}
      {staticReviews.length > 0 && (
        <section
          className={`py-20 relative ${
            isDarkMode
              ? "bg-gradient-to-br from-indigo-500/10 to-purple-600/10"
              : "bg-gradient-to-br from-gray-50 to-gray-100"
          }`}
        >
          <div className="max-w-screen-xl mx-auto px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className={`text-3xl md:text-5xl font-light mb-12 tracking-wider text-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Student Reviews
            </motion.h2>

            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={3}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={5000}
              pauseOnHover={true}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                  },
                },
                {
                  breakpoint: 640,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  },
                },
              ]}
              className="review-slider"
            >
              {staticReviews.map((review, index) => (
                <div key={review._id} className="px-4 h-[300px]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className={`relative p-6 rounded-xl h-full flex flex-col ${
                      isDarkMode ? "bg-white/5" : "bg-white"
                    } shadow-lg cursor-pointer`}
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="flex-1 overflow-hidden relative">
                      <div
                        className={`text-4xl mb-4 ${
                          isDarkMode ? "text-gray-400" : "text-gray-400"
                        }`}
                      >
                        "
                      </div>
                      <p
                        className={`mb-6 line-clamp-4 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {review.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/10 mt-4">
                      <div>
                        <h4
                          className={`font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {review.name}
                        </h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {new Date(review.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex -space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>

            {/* Review Modal */}
            <Dialog
              open={selectedReview !== null}
              onClose={() => setSelectedReview(null)}
              className="relative z-[999]"
            >
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[997]"
                aria-hidden="true"
                onClick={() => setSelectedReview(null)}
              />

              <div className="fixed inset-0 flex items-center justify-center p-4 z-[998]">
                <Dialog.Panel
                  className={`w-full max-w-2xl rounded-2xl transform transition-all relative
                  ${isDarkMode ? "bg-[#1F1F2E] border border-white/10" : "bg-white shadow-xl"}
                  max-h-[90vh] flex flex-col`}
                >
                  {selectedReview && (
                    <>
                      <div className="flex-none p-6 sm:p-8 border-b border-gray-200/10">
                        <div className="flex justify-between items-start">
                          <Dialog.Title
                            className={`text-2xl font-semibold ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedReview.name}
                          </Dialog.Title>
                          <button
                            onClick={() => setSelectedReview(null)}
                            className={`p-2 rounded-full transition-colors ${
                              isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100"
                            }`}
                          >
                            <svg
                              className={`w-5 h-5 ${
                                isDarkMode ? "text-white" : "text-gray-500"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div 
                        ref={modalContentRef}
                        className="flex-1 p-6 sm:p-8 overflow-y-auto scrollbar-hide"
                        onScroll={checkScrollable}
                      >
                        <div
                          className={`mb-8 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {selectedReview.description}
                        </div>

                        <div
                          className={`p-4 rounded-xl ${
                            isDarkMode ? "bg-white/5" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {new Date(selectedReview.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                            <div className="flex -space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-5 h-5 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Scroll Indicator - Only shown when content is scrollable */}
                      {isScrollable && (
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className={`absolute bottom-20 left-1/2 -translate-x-1/2 ${
                            isDarkMode ? "text-white/50" : "text-gray-400"
                          }`}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </motion.div>
                      )}

                      <div className="flex-none p-4 border-t border-gray-200/10">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setSelectedReview(null)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              isDarkMode
                                ? "bg-white/10 hover:bg-white/20 text-white"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                            }`}
                          >
                            {isArabic ? "إغلاق" : "Close"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </div>
            </Dialog>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
