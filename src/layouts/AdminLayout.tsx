import { useState, useEffect, useRef, memo, Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { 
  FaHome, FaBars, FaTimes, FaBook, FaCalendarAlt, 
  FaImages, FaQuestionCircle, FaPhoneAlt, FaSun, 
  FaMoon, FaSignOutAlt, FaTachometerAlt, FaList,
  FaUserTie, FaChevronDown, FaInfoCircle
} from 'react-icons/fa';
import PageTracker from '../components/PageTracker';

// Memoized Navigation Menu Component
const NavigationMenu = memo(({ 
  isSidebarOpen, 
  isDarkMode, 
  currentPath 
}: { 
  isSidebarOpen: boolean; 
  isDarkMode: boolean;
  currentPath: string;
}) => {
  const menuItems = [
    { 
      icon: <FaTachometerAlt className="text-xl" aria-hidden="true" />, 
      label: 'Dashboard', 
      path: '/admin/dashboard' 
    },
    { 
      icon: <FaHome className="text-xl" aria-hidden="true" />, 
      label: 'Home', 
      path: '/admin/home' 
    },
    { 
      icon: <FaBook className="text-xl" aria-hidden="true" />, 
      label: 'Courses', 
      path: '/admin/courses' 
    },
    { 
      icon: <FaUserTie className="text-xl" aria-hidden="true" />, 
      label: 'Faculty', 
      path: '/admin/faculty' 
    },
    { 
      icon: <FaInfoCircle className="text-xl" aria-hidden="true" />, 
      label: 'About Us', 
      path: '/admin/aboutus' 
    },
    { 
      icon: <FaCalendarAlt className="text-xl" aria-hidden="true" />, 
      label: 'Events', 
      path: '/admin/events' 
    },
    { 
      icon: <FaImages className="text-xl" aria-hidden="true" />, 
      label: 'Gallery', 
      path: '/admin/gallery' 
    },
    { 
      icon: <FaQuestionCircle className="text-xl" aria-hidden="true" />, 
      label: 'FAQ', 
      path: '/admin/faq' 
    },
    { 
      icon: <FaPhoneAlt className="text-xl" aria-hidden="true" />, 
      label: 'Contact', 
      path: '/admin/contact' 
    },
    { 
      icon: <FaList className="text-xl" aria-hidden="true" />, 
      label: 'Footer', 
      path: '/admin/footer' 
    },
  ];

  return (
    <nav className="py-4">
      <ul className="space-y-1.5 px-3">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              aria-label={`Go to ${item.label}`}
              className={`flex items-center ${!isSidebarOpen ? 'justify-center' : 'space-x-3'} px-3 py-3 rounded-lg transition-colors duration-200 ${
                currentPath === item.path 
                  ? isDarkMode 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-900'
                  : isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div aria-hidden="true">{item.icon}</div>
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
});

// Memoized Sidebar Component
const Sidebar = memo(({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  isDarkMode, 
  toggleTheme 
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}) => {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const { logout } = useAuthStore();

  useEffect(() => {
    const checkScroll = () => {
      if (navRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = navRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight && scrollHeight - clientHeight - scrollTop > 10);
      }
    };

    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener('scroll', checkScroll);
      checkScroll();
    }

    return () => {
      if (navElement) {
        navElement.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen z-[9999] transition-all duration-300 flex flex-col ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } ${
          isDarkMode 
            ? 'bg-[#141b2d] border-r border-gray-800' 
            : 'bg-white shadow-lg'
        }`}
      >
        {/* Logo and Toggle Button */}
        <div className={`flex items-center justify-between px-4 py-3.5 ${
          isDarkMode 
            ? 'border-b border-gray-800' 
            : 'border-b'
        }`}>
          <div className={`flex items-center space-x-3 ${!isSidebarOpen && 'hidden'}`}>
            <img 
              src={isDarkMode ? "/dark.png" : "/light.png"} 
              alt="Logo" 
              className="w-7 h-7 object-contain" 
            />
            <span className={`font-light text-lg ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Zameel
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'hover:bg-[#1f2937] text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            } ${!isSidebarOpen ? 'w-full flex justify-center' : ''}`}
          >
            {isSidebarOpen ? <FaTimes size={17} /> : <FaBars size={17} />}
          </button>
        </div>

        {/* Main content area - Flex grow to push bottom section down */}
        <div className="flex-grow flex flex-col min-h-0">
          {/* Navigation - Scrollable container */}
          <div 
            ref={navRef}
            className="flex-1 overflow-y-auto scrollbar-hide"
          >
            <NavigationMenu 
              isSidebarOpen={isSidebarOpen}
              isDarkMode={isDarkMode}
              currentPath={location.pathname}
            />
          </div>

          {/* Scroll Indicator */}
          {showScrollIndicator && isSidebarOpen && (
            <div 
              className={`absolute bottom-[90px] left-0 right-0 flex justify-center py-1.5 ${
                isDarkMode 
                  ? 'bg-gradient-to-t from-[#141b2d] via-[#141b2d] to-transparent' 
                  : 'bg-gradient-to-t from-white via-white to-transparent'
              }`}
            >
              <FaChevronDown 
                className={`animate-bounce ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`} 
                size={14} 
              />
            </div>
          )}
        </div>

        {/* Bottom Section: Theme Toggle & Logout - Always visible */}
        <div className={`mt-auto p-3 space-y-2 ${
          isDarkMode 
            ? 'border-t border-gray-800' 
            : 'border-t'
        }`}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center rounded-lg transition-all duration-200 ${
              !isSidebarOpen ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
            } ${
              isDarkMode
                ? 'hover:bg-[#1f2937] text-gray-300'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
            title={!isSidebarOpen ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : undefined}
          >
            {isSidebarOpen && <span className="font-medium text-[14px]">Theme</span>}
            {isDarkMode ? <FaSun size={17} /> : <FaMoon size={17} />}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center rounded-lg transition-all duration-200 ${
              !isSidebarOpen ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'
            } ${
              isDarkMode
                ? 'hover:bg-[#1f2937] text-gray-300'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
            title={!isSidebarOpen ? 'Logout' : undefined}
          >
            {isSidebarOpen && <span className="font-medium text-[14px]">Logout</span>}
            <FaSignOutAlt size={17} />
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
});

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adminSidebarOpen');
      return saved !== null ? JSON.parse(saved) : window.innerWidth >= 768;
    }
    return true;
  });
  
  const { isDarkMode, toggleTheme } = useThemeStore();

  useEffect(() => {
    localStorage.setItem('adminSidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      const shouldOpen = window.innerWidth >= 768;
      setIsSidebarOpen(shouldOpen);
      localStorage.setItem('adminSidebarOpen', JSON.stringify(shouldOpen));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0f1e] dark:bg-[#0a0f1e] overflow-hidden">
      <PageTracker />
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <main 
        className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64 ml-16' : 'md:ml-16 ml-16'
        } ${
          isDarkMode ? 'bg-[#0a0f1e]' : 'bg-gray-100'
        }`}
      >
        <div className="p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default memo(AdminLayout); 