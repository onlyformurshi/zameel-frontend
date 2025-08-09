import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const RECENT_PAGES_CACHE_KEY = 'recently_viewed_pages';
export const MAX_RECENT_PAGES = 6;

interface RecentPage {
  title: string;
  type: string;
  path: string;
  timestamp: string;
}

const getTitleFromPath = (path: string): { title: string; type: string } => {
  const pathSegments = path.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  const typeMap: Record<string, string> = {
    'courses': 'Course',
    'events': 'Event',
    'gallery': 'Gallery',
    'faculty': 'Faculty',
    'faq': 'FAQ',
    'contact': 'Contact',
    'home': 'Home',
    'footer': 'Footer'
  };

  const titleMap: Record<string, string> = {
    'courses': 'Course Management',
    'events': 'Event Management',
    'gallery': 'Gallery Management',
    'faculty': 'Faculty Management',
    'faq': 'FAQ Management',
    'contact': 'Contact Management',
    'home': 'Home Page Management',
    'footer': 'Footer Management'
  };

  return {
    title: titleMap[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1),
    type: typeMap[lastSegment] || 'Page'
  };
};

export const addPageToRecent = (path: string) => {
  if (path === '/admin/dashboard') return;

  const { title, type } = getTitleFromPath(path);
  const newPage: RecentPage = {
    title,
    type,
    path,
    timestamp: new Date().toISOString()
  };

  try {
    // Get existing pages from cache
    const cached = localStorage.getItem(RECENT_PAGES_CACHE_KEY);
    const existingPages: RecentPage[] = cached ? JSON.parse(cached) : [];

    // Remove duplicate if exists
    const filteredPages = existingPages.filter(p => p.path !== newPage.path);

    // Add new page at the beginning and limit to MAX_RECENT_PAGES
    const newPages = [newPage, ...filteredPages].slice(0, MAX_RECENT_PAGES);

    // Save to localStorage
    localStorage.setItem(RECENT_PAGES_CACHE_KEY, JSON.stringify(newPages));
  } catch (error) {
    console.error('Error updating recent pages:', error);
  }
};

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/admin/')) {
      addPageToRecent(location.pathname);
    }
  }, [location.pathname]);

  return null;
};

export default PageTracker; 