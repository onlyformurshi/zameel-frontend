import { useState, lazy, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { publicGalleryAPI } from '../api/public/gallery';

// Add translations
const translations = {
  en: {
    pageTitle: "Our Gallery",
    categories: {
      All: "All",
      Events: "Events",
      Students: "Students",
      Campus: "Campus"
    }
  },
  ar: {
    pageTitle: "معرض الصور",
    categories: {
      All: "الكل",
      Events: "الفعاليات",
      Students: "الطلاب",
      Campus: "الحرم الجامعي"
    }
  }
};

const LazyImage = lazy(() => import('../components/LazyImage'));

const ImagePlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 animate-pulse rounded-xl" />
);

// Update the interface for categories
interface CategoryItem {
  _id: string;
  name: string;
  arabicName: string;
  createdAt: string;
  updatedAt: string;
}

// Add this interface near the top of the file
interface GalleryItem {
  _id: string;
  title: string;
  arabicTitle: string;
  image: string;
  category: string;
  arabicCategory: string;
  createdAt: string;
  updatedAt: string;
}

const Gallery = () => {
  const { isDarkMode } = useThemeStore();
  const { isArabic } = useLanguageStore();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<null | {
    title: string;
    titleAr?: string;
    image: string;
  }>(null);

  const t = isArabic ? translations.ar : translations.en;

  const fetchGallery = async () => {
    try {
      const gallery = await publicGalleryAPI.getAllGallery();
      setGalleryData(gallery);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await publicGalleryAPI.getGalleryCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchGallery();
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
        >
          {t.pageTitle}
        </motion.h1>

        {/* Updated Category Filters with All option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                : isDarkMode
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {t.categories.All}
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
                selectedCategory === category._id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : isDarkMode
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {isArabic ? category.arabicName : category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Image Grid - Update the item mapping */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {galleryData
              .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
              .map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  className={`relative group rounded-xl overflow-hidden cursor-pointer ${
                    isDarkMode ? 'bg-white/5' : 'bg-gray-50'
                  }`}
                  onClick={() => setSelectedImage({
                    title: item.title,
                    titleAr: item.arabicTitle,
                    image: item.image
                  })}
                >
                  <div className="w-full h-[240px] bg-gray-800 rounded-xl">
                    <Suspense fallback={<ImagePlaceholder />}>
                      <LazyImage
                        src={item.image}
                        alt={isArabic ? item.arabicTitle || item.title : item.title}
                        className="object-cover w-full h-full rounded-xl"
                      />
                    </Suspense>
                  </div>
                  <div className={`absolute inset-0 flex items-end justify-start p-4 transition-opacity duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-t from-black/80 to-transparent' 
                      : 'bg-gradient-to-t from-black/60 to-transparent'
                  } opacity-0 group-hover:opacity-100`}>
                    <h3 className="text-white text-lg font-semibold">
                      {isArabic ? item.arabicTitle || item.title : item.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>

        {/* Image Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-2xl w-full max-h-[60vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Suspense fallback={<ImagePlaceholder />}>
                <LazyImage
                  src={selectedImage.image}
                  alt={isArabic ? selectedImage.titleAr || selectedImage.title : selectedImage.title}
                  className="max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg"
                />
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gallery; 