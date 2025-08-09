import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { FiCalendar, FiMapPin, FiClock, FiSearch } from 'react-icons/fi';
import { useState, useMemo, Suspense, lazy, useEffect } from 'react';
import { publicEventsAPI } from '../api/public/events';

interface CategoryType {
  _id: string;
  name: string;
  arabicName: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  _id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  date: string;
  time: string;
  category: CategoryType;
  arabicCategory: CategoryType;
  location: string;
  arabicLocation: string;
  thumbnail: string;
  eventImages: string[];
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// Lazy load the EventSheet component
const EventSheet = lazy(() => import('../components/EventSheet'));

// Add translations for UI text
const translations = {
  en: {
    pageTitle: "Events",
    upcomingEvents: "Upcoming Events",
    pastEvents: "Past Events",
    searchPlaceholder: "Search events...",
    allYears: "All Years",
    loading: "Loading...",
    noUpcomingEvents: "No upcoming events",
    noPastEvents: "No past events",
    enquireEvent: "Enquire about event"
  },
  ar: {
    pageTitle: "الفعاليات",
    upcomingEvents: "الفعاليات القادمة",
    pastEvents: "الفعاليات السابقة",
    searchPlaceholder: "ابحث عن الفعاليات...",
    allYears: "كل السنوات",
    loading: "جاري التحميل...",
    noUpcomingEvents: "لا توجد فعاليات قادمة",
    noPastEvents: "لا توجد فعاليات سابقة",
    enquireEvent: "استفسر عن الفعالية"
  }
};

// Add translations for categories


// Update NoEventsMessage component
const NoEventsMessage = ({ type, isDarkMode, isArabic }: { type: string; isDarkMode: boolean; isArabic: boolean }) => {
  const message = type === 'upcoming'
    ? (isArabic ? translations.ar.noUpcomingEvents : translations.en.noUpcomingEvents)
    : (isArabic ? translations.ar.noPastEvents : translations.en.noPastEvents);

  return (
    <div className="text-center py-12">
      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
        {message}
      </p>
    </div>
  );
};

// Add card hover animation variants
const cardVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};


const Events = () => {
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  // Get text based on current language
  const t = isArabic ? translations.ar : translations.en;

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await publicEventsAPI.getAllEvents();
      setEvents(fetchedEvents.map((event: Event) => ({
        ...event,
        id: event._id,
        title_ar: event.arabicTitle,
        description_ar: event.arabicDescription,
        location_ar: event.arabicLocation,
        images: [event.thumbnail, ...event.eventImages],
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Get unique years from events
  const years = useMemo(() => {
    const uniqueYears = new Set(events.map(event => 
      new Date(event.date).getFullYear().toString()
    ));
    return ['all', ...Array.from(uniqueYears)].sort().reverse();
  }, [events]);

  // Filter events based on date, search query, and year
  const filterEvents = (type: 'upcoming' | 'past') => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);  // Reset time part for accurate date comparison

    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);  // Reset time part for accurate date comparison

        // Compare dates for upcoming/past
        const isCorrectType = type === 'upcoming' 
          ? eventDate.getTime() > currentDate.getTime() 
          : eventDate.getTime() < currentDate.getTime();

        const matchesSearch = searchQuery === '' || 
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesYear = selectedYear === 'all' || 
          eventDate.getFullYear().toString() === selectedYear;

        return isCorrectType && matchesSearch && matchesYear;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return type === 'upcoming' ? dateA - dateB : dateB - dateA;
      });
  };

  const filteredEvents = filterEvents(activeTab);

  // Add a helper function to check if an event is upcoming
  const isUpcomingEvent = (eventDate: string) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const eventDateTime = new Date(eventDate);
    eventDateTime.setHours(0, 0, 0, 0);
    return eventDateTime.getTime() > currentDate.getTime();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8" dir={isArabic ? "rtl" : "ltr"}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold mb-8 text-center ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {t.pageTitle}
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 text-sm font-medium relative ${
              activeTab === 'upcoming'
                ? isDarkMode ? 'text-white' : 'text-gray-900'
                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {t.upcomingEvents}
            {activeTab === 'upcoming' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"
                initial={false}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-3 text-sm font-medium relative ${
              activeTab === 'past'
                ? isDarkMode ? 'text-white' : 'text-gray-900'
                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {t.pastEvents}
            {activeTab === 'past' && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"
                initial={false}
              />
            )}
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isArabic ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-dark/50 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>

          {/* Year Filter */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className={`appearance-none pl-4 pr-10 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-dark/50 border-gray-700 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year === 'all' ? t.allYears : year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative">
          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsSheetOpen(true);
                    }}
                    className={`cursor-pointer rounded-xl overflow-hidden shadow-lg 
                      transition-all duration-300 flex flex-col ${
                      isDarkMode 
                        ? 'bg-dark/50 border border-gray-700 hover:bg-dark/70 hover:shadow-xl hover:shadow-purple-500/10' 
                        : 'bg-white border border-gray-200 hover:bg-gray-50 hover:shadow-xl hover:shadow-indigo-500/10'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-full h-48">
                      <img
                        src={event.thumbnail}
                        alt={isArabic ? event.arabicTitle : event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Content Container */}
                    <div className={`p-4 flex flex-col flex-grow ${isDarkMode ? 'bg-dark/50' : 'bg-white'}`}>
                      {/* Date and Category */}
                      <div className="flex items-center justify-between mb-4">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className={`flex items-center gap-2 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          <FiCalendar className="text-lg" />
                          <span className="text-sm">
                            {new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </motion.div>
                      </div>

                      {/* Title */}
                      <motion.h3 
                        className={`text-xl font-bold mb-3 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isArabic ? event.arabicTitle || event.title : event.title}
                      </motion.h3>

                      {/* Description */}
                      <p className={`mb-4 text-sm line-clamp-3 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {isArabic ? event.arabicDescription : event.description}
                      </p>

                      {/* Time and Location - Now at the bottom */}
                      <div className="mt-auto space-y-2">
                        <motion.div 
                          className="flex items-center"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiClock className={`mr-2 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {event.time}
                          </span>
                        </motion.div>

                        <motion.div 
                          className="flex items-center"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FiMapPin className={`mr-2 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {isArabic ? event.arabicLocation || event.location : event.location}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <NoEventsMessage type={activeTab} isDarkMode={isDarkMode} isArabic={isArabic} />
          )}
        </div>
      </div>

      {/* Event Detail Sheet */}
      <Suspense fallback={
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="animate-pulse text-white">
            {t.loading}
          </div>
        </div>
      }>
        <EventSheet
          event={selectedEvent as Event}
          isOpen={isSheetOpen}
          onClose={() => {
            setIsSheetOpen(false);
            setSelectedEvent(null);
          }}
          isDarkMode={isDarkMode}
          isUpcoming={selectedEvent ? isUpcomingEvent(selectedEvent.date) : false}
          buttonText={isArabic ? translations.ar.enquireEvent : translations.en.enquireEvent}
        />
      </Suspense>
    </div>
  );
};

export default Events; 