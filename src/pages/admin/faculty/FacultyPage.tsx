import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../../store/themeStore';
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';
import { Faculty } from '../../../api/admin/types/adminFaculty.types';
import { adminFacultyAPI } from '../../../api/admin/adminFaculty';
import FacultyForm from './FacultyForm';
import ConfirmationPopup from '../../../components/common/ConfirmationPopup';

// Card component for faculty items
const Card = ({
  children,
  onEdit,
  onDelete,
  onView,
  isDarkMode,
}: {
  children: React.ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  isDarkMode: boolean;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative rounded-xl overflow-hidden ${
      isDarkMode ? "bg-[#141b2d]" : "bg-white"
    } shadow-sm hover:shadow-lg transition-all duration-200`}
  >
    {/* Action Buttons */}
    <div className="absolute top-2 right-2 flex items-center space-x-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onView();
        }}
        className={`p-1 rounded-lg transition-colors duration-200 ${
          isDarkMode
            ? "hover:bg-gray-800 text-gray-400 hover:text-blue-400"
            : "hover:bg-gray-100 text-gray-500 hover:text-blue-600"
        }`}
      >
        <FaEye className="w-3 h-3" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className={`p-1 rounded-lg transition-colors duration-200 ${
          isDarkMode
            ? "hover:bg-gray-800 text-gray-400 hover:text-indigo-400"
            : "hover:bg-gray-100 text-gray-500 hover:text-indigo-600"
        }`}
      >
        <FaEdit className="w-3 h-3" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
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

const AdminFacultyPage = () => {
  const { isDarkMode } = useThemeStore();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    facultyId: string | null;
  }>({
    isOpen: false,
    facultyId: null,
  });

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      setIsLoading(true);
      const facultyData = await adminFacultyAPI.getFaculty();
      setFaculty(facultyData);
    } catch (error) {
      console.error("Failed to load faculty:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFaculty = () => {
    setSheetMode('create');
    setSelectedFaculty(null);
    setIsSheetOpen(true);
  };

  const handleEditFaculty = (member: Faculty) => {
    setSheetMode('edit');
    setSelectedFaculty(member);
    setIsSheetOpen(true);
  };

  const handleViewFaculty = (member: Faculty) => {
    setSheetMode('view');
    setSelectedFaculty(member);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (facultyId: string) => {
    setDeleteConfirmation({
      isOpen: true,
      facultyId,
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmation.facultyId) {
      try {
        await adminFacultyAPI.deleteFaculty(deleteConfirmation.facultyId);
        setFaculty(prevFaculty =>
          prevFaculty.filter(member => member._id !== deleteConfirmation.facultyId)
        );
        setDeleteConfirmation({ isOpen: false, facultyId: null });
      } catch (error) {
        console.error('Failed to delete faculty:', error);
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (sheetMode === 'create') {
        const newFaculty = await adminFacultyAPI.createFaculty(formData);
        setFaculty(prev => [...prev, newFaculty]);
        setIsSheetOpen(false);
      } else if (sheetMode === 'edit' && selectedFaculty?._id) {
        const updatedFaculty = await adminFacultyAPI.updateFaculty(
          selectedFaculty._id,
          formData
        );
        setFaculty(prevFaculty =>
          prevFaculty.map(member =>
            member._id === selectedFaculty._id ? updatedFaculty : member
          )
        );
        setIsSheetOpen(false);
        setSelectedFaculty(null);
      }
    } catch (error) {
      console.error('Failed to save faculty:', error);
      throw error;
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
        onClose={() => setDeleteConfirmation({ isOpen: false, facultyId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Faculty"
        message="Are you sure you want to delete this faculty member? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Manage Faculty
          </h2>
          <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Add and edit faculty members
          </p>
        </div>
        <button
          onClick={handleAddFaculty}
          className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow group"
        >
          <FaPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          <span className="hidden sm:inline ml-2 font-medium">Add Faculty</span>
        </button>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {faculty.map((member) => (
          <Card
            key={member._id}
            onEdit={() => handleEditFaculty(member)}
            onDelete={() => handleDeleteClick(member._id)}
            onView={() => handleViewFaculty(member)}
            isDarkMode={isDarkMode}
          >
            <div className="space-y-2 sm:space-y-3">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>
              <div>
                {member.isLeadershipTeam === "true" && (
                  <span className={`text-xs ${
                    isDarkMode ? "text-yellow-400" : "text-yellow-600"
                  }`}>
                    Leadership Team Member
                  </span>
                )}
                <div>
                  <h3 className={`text-sm font-semibold line-clamp-1 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}>
                    {member.name}
                  </h3>
                  <p className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {member.arabicName}
                  </p>
                  <p className={`text-xs ${
                    isDarkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}>
                    {member.position}
                  </p>
                  <p className={`text-xs ${
                    isDarkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}>
                    {member.arabicPosition}
                  </p>
                </div>
                <p className={`mt-1 text-xs line-clamp-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {member.bio}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

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
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}>
                  {sheetMode === "create"
                    ? "Add New Faculty"
                    : sheetMode === "edit"
                    ? "Edit Faculty"
                    : "Faculty Details"}
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
                <FacultyForm
                  faculty={selectedFaculty || undefined}
                  mode={sheetMode}
                  onSubmit={handleSubmit}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminFacultyPage; 