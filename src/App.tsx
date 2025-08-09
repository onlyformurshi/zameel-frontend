import { Suspense, useEffect, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import InteractiveBackground from './components/InteractiveBackground';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';

// Lazy load components
const Navbar = lazy(() => import('./components/Navbar'));
const LettersBackground = lazy(() => import('./components/three/LettersBackground'));
const ScrollProgress = lazy(() => import('./components/ScrollProgress'));
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const Footer = lazy(() => import('./components/Footer'));
const WhatsAppButton = lazy(() => import('./components/WhatsAppButton'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// Lazy load pages with loading boundaries
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Courses = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Events = lazy(() => import('./pages/Events'));
const Faculty = lazy(() => import('./pages/Faculty'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Lazy load admin pages
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminHome = lazy(() => import('./pages/admin/home/HomePage'));
const AdminCourses = lazy(() => import('./pages/admin/courses/CoursesPage'));
const AdminEvents = lazy(() => import('./pages/admin/events/EventsPage'));
const AdminGallery = lazy(() => import('./pages/admin/gallery/GalleryPage'));
const AdminFAQ = lazy(() => import('./pages/admin/faq/FAQPage'));
const AdminContact = lazy(() => import('./pages/admin/contact/ContactPage'));
const WhyChooseUsPage = lazy(() => import('./pages/admin/home/WhyChooseUsPage'));
const AdminFooter = lazy(() => import('./pages/admin/footer/FooterPage'));
const AdminFaculty = lazy(() => import('./pages/admin/faculty/FacultyPage'));
const AdminAboutUs = lazy(() => import('./pages/admin/aboutus/AboutUsPage'));

// Loading fallback component with theme support
const PageLoadingFallback = () => {
  const { isDarkMode } = useThemeStore();
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDarkMode ? 'bg-dark' : 'bg-surface'
    }`}>
      <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse" />
    </div>
  );
};

function App() {
  const location = useLocation();
  const { isDarkMode } = useThemeStore();
  const { checkAuthStatus, setPreviousPath } = useAuthStore();

  // Check auth status on app load
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Store previous path for back navigation
  useEffect(() => {
    if (!location.pathname.includes('/admin/login')) {
      setPreviousPath(location.pathname);
    }
  }, [location, setPreviousPath]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen relative ${
      isDarkMode 
        ? 'bg-dark text-white' 
        : 'bg-surface text-gray-900'
    }`}>
      <Toast />
      {/* Interactive Background - Show everywhere except admin pages */}
      {!isAdminPage && <InteractiveBackground />}

      <Suspense fallback={<PageLoadingFallback />}>
        <CustomCursor />
        
        {/* Letters Background - Only show on home page */}
        {isHomePage && (
          <Suspense fallback={null}>
            <LettersBackground />
          </Suspense>
        )}

        <div className="relative z-10">
          {/* Show navbar except on admin pages */}
          {!isAdminPage && (
            <Suspense fallback={<PageLoadingFallback />}>
              <Navbar />
            </Suspense>
          )}
          
          {!isAdminPage && (
            <Suspense fallback={null}>
              <ScrollProgress />
            </Suspense>
          )}

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Home />
                  </Suspense>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <About />
                  </Suspense>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Contact />
                  </Suspense>
                } 
              />
              <Route 
                path="/courses" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Courses />
                  </Suspense>
                } 
              />
              <Route 
                path="/gallery" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Gallery />
                  </Suspense>
                } 
              />
              <Route 
                path="/privacy-policy" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <PrivacyPolicy />
                  </Suspense>
                } 
              />
              <Route 
                path="/terms-of-service" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <TermsOfService />
                  </Suspense>
                } 
              />
              <Route 
                path="/faq" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <FAQ />
                  </Suspense>
                } 
              />
              <Route 
                path="/events" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Events />
                  </Suspense>
                } 
              />
              <Route 
                path="/faculty" 
                element={
                  <Suspense fallback={<PageLoadingFallback />}>
                    <Faculty />
                  </Suspense>
                } 
              />

              {/* Admin Routes */}
              <Route path="/admin">
                {/* Admin Login - separate from other admin routes */}
                <Route path="login" element={<Suspense fallback={<PageLoadingFallback />}><AdminLogin /></Suspense>} />
                
                {/* Protected Admin Routes */}
                <Route path="*" element={
                  <ProtectedRoute>
                    <Suspense fallback={<PageLoadingFallback />}>
                      <AdminLayout />
                    </Suspense>
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="home" element={<AdminHome />} />
                  <Route path="courses" element={<AdminCourses />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="faq" element={<AdminFAQ />} />
                  <Route path="contact" element={<AdminContact />} />
                  <Route path="aboutus" element={<AdminAboutUs />} />
                  <Route path="home/*">
                    <Route index element={<AdminHome />} />
                    <Route path="why-choose-us" element={<WhyChooseUsPage />} />
                  </Route>
                  <Route path="footer" element={<AdminFooter />} />
                  <Route path="faculty" element={<AdminFaculty />} />
                  
                  {/* Catch invalid admin routes */}
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>
              </Route>

              {/* Catch all invalid routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>

          {/* Show footer except on admin pages */}
          {!isAdminPage && (
            <Suspense fallback={<PageLoadingFallback />}>
              <Footer />
            </Suspense>
          )}
        </div>

        {/* WhatsApp Button - Show except on admin pages */}
        {!isAdminPage && (
          <Suspense fallback={null}>
            <WhatsAppButton />
          </Suspense>
        )}
      </Suspense>
      <ConfirmDialog />
    </div>
  );
}

export default App;
