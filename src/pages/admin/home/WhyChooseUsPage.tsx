import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

interface Card {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
}

const WhyChooseUsPage = () => {
  const { isDarkMode } = useThemeStore();
  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      title: 'Expert Faculty',
      description: 'Learn from highly qualified educators with extensive experience in international education.',
      icon: '👨‍🏫',
      isActive: true,
    },
    {
      id: '2',
      title: 'Global Recognition',
      description: 'Earn internationally recognized certifications and qualifications.',
      icon: '🌟',
      isActive: true,
    },
    {
      id: '3',
      title: 'Modern Learning',
      description: 'Access state-of-the-art facilities and innovative learning methodologies.',
      icon: '💻',
      isActive: true,
    },
    {
      id: '4',
      title: 'Diverse Programs',
      description: 'Choose from a wide range of educational programs tailored to global standards.',
      icon: '📚',
      isActive: true,
    },
    {
      id: '5',
      title: 'Industry Connections',
      description: 'Connect with leading educational institutions and organizations worldwide.',
      icon: '🤝',
      isActive: true,
    },
    {
      id: '6',
      title: 'Practical Experience',
      description: 'Gain hands-on experience through internships and real-world projects.',
      icon: '🎯',
      isActive: true,
    },
  ]);

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    icon: '',
    isActive: true,
  });

  const handleAdd = () => {
    const newId = (cards.length + 1).toString();
    setCards([...cards, { ...newCard, id: newId }]);
    setNewCard({ title: '', description: '', icon: '', isActive: true });
    setIsAddSheetOpen(false);
  };

  const handleEdit = () => {
    if (editingCard) {
      setCards(cards.map(card => 
        card.id === editingCard.id ? editingCard : card
      ));
      setEditingCard(null);
      setIsEditSheetOpen(false);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Why Choose Us Cards
          </h1>
          <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage the cards that appear in the "Why Choose Zameel Arabic Academy?" section
          </p>
        </div>
        <button
          onClick={() => setIsAddSheetOpen(true)}
          aria-label="Add new Why Choose Us card"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FaPlus aria-hidden="true" />
          <span>Add Card</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-xl border ${
              isDarkMode 
                ? 'bg-[#141b2d] border-gray-800' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="text-4xl">{card.icon}</div>
                <h3 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {card.title}
                </h3>
                <p className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {card.description}
                </p>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    card.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {card.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingCard(card);
                    setIsEditSheetOpen(true);
                  }}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Card Sheet */}
      <AnimatePresence>
        {isAddSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setIsAddSheetOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed top-0 right-0 h-full w-full max-w-[320px] sm:max-w-[360px] ${
                isDarkMode ? 'bg-[#141b2d]' : 'bg-white'
              } shadow-2xl p-6 overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Add New Card
                </h2>
                <button
                  onClick={() => setIsAddSheetOpen(false)}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className={`block mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={newCard.icon}
                    onChange={(e) => setNewCard({ ...newCard, icon: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-gray-700 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    placeholder="Enter an emoji (e.g., 👨‍🏫, 🌟, 💻)"
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={newCard.title}
                    onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-gray-700 text-white' 
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Card Title"
                    aria-label="Card title"
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={newCard.description}
                    onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-gray-700 text-white' 
                        : 'bg-white border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Card Description"
                    aria-label="Card description"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newCard.isActive}
                    onChange={(e) => setNewCard({ ...newCard, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className={
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }>
                    Active
                  </label>
                </div>
                <button
                  onClick={handleAdd}
                  aria-label="Add new card"
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span>Add Card</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Card Sheet */}
      <AnimatePresence>
        {isEditSheetOpen && editingCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => setIsEditSheetOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed top-0 right-0 h-full w-full max-w-[320px] sm:max-w-[360px] ${
                isDarkMode ? 'bg-[#141b2d]' : 'bg-white'
              } shadow-2xl p-6 overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Edit Card
                </h2>
                <button
                  onClick={() => setIsEditSheetOpen(false)}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className={`block mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={editingCard.icon}
                    onChange={(e) => setEditingCard({ 
                      ...editingCard, 
                      icon: e.target.value 
                    })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-gray-700 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    placeholder="Enter an emoji (e.g., 👨‍🏫, 🌟, 💻)"
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingCard.title}
                    onChange={(e) => setEditingCard({ 
                      ...editingCard, 
                      title: e.target.value 
                    })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-gray-700 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={editingCard.description}
                    onChange={(e) => setEditingCard({ 
                      ...editingCard, 
                      description: e.target.value 
                    })}
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-[#1f2937] border-gray-700 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="editIsActive"
                    checked={editingCard.isActive}
                    onChange={(e) => setEditingCard({ 
                      ...editingCard, 
                      isActive: e.target.checked 
                    })}
                    className="mr-2"
                  />
                  <label htmlFor="editIsActive" className={
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }>
                    Active
                  </label>
                </div>
                <button
                  onClick={handleEdit}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhyChooseUsPage; 