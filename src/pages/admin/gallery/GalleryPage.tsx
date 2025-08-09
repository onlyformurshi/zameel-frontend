import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../../store/themeStore";
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiX } from "react-icons/fi";
import { Gallery, GalleryCategory } from "../../../api/admin/types/adminGallery.types";
import { adminGalleryAPI } from "../../../api/admin/adminGallery";
import GalleryForm from "./GalleryForm";
import { useConfirm } from "../../../hooks/useConfirm";
import { useToastStore } from "../../../store/toastStore";
import { AxiosError } from "axios";

const GalleryPage = () => {
  const { isDarkMode } = useThemeStore();
  const [gallery, setGallery] = useState<Gallery[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { showConfirmation } = useConfirm();
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [isCategoryEditSheetOpen, setIsCategoryEditSheetOpen] = useState(false);
  const { showToast } = useToastStore();

  useEffect(() => {
    fetchGallery();
    fetchCategories();
  }, []);

  const fetchGallery = async () => {
    try {
      const data = await adminGalleryAPI.getGallery();
      setGallery(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminGalleryAPI.getGalleryCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddGallery = () => {
    setSelectedGallery(null);
    setIsFormOpen(true);
  };

  const handleEditGallery = (item: Gallery) => {
    setSelectedGallery(item);
    setIsFormOpen(true);
    setActiveMenu(null);
  };

  const handleDeleteGallery = async (item: Gallery) => {
    const confirmed = await showConfirmation(
      "Delete Gallery Item",
      "Are you sure you want to delete this gallery item? This action cannot be undone."
    );

    if (confirmed) {
      try {
        await adminGalleryAPI.deleteGallery(item._id);
        setGallery((prevGallery) =>
          prevGallery.filter((g) => g._id !== item._id)
        );
        setActiveMenu(null);
      } catch (error) {
        console.error("Error deleting gallery item:", error);
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (selectedGallery) {
        // For update
        const updatedGallery = await adminGalleryAPI.updateGallery(
          selectedGallery._id,
          formData
        );
        setGallery((prevGallery) =>
          prevGallery.map((item) =>
            item._id === selectedGallery._id ? updatedGallery : item
          )
        );
      } else {
        // For create
        const newGallery = await adminGalleryAPI.createGallery(formData);
        setGallery((prevGallery) => [...prevGallery, newGallery]);
      }

      setIsFormOpen(false);
      setSelectedGallery(null);
    } catch (error) {
      console.error("Error submitting gallery:", error);
    }
  };

  const toggleMenu = (galleryId: string) => {
    setActiveMenu(activeMenu === galleryId ? null : galleryId);
  };

  const handleAddCategory = () => {
    setIsCategoryFormOpen(true);
  };

  const handleCategorySubmit = async (formData: { name: string; arabicName: string }) => {
    try {
      const newCategory = await adminGalleryAPI.createGalleryCategory({
        name: formData.name,
        arabicName: formData.arabicName
      });
      setCategories(prev => [...prev, newCategory]);
      setIsCategoryFormOpen(false);
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    }
  };

  const handleEditCategory = (category: GalleryCategory) => {
    setEditingCategory(category);
    setIsCategoryEditSheetOpen(true);
  };

  const handleEditCategorySubmit = async (formData: { name: string; arabicName: string }) => {
    if (!editingCategory) return;

    try {
      const updatedCategory = await adminGalleryAPI.updateGalleryCategory(editingCategory._id, formData);
      setCategories(prev => prev.map(cat => 
        cat._id === editingCategory._id ? updatedCategory : cat
      ));
      setIsCategoryEditSheetOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (category: GalleryCategory) => {
    const confirmed = await showConfirmation(
      'Delete Category',
      'Are you sure you want to delete this category? This action is only possible if no gallery items are using this category.'
    );

    if (confirmed) {
      try {
        await adminGalleryAPI.deleteGalleryCategory(category._id);
        setCategories(prev => prev.filter(cat => cat._id !== category._id));
        showToast('Category deleted successfully', 'success');
      } catch (error: unknown) {
        console.error("Error deleting category:", error);
        const errorMessage = error instanceof AxiosError ? error.response?.data?.message : 'Failed to delete category';
        showToast(errorMessage, 'error');
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1
          className={`text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Manage Gallery
        </h1>
        <div className="flex gap-4">
          <button
            onClick={handleAddCategory}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Category</span>
          </button>
          <button
            onClick={handleAddGallery}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Image</span>
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className={`mb-8 p-6 rounded-xl ${isDarkMode ? "bg-[#1f2937]" : "bg-white"} shadow-sm`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Gallery Categories
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className={`p-5 rounded-xl flex items-center justify-between ${
                isDarkMode ? "bg-[#141b2d]" : "bg-gray-50"
              } border ${isDarkMode ? "border-gray-700" : "border-gray-100"} hover:shadow-md transition-all duration-200`}
            >
              <div>
                <h3 className={`font-medium text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {category.name}
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {category.arabicName}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditCategory(category)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-red-900/30 hover:bg-red-900/50 text-red-400"
                      : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Gallery Images
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-xl overflow-hidden group ${
                isDarkMode
                  ? "bg-[#141b2d] border border-gray-800"
                  : "bg-white shadow-md"
              }`}
            >
              {/* Gallery Image */}
              <div className="relative aspect-video">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    {typeof item.category === 'object' && item.category 
                      ? item.category.name 
                      : 'Uncategorized'}
                  </span>
                </div>
                {/* Action Menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleMenu(item._id)}
                    aria-label={
                      activeMenu === item._id ? "Close menu" : "Open menu"
                    }
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                    }`}
                  >
                    <FiMoreVertical className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">
                      {activeMenu === item._id ? "Close menu" : "Open menu"}
                    </span>
                  </button>
                  {/* Dropdown Menu */}
                  {activeMenu === item._id && (
                    <div
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                        isDarkMode
                          ? "bg-[#1f2937] border border-gray-700"
                          : "bg-white border border-gray-200"
                      }`}
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <button
                        onClick={() => handleEditGallery(item)}
                        className={`w-full flex items-center px-4 py-2 text-sm ${
                          isDarkMode
                            ? "text-gray-200 hover:bg-gray-800"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        role="menuitem"
                      >
                        <FiEdit2 className="w-4 h-4 mr-2" aria-hidden="true" />
                        <span>Edit Image</span>
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(item)}
                        className={`w-full flex items-center px-4 py-2 text-sm text-red-500 ${
                          isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        }`}
                        role="menuitem"
                      >
                        <FiTrash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                        <span>Delete Image</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Content */}
              <div className="p-4">
                <h3
                  className={`text-lg font-semibold mb-2 line-clamp-1 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm mb-4 line-clamp-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {item.arabicTitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Category Sheet */}
      <AnimatePresence>
        {isCategoryEditSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryEditSheetOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 h-full w-full max-w-[320px] sm:max-w-[360px] z-50 ${
                isDarkMode ? "bg-[#141b2d]" : "bg-white"
              } shadow-xl`}
            >
              <div className="h-full overflow-y-auto scrollbar-hide">
                <div className={`sticky top-0 z-10 px-6 py-4 flex justify-between items-center ${
                  isDarkMode ? "bg-[#141b2d] border-b border-gray-800" : "bg-white border-b"
                }`}>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Edit Category
                  </h2>
                  <button
                    onClick={() => setIsCategoryEditSheetOpen(false)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleEditCategorySubmit({
                      name: formData.get('name') as string,
                      arabicName: formData.get('arabicName') as string
                    });
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className={`block mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}>
                          Category Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={editingCategory?.name}
                          required
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? "bg-[#1f2937] border-gray-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}>
                          Arabic Name
                        </label>
                        <input
                          type="text"
                          name="arabicName"
                          defaultValue={editingCategory?.arabicName}
                          required
                          dir="rtl"
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? "bg-[#1f2937] border-gray-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                      >
                        Update Category
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Category Form Sheet */}
      <AnimatePresence>
        {isCategoryFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryFormOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 h-full w-full max-w-[320px] sm:max-w-[360px] z-50 ${
                isDarkMode ? "bg-[#141b2d]" : "bg-white"
              } shadow-xl`}
            >
              <div className="h-full overflow-y-auto scrollbar-hide">
                <div className={`sticky top-0 z-10 px-6 py-4 flex justify-between items-center ${
                  isDarkMode ? "bg-[#141b2d] border-b border-gray-800" : "bg-white border-b"
                }`}>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Add Category
                  </h2>
                  <button
                    onClick={() => setIsCategoryFormOpen(false)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleCategorySubmit({
                      name: formData.get('name') as string,
                      arabicName: formData.get('arabicName') as string
                    });
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className={`block mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}>
                          Category Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? "bg-[#1f2937] border-gray-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`block mb-2 text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        }`}>
                          Arabic Name
                        </label>
                        <input
                          type="text"
                          name="arabicName"
                          required
                          dir="rtl"
                          className={`w-full px-3 py-2 rounded-lg border ${
                            isDarkMode
                              ? "bg-[#1f2937] border-gray-700 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200"
                      >
                        Create Category
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Form Sheet */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Sheet */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 h-full w-full max-w-[320px] sm:max-w-[360px] z-50 ${
                isDarkMode ? "bg-[#141b2d]" : "bg-white"
              } shadow-xl`}
            >
              <div className="h-full overflow-y-auto scrollbar-hide">
                {/* Header with close button */}
                <div
                  className={`sticky top-0 z-10 px-6 py-4 flex justify-between items-center ${
                    isDarkMode
                      ? "bg-[#141b2d] border-b border-gray-800"
                      : "bg-white border-b"
                  }`}
                >
                  <h2
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedGallery ? "Edit Image" : "Add Image"}
                  </h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className={`p-2 rounded-full transition-colors ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white hover:bg-gray-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <GalleryForm
                    gallery={selectedGallery || undefined}
                    onSubmit={handleSubmit}
                    mode={selectedGallery ? "edit" : "create"}
                    categories={categories}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage; 