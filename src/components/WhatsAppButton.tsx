import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { publicContactAPI } from '../api/public/contact';
import { useEffect, useState } from 'react';

const WhatsAppButton = () => {
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const message = "Hello! I'm interested in your translation courses."; // Default message

  const handleClick = () => {
    if (!whatsappNumber) return;
    const cleanNumber = whatsappNumber.replace(/[\s+-]/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleFetchWhatsAppData = async () => {
    try {
      const response = await publicContactAPI.getAllContact();
      if (response && response[0]?.whatsapp) {
        setWhatsappNumber(response[0].whatsapp);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp number:', error);
    }
  };

  useEffect(() => {
    handleFetchWhatsAppData();
  }, []);

  if (!whatsappNumber) return null;

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 p-3 bg-[#25D366] rounded-full text-white shadow-lg
        hover:shadow-xl hover:shadow-[#25D366]/20 transition-shadow duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
    >
      <FaWhatsapp size={24} aria-hidden="true" />
      <span className="sr-only">Contact us on WhatsApp</span>
    </motion.button>
  );
};

export default WhatsAppButton; 