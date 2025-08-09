/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiX } from 'react-icons/fi';
import { FAQForm } from './FAQForm';
import { FAQ, FAQCategory, CreateFAQDto } from '../../../api/admin/types/adminFAQ.types';
import { adminFAQAPI } from '../../../api/admin/adminFAQ';
import { useConfirm } from '../../../hooks/useConfirm';
import { useToastStore } from '../../../store/toastStore';

const FAQPage = () => {
  const { isDarkMode } = useThemeStore();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | undefined>(undefined);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { showConfirmation } = useConfirm();
  const showToast = useToastStore(state => state.showToast);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isCategoryEditSheetOpen, setIsCategoryEditSheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);

  const fetchData = async () => {
    try {
      const [faqsData, categoriesData] = await Promise.all([
        adminFAQAPI.getFAQs(),
        adminFAQAPI.getFAQCategories(),
      ]);
      setFaqs(faqsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to fetch FAQs', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddFAQ = () => {
    setSelectedFAQ(undefined);
    setIsFormOpen(true);
  };

  const handleEditFAQ = (faq: FAQ) => {
    if (!faq.category?._id) {
      showToast('Invalid FAQ data', 'error');
      return;
    }
    
    setSelectedFAQ(faq);
    setIsFormOpen(true);
    setActiveMenu(null);
  };

  const handleDeleteFAQ = async (faq: FAQ) => {
    const confirmed = await showConfirmation(
      'Delete FAQ',
      'Are you sure you want to delete this FAQ? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        await adminFAQAPI.deleteFAQ(faq._id);
        setFaqs(prevFaqs => prevFaqs.filter(f => f._id !== faq._id));
        setActiveMenu(null);
        showToast('FAQ deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting FAQ:', error);
        showToast('Failed to delete FAQ', 'error');
      }
    }
  };

  const handleSubmit = async (formData: CreateFAQDto) => {
    try {
      if (selectedFAQ) {
        const updatedFAQ = await adminFAQAPI.updateFAQ(selectedFAQ._id, formData);
        setFaqs(prevFaqs =>
          prevFaqs.map(faq => (faq._id === selectedFAQ._id ? updatedFAQ : faq))
        );
        showToast('FAQ updated successfully', 'success');
      } else {
        const newFAQ = await adminFAQAPI.createFAQ(formData);
        setFaqs(prevFaqs => [...prevFaqs, newFAQ]);
        showToast('FAQ created successfully', 'success');
      }
      setIsFormOpen(false);
      setSelectedFAQ(undefined);
    } catch (error) {
      console.error('Error submitting FAQ:', error);
      showToast('Failed to save FAQ', 'error');
    }
  };

  const toggleMenu = (faqId: string) => {
    setActiveMenu(activeMenu === faqId ? null : faqId);
  };

  const renderCategoryBadge = (faq: FAQ) => {
    if (!faq.category) {
      return (
        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-500 text-white">
          Uncategorized
        </span>
      );
    }

    return (
      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        {faq.category.name || 'Unnamed Category'}
      </span>
    );
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryFormOpen(true);
  };

  const handleSubmitCategory = async (formData: FormData) => {
    try {
      const categoryData = {
        name: formData.get('name') as string,
        arabicName: formData.get('arabicName') as string,
      };

      if (selectedCategory) {
        const updatedCategory = await adminFAQAPI.updateFAQCategory(selectedCategory._id, categoryData);
        setCategories(prevCats => 
          prevCats.map(cat => (cat._id === selectedCategory._id ? updatedCategory : cat))
        );
        showToast('Category updated successfully', 'success');
      } else {
        const newCategory = await adminFAQAPI.createFAQCategory(categoryData);
        setCategories(prevCats => [...prevCats, newCategory]);
        showToast('Category created successfully', 'success');
      }
      setIsCategoryFormOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error submitting category:', error);
      showToast('Failed to save category', 'error');
    }
  };

  const handleEditCategory = (category: FAQCategory) => {
    setEditingCategory(category);
    setIsCategoryEditSheetOpen(true);
  };

  const handleEditCategorySubmit = async (formData: { name: string; arabicName: string }) => {
    if (!editingCategory) return;

    try {
      const updatedCategory = await adminFAQAPI.updateFAQCategory(editingCategory._id, formData);
      setCategories(prev => prev.map(cat => 
        cat._id === editingCategory._id ? updatedCategory : cat
      ));
      setIsCategoryEditSheetOpen(false);
      setEditingCategory(null);
      showToast('Category updated successfully', 'success');
    } catch (error) {
      console.error("Error updating category:", error);
      showToast('Failed to update category', 'error');
    }
  };

  const handleDeleteCategory = async (category: FAQCategory) => {
    const confirmed = await showConfirmation(
      'Delete Category',
      'Are you sure you want to delete this category? This action is only possible if no FAQs are using this category.'
    );

    if (confirmed) {
      try {
        await adminFAQAPI.deleteFAQCategory(category._id);
        setCategories(prev => prev.filter(cat => cat._id !== category._id));
        showToast('Category deleted successfully', 'success');
      } catch (error: any) {
        console.error("Error deleting category:", error);
        const errorMessage = error.response?.data?.message || 'Failed to delete category';
        showToast(errorMessage, 'error');
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Manage FAQs
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
            onClick={handleAddFAQ}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add FAQ</span>
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className={`mb-8 p-6 rounded-xl ${isDarkMode ? "bg-[#1f2937]" : "bg-white"} shadow-sm`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            FAQ Categories
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

      {/* FAQ List */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Frequently Asked Questions
        </h2>
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-lg ${
                isDarkMode 
                  ? 'bg-[#141b2d] border border-gray-800' 
                  : 'bg-white shadow-md'
              }`}
            >
              <div className="p-4">
                {/* Category Badge and Actions */}
                <div className="flex justify-between items-start mb-4">
                  {renderCategoryBadge(faq)}
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(faq._id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode 
                          ? 'hover:bg-gray-800' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                    {/* Dropdown Menu */}
                    {activeMenu === faq._id && (
                      <div 
                        className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                          isDarkMode 
                            ? 'bg-[#1f2937] border border-gray-700' 
                            : 'bg-white border border-gray-200'
                        }`}
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <button
                          onClick={() => handleEditFAQ(faq)}
                          className={`w-full flex items-center px-4 py-2 text-sm ${
                            isDarkMode 
                              ? 'text-gray-200 hover:bg-gray-800' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          role="menuitem"
                        >
                          <FiEdit2 className="w-4 h-4 mr-2" aria-hidden="true" />
                          <span>Edit FAQ</span>
                        </button>
                        <button
                          onClick={() => handleDeleteFAQ(faq)}
                          className={`w-full flex items-center px-4 py-2 text-sm text-red-500 ${
                            isDarkMode 
                              ? 'hover:bg-gray-800' 
                              : 'hover:bg-gray-100'
                          }`}
                          role="menuitem"
                        >
                          <FiTrash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                          <span>Delete FAQ</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Question and Answer */}
                <div className="space-y-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {faq.question}
                    </h3>
                  </div>
                  <div>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category Form Sheet */}
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className={`fixed right-0 top-0 h-full w-full max-w-[320px] sm:max-w-[360px] z-50 overflow-y-auto
                ${isDarkMode ? 'bg-[#141b2d]' : 'bg-white'} shadow-xl`}
            >
              <div className="sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                <h2 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={() => setIsCategoryFormOpen(false)}
                  className={`p-2 rounded-full transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiMoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleSubmitCategory(formData);
                }}>
                  <div className="space-y-4">
                    <div>
                      <label 
                        htmlFor="name" 
                        className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                      >
                        Category Name (English)
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={selectedCategory?.name || ''}
                        required
                        className={`mt-1 block w-full rounded-md shadow-sm ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'border-gray-300 text-gray-900'
                        } focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="arabicName" 
                        className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                      >
                        Category Name (Arabic)
                      </label>
                      <input
                        type="text"
                        name="arabicName"
                        id="arabicName"
                        dir="rtl"
                        defaultValue={selectedCategory?.arabicName || ''}
                        required
                        className={`mt-1 block w-full rounded-md shadow-sm ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-700 text-white' 
                            : 'border-gray-300 text-gray-900'
                        } focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsCategoryFormOpen(false)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                          isDarkMode
                            ? 'text-gray-200 hover:text-white hover:bg-gray-700'
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className={`fixed right-0 top-0 h-full w-full max-w-[320px] sm:max-w-[360px] z-50 overflow-y-auto
                ${isDarkMode ? 'bg-[#141b2d]' : 'bg-white'} shadow-xl`}
            >
              <div className="sticky top-0 z-10 px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                <h2 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedFAQ ? 'Edit FAQ' : 'Add New FAQ'}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className={`p-2 rounded-full transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiMoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <FAQForm
                  initialData={selectedFAQ}
                  onSubmit={handleSubmit}
                  categories={categories}
                  onClose={() => {
                    setIsFormOpen(false);
                    setSelectedFAQ(undefined);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQPage; 