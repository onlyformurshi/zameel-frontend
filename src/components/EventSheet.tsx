import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiX } from 'react-icons/fi';
import { useLanguageStore } from '../store/languageStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

interface EventSheetProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  isUpcoming: boolean;
  buttonText: string;
}

const EventSheet = ({ event, isOpen, onClose, isDarkMode }: EventSheetProps) => {
  const { isArabic } = useLanguageStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  
  if (!event) return null;

  const isPastEvent = new Date(event.date) < new Date();

  // Add translations
  const buttonText = isArabic ? "استفسر عن الفعالية" : "Enquire about event";

  // Add this handler function
  const handleEnquire = () => {
    onClose(); // Close the sheet first
    navigate('/contact'); // Navigate to contact page
  };

  // Add this function to handle image click and show popup
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className={`fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-y-auto
              ${isDarkMode ? 'bg-dark/95' : 'bg-white'} shadow-xl
              scrollbar-hide`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute right-4 top-4 p-2 rounded-full 
                ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
            >
              <FiX className="w-6 h-6" />
            </button>

            <div className="p-6 pt-16">
              {/* Keep only the gradient line */}
              <div className="w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-6" />
              
              {/* Remove the category badges section and continue with the title */}
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {event.title}
              </h2>

              <p className={`text-base mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {isArabic ? event.arabicDescription : event.description}
              </p>

              {/* Thumbnail image */}
              <div className="mb-6 rounded-lg overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={event.thumbnail}
                    alt={event.title}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Grid of smaller event images */}
              {event.eventImages && event.eventImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {event.eventImages.map((image, index) => (
                    <motion.div 
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleImageClick(image)}
                    >
                      <img
                        src={image}
                        alt={`${event.title} image ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <FiCalendar className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center">
                  <FiClock className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {event.time}
                  </span>
                </div>

                <div className="flex items-center">
                  <FiMapPin className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {event.location}
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-lg mb-6 ${
                isDarkMode ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {isPastEvent ? 'Event Summary' : 'About this Event'}
                </h3>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {event.description}
                </p>
              </div>

              

              {!isPastEvent && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnquire}
                  className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 
                    text-white font-semibold hover:shadow-lg transition-all duration-300"
                >
                  {buttonText}
                </motion.button>
              )}
              
            </div>
          </motion.div>

          {/* Modal for displaying the clicked image */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <img src={selectedImage} alt="Selected" className="max-w-full max-h-full" onClick={() => setShowModal(false)} />
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default EventSheet; 