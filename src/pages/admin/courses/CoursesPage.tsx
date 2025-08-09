/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../../store/themeStore";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaEye } from "react-icons/fa";
import { adminCourseAPI } from "../../../api/admin/adminCourse";
import { Course, CourseCategory } from "../../../api/admin/types/adminCourse.types";
import ConfirmationPopup from '../../../components/common/ConfirmationPopup';
import { useToastStore } from '../../../store/toastStore';
import { useConfirm } from '../../../hooks/useConfirm';
import CourseForm from "./CourseForm";

// Default course images from Unsplash
const DEFAULT_COURSE_IMAGES = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800", // Tech/Coding
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800", // Marketing
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800", // Business
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800", // Education
  "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=800", // Design
];

// Card component with reduced size
const Card = ({
  children,
  onEdit,
  onDelete,
  onView,
  isDarkMode,
  isActive,
}: {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  isDarkMode: boolean;
  isActive: boolean;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative rounded-xl ${
      isDarkMode ? "bg-[#141b2d]" : "bg-white"
    } shadow-sm hover:shadow-lg transition-all duration-200`}
  >
    {/* Status Indicator */}
    <div
      className={`absolute top-3 left-3 w-2 h-2 rounded-full ${
        isActive ? "bg-green-500" : "bg-red-500"
      }`}
    />

    {/* Action Buttons */}
    <div className="absolute top-2 right-2 flex items-center space-x-1">
      <button
        onClick={onView}
        className={`p-1 rounded-lg transition-colors duration-200 ${
          isDarkMode
            ? "hover:bg-gray-800 text-gray-400 hover:text-blue-400"
            : "hover:bg-gray-100 text-gray-500 hover:text-blue-600"
        }`}
      >
        <FaEye className="w-3 h-3" />
      </button>
      <button
        onClick={onEdit}
        className={`p-1 rounded-lg transition-colors duration-200 ${
          isDarkMode
            ? "hover:bg-gray-800 text-gray-400 hover:text-indigo-400"
            : "hover:bg-gray-100 text-gray-500 hover:text-indigo-600"
        }`}
      >
        <FaEdit className="w-3 h-3" />
      </button>
      <button
        onClick={onDelete}
        className={`p-1 rounded-lg transition-colors duration-200 ${
          isDarkMode
            ? "hover:bg-gray-800 text-gray-400 hover:text-red-400"
            : "hover:bg-gray-100 text-gray-500 hover:text-red-600"
        }`}
      >
        <FaTrash className="w-3 h-3" />
      </button>
    </div>

    {/* Content */}
    <div className="p-4 pt-8">{children}</div>
  </motion.div>
);

const CoursesPage = () => {
  const { isDarkMode } = useThemeStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    courseId: string | null;
  }>({
    isOpen: false,
    courseId: null,
  });

  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);

  // Add new state variables for category management
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | null>(null);

  const showToast = useToastStore(state => state.showToast);
  const { showConfirmation } = useConfirm();

  const fetchCourseCategories = async () => {
    const categories = await adminCourseAPI.getCourseCategories();
    setCourseCategories(categories);
  };

  useEffect(() => {
    loadCourses();
    fetchCourseCategories();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const coursesData = await adminCourseAPI.getCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get default image
  const getDefaultCourseImage = (index: number) => {
    return DEFAULT_COURSE_IMAGES[index % DEFAULT_COURSE_IMAGES.length];
  };

  const handleAddCourse = () => {
    setSheetMode('create');
    setSelectedCourse(null);
    setIsSheetOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSheetMode('edit');
    setSelectedCourse(course);
    setIsSheetOpen(true);
  };

  const handleViewCourse = (course: Course) => {
    setSheetMode('view');
    setSelectedCourse(course);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (courseId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      courseId,
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation.courseId) {
      try {
        await adminCourseAPI.deleteCourse(deleteConfirmation.courseId);
        setCourses(prevCourses => 
          prevCourses.filter(course => course._id !== deleteConfirmation.courseId)
        );
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      // Ensure category is included in formData
      if (!formData.get('category')) {
        showToast('Please select a category', 'error');
        return;
      }

      if (sheetMode === 'create') {
        const newCourse = await adminCourseAPI.createCourse(formData);
        setCourses(prev => [...prev, newCourse]);
        setIsSheetOpen(false);
      } else if (sheetMode === 'edit' && selectedCourse?._id) {
        const updatedCourse = await adminCourseAPI.updateCourse(
          selectedCourse._id,
          formData
        );
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course._id === selectedCourse._id ? updatedCourse : course
          )
        );
        setIsSheetOpen(false);
        setSelectedCourse(null);
      }
    } catch (error) {
      console.error('Failed to save course:', error);
      showToast('Failed to save course', 'error');
      throw error;
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryFormOpen(true);
  };

  const handleEditCategory = (category: CourseCategory) => {
    setSelectedCategory(category);
    setIsCategoryFormOpen(true);
  };

  const handleSubmitCategory = async (formData: FormData) => {
    try {
      if (selectedCategory) {
        const updatedCategory = await adminCourseAPI.updateCourseCategory(
          selectedCategory._id,
          formData
        );
        setCourseCategories(prevCats => 
          prevCats.map(cat => (cat._id === selectedCategory._id ? updatedCategory : cat))
        );
        showToast('Category updated successfully', 'success');
      } else {
        const newCategory = await adminCourseAPI.createCourseCategory(formData);
        setCourseCategories(prevCats => [...prevCats, newCategory]);
        showToast('Category created successfully', 'success');
      }
      setIsCategoryFormOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error submitting category:', error);
      showToast('Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (category: CourseCategory) => {
    const confirmed = await showConfirmation(
      'Delete Category',
      'Are you sure you want to delete this category? This action is only possible if no courses are using this category.'
    );

    if (confirmed) {
      try {
        await adminCourseAPI.deleteCourseCategory(category._id);
        setCourseCategories(prev => prev.filter(cat => cat._id !== category._id));
        showToast('Category deleted successfully', 'success');
      } catch (error: any) {
        console.error("Error deleting category:", error);
        const errorMessage = error.response?.data?.message || 'Failed to delete category';
        showToast(errorMessage, 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, courseId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Manage Courses
          </h2>
          <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Add and edit course offerings
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAddCategory}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          <button
            onClick={handleAddCourse}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className={`mb-8 p-6 rounded-xl ${isDarkMode ? "bg-[#1f2937]" : "bg-white"} shadow-sm`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Course Categories
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseCategories.map((category) => (
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
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-red-900/30 hover:bg-red-900/50 text-red-400"
                      : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {courses.map((course, index) => (
          <Card
            key={course._id}
            onEdit={() => handleEditCourse(course)}
            onDelete={() => handleDeleteClick(course._id)}
            onView={() => handleViewCourse(course)}
            isDarkMode={isDarkMode}
            isActive={true}
          >
            <div className="space-y-3">
              <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={course.image || getDefaultCourseImage(index)}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <div>
                  <h3
                    className={`text-base font-semibold line-clamp-1 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {course.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-indigo-400" : "text-indigo-600"
                    }`}
                  >
                    {course.arabicTitle}
                  </p>
                </div>
                <p
                  className={`mt-2 text-sm line-clamp-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {course.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`p-2.5 rounded-lg ${
                    isDarkMode ? "bg-[#1f2937]" : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Duration
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {course.duration}
                  </p>
                </div>
                <div
                  className={`p-2.5 rounded-lg ${
                    isDarkMode ? "bg-[#1f2937]" : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Schedule
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {course.schedule}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {course.features.slice(0, 2).map((feature, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode
                        ? "bg-[#1f2937] text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {feature}
                  </span>
                ))}
                {course.features.length > 2 && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode
                        ? "bg-[#1f2937] text-gray-300"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    +{course.features.length - 2} more
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Category Form Sheet */}
      <AnimatePresence>
        {isCategoryFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCategoryFormOpen(false);
                setSelectedCategory(null);
              }}
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
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button
                  onClick={() => {
                    setIsCategoryFormOpen(false);
                    setSelectedCategory(null);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FaTimes className="w-5 h-5" />
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
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Category Name (English)
                      </label>
                      <input
                        type="text"
                        name="name"
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
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Category Name (Arabic)
                      </label>
                      <input
                        type="text"
                        name="arabicName"
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
                        onClick={() => {
                          setIsCategoryFormOpen(false);
                          setSelectedCategory(null);
                        }}
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
                        {selectedCategory ? 'Update' : 'Save'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slide-out Sheet */}
      <AnimatePresence>
        {isSheetOpen && (
          <div className="absolute inset-0" style={{ zIndex: 9999 }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSheetOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className={`fixed right-0 top-0 h-full w-full max-w-[320px] sm:max-w-[360px] overflow-y-auto ${
                isDarkMode
                  ? "bg-[#141b2d] border-l border-gray-800"
                  : "bg-white"
              } shadow-xl z-50`}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 backdrop-blur-xl bg-white/80 dark:bg-[#141b2d]/80">
                <h2
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {sheetMode === "create"
                    ? "Add New Course"
                    : sheetMode === "edit"
                    ? "Edit Course"
                    : "Course Details"}
                </h2>
                <button
                  onClick={() => setIsSheetOpen(false)}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode
                      ? "hover:bg-gray-800 text-gray-400"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-4">
                <CourseForm
                  course={selectedCourse || undefined}
                  mode={sheetMode}
                  onSubmit={handleSubmit}
                  courseCategories={courseCategories}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursesPage;
