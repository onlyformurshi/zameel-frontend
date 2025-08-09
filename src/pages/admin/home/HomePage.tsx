import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../../store/themeStore";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { adminHomeAPI } from "../../../api/admin/adminHome";
import {
  HeroSection,
  WhyChooseUs,
  CreateHeroSectionDto,
  CreateWhyChooseUsDto
} from "../../../api/admin/types/adminHome.types";
import ConfirmationPopup from "../../../components/common/ConfirmationPopup";

const HomePage = () => {
  const { isDarkMode } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);

  // Hero Section State
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null);

  // Why Choose Us Cards State
  const [whyChooseCards, setWhyChooseCards] = useState<WhyChooseUs[]>([]);

  // Modal States
  const [isAddHeroOpen, setIsAddHeroOpen] = useState(false);
  const [isEditHeroOpen, setIsEditHeroOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);

  // New Item States
  const [newHero, setNewHero] = useState<CreateHeroSectionDto>({
    title: "",
    arabicTitle: "",
    subtitle: "",
    arabicSubtitle: "",
  });

  const [newCard, setNewCard] = useState<CreateWhyChooseUsDto>({
    title: "",
    arabicTitle: "",
    description: "",
    arabicDescription: "",
  });

  // Editing States
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null);
  const [editingCard, setEditingCard] = useState<WhyChooseUs | null>(null);

  // Delete Confirmation States
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'hero' | 'card';
    id: string;
  }>({
    isOpen: false,
    type: 'hero',
    id: '',
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await adminHomeAPI.getHomePageData();
        setHeroSection(data.heroSection);
        setWhyChooseCards(data.whyChooseUs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Hero Section Handlers
  const handleAddHero = async () => {
    try {
      // Only send non-empty fields
      const heroData: Partial<CreateHeroSectionDto> = {};
      
      if (newHero.title) heroData.title = newHero.title;
      if (newHero.arabicTitle) heroData.arabicTitle = newHero.arabicTitle;
      if (newHero.subtitle) heroData.subtitle = newHero.subtitle;
      if (newHero.arabicSubtitle) heroData.arabicSubtitle = newHero.arabicSubtitle;

      if (Object.keys(heroData).length > 0) {
        await adminHomeAPI.createHeroSection(heroData as CreateHeroSectionDto);
        const data = await adminHomeAPI.getHomePageData();
        setHeroSection(data.heroSection);
        setNewHero({
          title: "",
          arabicTitle: "",
          subtitle: "",
          arabicSubtitle: "",
        });
        setIsAddHeroOpen(false);
      }
    } catch (error) {
      console.error('Error adding hero section:', error);
    }
  };

  const handleEditHero = async () => {
    if (editingHero && heroSection) {
      try {
        const changedFields: Partial<CreateHeroSectionDto> = {};
        
        if (editingHero.title !== heroSection.title) {
          changedFields.title = editingHero.title;
        }
        if (editingHero.arabicTitle !== heroSection.arabicTitle) {
          changedFields.arabicTitle = editingHero.arabicTitle;
        }
        if (editingHero.subtitle !== heroSection.subtitle) {
          changedFields.subtitle = editingHero.subtitle;
        }
        if (editingHero.arabicSubtitle !== heroSection.arabicSubtitle) {
          changedFields.arabicSubtitle = editingHero.arabicSubtitle;
        }
  
        if (Object.keys(changedFields).length > 0) {
          await adminHomeAPI.updateHeroSection(editingHero._id, changedFields);
          const data = await adminHomeAPI.getHomePageData();
          setHeroSection(data.heroSection);
        }
        
        setEditingHero(null);
        setIsEditHeroOpen(false);
      } catch (error) {
        console.error('Error updating hero section:', error);
      }
    }
  };
  const handleDeleteHero = async (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'hero',
      id,
    });
  };

  // Why Choose Us Card Handlers
  const handleAddCard = async () => {
    try {
      // Only send non-empty fields
      const cardData: Partial<CreateWhyChooseUsDto> = {};
      
      if (newCard.title) cardData.title = newCard.title;
      if (newCard.arabicTitle) cardData.arabicTitle = newCard.arabicTitle;
      if (newCard.description) cardData.description = newCard.description;
      if (newCard.arabicDescription) cardData.arabicDescription = newCard.arabicDescription;

      if (Object.keys(cardData).length > 0) {
        await adminHomeAPI.createWhyChooseUs(cardData as CreateWhyChooseUsDto);
        const data = await adminHomeAPI.getHomePageData();
        setWhyChooseCards(data.whyChooseUs);
        setNewCard({
          title: "",
          arabicTitle: "",
          description: "",
          arabicDescription: "",
        });
        setIsAddCardOpen(false);
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const handleEditCard = async () => {
    if (editingCard) {
      try {
        // Find original card
        const originalCard = whyChooseCards.find(card => card._id === editingCard._id);
        if (!originalCard) return;

        // Create object only with changed fields
        const changedFields: Partial<CreateWhyChooseUsDto> = {};
        
        if (editingCard.title !== originalCard.title) {
          changedFields.title = editingCard.title;
        }
        if (editingCard.arabicTitle !== originalCard.arabicTitle) {
          changedFields.arabicTitle = editingCard.arabicTitle;
        }
        if (editingCard.description !== originalCard.description) {
          changedFields.description = editingCard.description;
        }
        if (editingCard.arabicDescription !== originalCard.arabicDescription) {
          changedFields.arabicDescription = editingCard.arabicDescription;
        }

        // Only make API call if there are changes
        if (Object.keys(changedFields).length > 0) {
          await adminHomeAPI.updateWhyChooseUs(editingCard._id, changedFields);
          const data = await adminHomeAPI.getHomePageData();
          setWhyChooseCards(data.whyChooseUs);
        }
        
        setEditingCard(null);
        setIsEditCardOpen(false);
      } catch (error) {
        console.error('Error updating card:', error);
      }
    }
  };

  const handleDeleteCard = async (id: string) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'card',
      id,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteConfirmation.type === 'hero') {
        await adminHomeAPI.deleteHeroSection(deleteConfirmation.id);
      } else {
        await adminHomeAPI.deleteWhyChooseUs(deleteConfirmation.id);
      }
      const data = await adminHomeAPI.getHomePageData();
      setHeroSection(data.heroSection);
      setWhyChooseCards(data.whyChooseUs);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this ${deleteConfirmation.type === 'hero' ? 'hero section' : 'card'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Hero Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Hero Section
            </h2>
            <p
              className={`mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Manage your hero content
            </p>
          </div>
          <button
            onClick={() => setIsAddHeroOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <FaPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Hero</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {heroSection && (
            <Card
              key={heroSection._id}
              onEdit={() => {
                setEditingHero(heroSection);
                setIsEditHeroOpen(true);
              }}
              onDelete={() => handleDeleteHero(heroSection._id)}
              isDarkMode={isDarkMode}
            >
              <div>
                <h3
                  className={`text-lg sm:text-xl font-semibold mb-2 line-clamp-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {heroSection.title}
                </h3>
                <p
                  className={`text-sm sm:text-base line-clamp-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {heroSection.subtitle}
                </p>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Why Choose Us
            </h2>
            <p
              className={`mt-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Manage feature cards
            </p>
          </div>
          <button
            onClick={() => setIsAddCardOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <FaPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 min-[400px]:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {whyChooseCards.map((card) => (
            <Card
              key={card._id}
              onEdit={() => {
                setEditingCard(card);
                setIsEditCardOpen(true);
              }}
              onDelete={() => handleDeleteCard(card._id)}
              isDarkMode={isDarkMode}
            >
              <div>
                <h3
                  className={`text-lg sm:text-xl font-semibold mb-2 line-clamp-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`text-sm sm:text-base line-clamp-3 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {card.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Hero Section Add/Edit Modal */}
      <AnimatePresence>
        {(isAddHeroOpen || (isEditHeroOpen && editingHero)) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => {
                setIsAddHeroOpen(false);
                setIsEditHeroOpen(false);
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed top-0 right-0 h-full w-full max-w-md ${
                isDarkMode ? "bg-[#141b2d]" : "bg-white"
              } shadow-2xl p-6 overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {isAddHeroOpen ? "Add New Hero Section" : "Edit Hero Section"}
                </h2>
                <button
                  onClick={() => {
                    setIsAddHeroOpen(false);
                    setIsEditHeroOpen(false);
                  }}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                >
                  <FaTimes className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                </button>
              </div>
              <div className="space-y-6">
                {/* English Section */}
                <div className="space-y-4">
                  <h3 className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    English Content
                  </h3>
                  <div>
                    <label
                      className={`block mb-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      value={isAddHeroOpen ? newHero.title : editingHero?.title || ""}
                      onChange={(e) => {
                        if (isAddHeroOpen) {
                          setNewHero({ ...newHero, title: e.target.value });
                        } else if (editingHero) {
                          setEditingHero({
                            ...editingHero,
                            title: e.target.value,
                          });
                        }
                      }}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-[#1f2937] border-gray-700 text-white"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={isAddHeroOpen ? newHero.subtitle : editingHero?.subtitle || ""}
                      onChange={(e) => {
                        if (isAddHeroOpen) {
                          setNewHero({ ...newHero, subtitle: e.target.value });
                        } else if (editingHero) {
                          setEditingHero({
                            ...editingHero,
                            subtitle: e.target.value,
                          });
                        }
                      }}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-[#1f2937] border-gray-700 text-white"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Arabic Section */}
                <div className="space-y-4">
                  <h3 className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Arabic Content
                  </h3>
                  <div>
                    <label
                      className={`block mb-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Arabic Title
                    </label>
                    <input
                      type="text"
                      value={isAddHeroOpen ? newHero.arabicTitle : editingHero?.arabicTitle || ""}
                      onChange={(e) => {
                        if (isAddHeroOpen) {
                          setNewHero({ ...newHero, arabicTitle: e.target.value });
                        } else if (editingHero) {
                          setEditingHero({
                            ...editingHero,
                            arabicTitle: e.target.value,
                          });
                        }
                      }}
                      className={`w-full px-4 py-2 rounded-lg border text-right ${
                        isDarkMode
                          ? "bg-[#1f2937] border-gray-700 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Arabic Subtitle
                    </label>
                    <input
                      type="text"
                      value={isAddHeroOpen ? newHero.arabicSubtitle : editingHero?.arabicSubtitle || ""}
                      onChange={(e) => {
                        if (isAddHeroOpen) {
                          setNewHero({ ...newHero, arabicSubtitle: e.target.value });
                        } else if (editingHero) {
                          setEditingHero({
                            ...editingHero,
                            arabicSubtitle: e.target.value,
                          });
                        }
                      }}
                      className={`w-full px-4 py-2 rounded-lg border text-right ${
                        isDarkMode
                          ? "bg-[#1f2937] border-gray-700 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      dir="rtl"
                    />
                  </div>
                </div>

                <button
                  onClick={isAddHeroOpen ? handleAddHero : handleEditHero}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  {isAddHeroOpen ? "Add Hero Section" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Why Choose Us Add/Edit Modal */}
      <AnimatePresence>
        {(isAddCardOpen || (isEditCardOpen && editingCard)) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={() => {
                setIsAddCardOpen(false);
                setIsEditCardOpen(false);
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed top-0 right-0 h-full w-full max-w-md ${
                isDarkMode ? "bg-[#141b2d]" : "bg-white"
              } shadow-2xl p-6 overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {isAddCardOpen ? "Add New Card" : "Edit Card"}
                </h2>
                <button
                  onClick={() => {
                    setIsAddCardOpen(false);
                    setIsEditCardOpen(false);
                  }}
                  className={`p-2 rounded-lg ${
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                >
                  <FaTimes className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
                </button>
              </div>
              <div className="space-y-6">
                {/* English Section */}
                <div className="space-y-4">
                  <h3 className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    English Content
                  </h3>
                  <div>
                    <label
                      className={`block mb-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      value={isAddCardOpen ? newCard.title : editingCard?.title || ""}
                      onChange={(e) => {
                        if (isAddCardOpen) {
                          setNewCard({ ...newCard, title: e.target.value });
                        } else if (editingCard) {
                          setEditingCard({
                            ...editingCard,
                            title: e.target.value,
                          });
                        }
                      }}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-[#1f2937] border-gray-700 text-white"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Description
                    </label>
                    <textarea
                      value={isAddCardOpen ? newCard.description : editingCard?.description || ""}
                      onChange={(e) => {
                        if (isAddCardOpen) {
                          setNewCard({ ...newCard, description: e.target.value });
                        } else if (editingCard) {
                          setEditingCard({
                            ...editingCard,
                            description: e.target.value,
                          });
                        }
                      }}
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-[#1f2937] border-gray-700 text-white"
                          : "bg-white border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                {/* Arabic Section */}
                <div className="space-y-4">
                  <h3 className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Arabic Content
                  </h3>
                  <div>
                    <label
                      className={`block mb-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Arabic Title
                    </label>
                    <input
                      type="text"
                      value={isAddCardOpen ? newCard.arabicTitle : editingCard?.arabicTitle || ""}
                      onChange={(e) => {
                        if (isAddCardOpen) {
                          setNewCard({ ...newCard, arabicTitle: e.target.value });
                        } else if (editingCard) {
                          setEditingCard({
                            ...editingCard,
                            arabicTitle: e.target.value,
                          });
                        }
                      }}
                      className={`w-full px-4 py-2 rounded-lg border text-right ${
                        isDarkMode
                          ? "bg-[#1f2937] border-gray-700 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label
                      className={`block mb-2 text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Arabic Description
                    </label>
                    <textarea
                      value={isAddCardOpen ? newCard.arabicDescription : editingCard?.arabicDescription || ""}
                      onChange={(e) => {
                        if (isAddCardOpen) {
                          setNewCard({ ...newCard, arabicDescription: e.target.value });
                        } else if (editingCard) {
                          setEditingCard({
                            ...editingCard,
                            arabicDescription: e.target.value,
                          });
                        }
                      }}
                      rows={4}
                      className={`w-full px-4 py-2 rounded-lg border text-right ${
                        isDarkMode
                          ? "bg-[#1f2937] border-gray-700 text-white"
                          : "bg-white border-gray-300"
                      }`}
                      dir="rtl"
                    />
                  </div>
                </div>

                <button
                  onClick={isAddCardOpen ? handleAddCard : handleEditCard}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  {isAddCardOpen ? "Add Card" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Card = ({
  children,
  onEdit,
  onDelete,
  isDarkMode,
}: {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  isDarkMode: boolean;
}) => (
  <div
    className={`rounded-xl ${
      isDarkMode ? "bg-gray-800/50" : "bg-white"
    } shadow-lg`}
  >
    <div className="flex justify-between items-start p-4">
      <div className="flex-1 pr-4">
        {children}
      </div>
      <div className="flex flex-shrink-0 gap-2">
        <button
          onClick={onEdit}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDarkMode
              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
        >
          <FaEdit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isDarkMode
              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export default HomePage;
