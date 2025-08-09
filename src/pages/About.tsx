/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { aboutUsAPI } from '../api/public/aboutus';
import { Dialog } from '@headlessui/react';

// Add translations
const translations = {
  en: {
    pageTitle: "Shaping Future Leaders",
    pageSubtitle: "At Zameel Arabic Academy, we are committed to providing world-class education that empowers students to excel in a global context.",
    stats: {
      studentsEnrolled: "Students Enrolled",
      successRate: "Success Rate",
      expertEducators: "Expert Educators",
      yearsExcellence: "Years of Excellence"
    },
    mission: {
      title: "Our Mission",
      description: "To provide exceptional educational experiences that inspire lifelong learning, foster critical thinking, and prepare students for success in a rapidly evolving global landscape."
    },
    vision: {
      title: "Our Vision",
      description: "To be a leading educational institution recognized globally for academic excellence, innovative teaching methodologies, and producing well-rounded individuals ready to make a positive impact on society."
    },
    team: {
      title: "Meet Our Leadership Team",
      specialties: "Specialties",
      achievements: "Achievements"
    }
  },
  ar: {
    pageTitle: "نصنع قادة المستقبل",
    pageSubtitle: "في أكاديمية زميل العربية، نلتزم بتقديم تعليم عالمي المستوى يمكّن الطلاب من التفوق في سياق عالمي.",
    stats: {
      studentsEnrolled: "الطلاب المسجلون",
      successRate: "معدل النجاح",
      expertEducators: "المعلمون الخبراء",
      yearsExcellence: "سنوات التميز"
    },
    mission: {
      title: "رسالتنا",
      description: "تقديم تجارب تعليمية استثنائية تلهم التعلم مدى الحياة، وتعزز التفكير النقدي، وتعد الطلاب للنجاح في عالم سريع التطور."
    },
    vision: {
      title: "رؤيتنا",
      description: "أن نكون مؤسسة تعليمية رائدة معترف بها عالمياً للتميز الأكاديمي، ومنهجيات التدريس المبتكرة، وإعداد أفراد متكاملين جاهزين لإحداث تأثير إيجابي في المجتمع."
    },
    team: {
      title: "تعرف على فريق القيادة",
      specialties: "التخصصات",
      achievements: "الإنجازات"
    }
  }
};

interface LeadershipMember {
  _id: string;
  name: string;
  arabicName: string;
  position: string;
  arabicPosition: string;
  image: string;
  email: string;
  bio: string;
  arabicBio: string;
  specialization: string[];
  arabicSpecialization: string[];
  socialLinks: {
    linkedin: string;
    _id: string;
  };
  isLeadershipTeam: boolean;
}

const About = () => {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [aboutUsData, setAboutUsData] = useState<any>(null);
  const [leadershipTeam, setLeadershipTeam] = useState<LeadershipMember[]>([]);
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const t = isArabic ? translations.ar : translations.en;

  // Add this state for the modal
  const [selectedSection, setSelectedSection] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const fetchAboutUs = async () => {
    try {
      const aboutUs = await aboutUsAPI.getAboutUs();
      if (aboutUs && aboutUs.length > 0) {
        setAboutUsData(aboutUs[0]);
      }
    } catch (error) {
      console.error('Error fetching about us data:', error);
    }
  }

  const fetchFaculty = async () => {
    try {
      const faculty = await aboutUsAPI.getFaculty();
      if (faculty) {
        setLeadershipTeam(faculty);
      }
    } catch (error) {
      console.error('Error fetching faculty data:', error);
    }
  }

  useEffect(() => {
    fetchAboutUs();
    fetchFaculty();
  }, []);

  // Update statsData to only use API data
  const statsData = aboutUsData ? [
    { label: "studentsEnrolled", value: `${aboutUsData.stats.studentsEnrolled}+` },
    { label: "successRate", value: `${aboutUsData.stats.successRate}%` },
    { label: "expertEducators", value: `${aboutUsData.stats.expertEducators}+` },
    { label: "yearsExcellence", value: aboutUsData.stats.yearsOfExcellence.toString() },
  ] : [];  // Empty array instead of fallback to dummy stats

  // Update how content is displayed based on language
  const getContent = {
    title: isArabic ? aboutUsData?.titleArabic : aboutUsData?.title,
    description: isArabic ? aboutUsData?.descriptionArabic : aboutUsData?.description,
    mission: isArabic ? aboutUsData?.missionArabic : aboutUsData?.mission,
    vision: isArabic ? aboutUsData?.visionArabic : aboutUsData?.vision,
  };

  return (
    <div className="min-h-screen pt-32 pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mb-24 text-center"
        >
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            {getContent.title || t.pageTitle}
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-xl md:text-2xl max-w-7xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {getContent.description || t.pageSubtitle}
          </motion.p>
        </motion.div>

        {/* Stats Section - Now using API data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-8 text-center hover:scale-105 transition-transform duration-300 rounded-xl border ${
                isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
              }`}
            >
              <motion.h3
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-2"
              >
                {stat.value}
              </motion.h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {t.stats[stat.label as keyof typeof t.stats]}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mission & Vision - Now using API data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedSection({
              title: t.mission.title,
              content: getContent.mission || t.mission.description
            })}
            className={`glass-card p-6 relative overflow-hidden rounded-xl border cursor-pointer h-[200px] ${
              isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
            }`}
          >
            <motion.div
              initial={{ x: '-100%' }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600"
            />
            <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              {t.mission.title}
            </h2>
            <p className={`line-clamp-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {getContent.mission || t.mission.description}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedSection({
              title: t.vision.title,
              content: getContent.vision || t.vision.description
            })}
            className={`glass-card p-6 relative overflow-hidden rounded-xl border cursor-pointer h-[200px] ${
              isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-white'
            }`}
          >
            <motion.div
              initial={{ x: '-100%' }}
              whileInView={{ x: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-600"
            />
            <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              {t.vision.title}
            </h2>
            <p className={`line-clamp-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {getContent.vision || t.vision.description}
            </p>
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div className="mb-24">
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            {t.team.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadershipTeam.map((member, index) => (
              <motion.div
                key={member._id || index}
                layoutId={`card-${index}`}
                onClick={() => setSelectedMember(selectedMember === index ? null : index)}
                className={`glass-card cursor-pointer overflow-hidden rounded-xl border ${
                  isDarkMode 
                    ? 'border-white/10 bg-white/5 hover:bg-white/10' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                } transition-all duration-300 
                ${selectedMember === index ? 'md:col-span-2' : ''}`}
              >
                {selectedMember === index ? (
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3">
                      <img
                        src={member.image}
                        alt={isArabic ? member.arabicName : member.name}
                        className="w-full h-64 md:h-full object-cover object-center"
                      />
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 w-full md:w-2/3"
                    >
                      <div className="mb-4">
                        <h3 className={`text-xl font-bold mb-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {isArabic ? member.arabicName : member.name}
                        </h3>
                        <p className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                          {isArabic ? member.arabicPosition : member.position}
                        </p>
                      </div>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {isArabic ? member.arabicBio : member.bio}
                      </p>
                      <div className="mt-4">
                        <h4 className={`text-lg font-semibold mb-2 ${
                          isDarkMode ? 'text-purple-400' : 'text-purple-600'
                        }`}>
                          {t.team.specialties}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {(isArabic ? member.arabicSpecialization : member.specialization).map((specialty, idx) => (
                            <span 
                              key={idx} 
                              className={`px-3 py-1 rounded-full text-sm ${
                                isDarkMode 
                                  ? 'bg-indigo-500/20 text-indigo-400'
                                  : 'bg-indigo-100 text-indigo-700'
                              }`}
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      {member.socialLinks?.linkedin && (
                        <div className="mt-4">
                          <a 
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-500 hover:text-indigo-600"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="h-48 relative group">
                      <img
                        src={member.image}
                        alt={isArabic ? member.arabicName : member.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 ${
                        isDarkMode 
                          ? 'bg-gradient-to-t from-black/80 to-transparent' 
                          : 'bg-gradient-to-t from-gray-900/70 to-transparent'
                      }`} />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="p-4"
                    >
                      <h3 className={`text-xl font-bold mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {isArabic ? member.arabicName : member.name}
                      </h3>
                      <p className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        {isArabic ? member.arabicPosition : member.position}
                      </p>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add Modal Dialog */}
      <Dialog
        open={selectedSection !== null}
        onClose={() => setSelectedSection(null)}
        className="relative z-[999]"
      >
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[997]" 
          aria-hidden="true"
          onClick={() => setSelectedSection(null)}
        />
        
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[998]">
          <Dialog.Panel 
            className={`w-full max-w-2xl rounded-2xl p-8 transform transition-all ${
              isDarkMode 
                ? 'bg-[#1F1F2E] border border-white/10' 
                : 'bg-white shadow-xl'
            }`}
          >
            {selectedSection && (
              <>
                <div className="flex justify-between items-start mb-6">
                  <Dialog.Title className={`text-2xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedSection.title}
                  </Dialog.Title>
                  <button
                    onClick={() => setSelectedSection(null)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-white/10' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedSection.content}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedSection(null)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-white/10 hover:bg-white/20 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {isArabic ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default About; 