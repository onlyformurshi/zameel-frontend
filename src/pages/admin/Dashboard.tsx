import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "../../store/themeStore";
import {
  FaUsers,
  FaGraduationCap,
  FaCalendarAlt,
  FaImages,
  FaHome,
  FaBook,
  FaQuestionCircle,
  FaPhoneAlt,
  FaHistory,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  adminDashboardAPI,
  DashboardStats,
} from "../../api/admin/adminDashboard";
import {
  RECENT_PAGES_CACHE_KEY,
  addPageToRecent,
} from "../../components/PageTracker";

interface RecentPage {
  title: string;
  type: string;
  path: string;
  timestamp: string;
}

const Dashboard = () => {
  const { isDarkMode } = useThemeStore();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [recentPages, setRecentPages] = useState<RecentPage[]>([]);

  // Load recent pages from cache
  useEffect(() => {
    try {
      const cached = localStorage.getItem(RECENT_PAGES_CACHE_KEY);
      if (cached) {
        const pages = JSON.parse(cached);
        setRecentPages(pages);
      }
    } catch (error) {
      console.error("Error loading recent pages:", error);
    }
  }, []);

  // Handle click on recent page link
  const handleRecentPageClick = (path: string) => {
    addPageToRecent(path);
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await adminDashboardAPI.getAllStats();
        setDashboardStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: "Total Faculty",
      value: dashboardStats?.overview?.facultyCount?.toString() || "0",
      icon: <FaUsers className="text-3xl text-blue-500" />,
      change: dashboardStats ? "+3 this month" : "No changes",
    },
    {
      label: "Active Courses",
      value: dashboardStats?.overview?.activeCourses?.toString() || "0",
      icon: <FaGraduationCap className="text-3xl text-green-500" />,
      change: dashboardStats ? `+2 new courses` : "No active courses",
    },
    {
      label: "Upcoming Events",
      value: dashboardStats?.overview?.upcomingEvents?.toString() || "0",
      icon: <FaCalendarAlt className="text-3xl text-purple-500" />,
      change: dashboardStats
        ? `${dashboardStats.overview?.upcomingEvents} total`
        : "No events",
    },
    {
      label: "Gallery Items",
      value: dashboardStats?.overview?.galleryCount?.toString() || "0",
      icon: <FaImages className="text-3xl text-yellow-500" />,
      change: dashboardStats ? "+8 this week" : "No items",
    },
  ];

  const quickLinks = [
    {
      title: "Home Page",
      description: "Edit main sections, hero content, and features",
      icon: <FaHome className="text-2xl" />,
      path: "/admin/home",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Courses",
      description: "Manage course listings and details",
      icon: <FaBook className="text-2xl" />,
      path: "/admin/courses",
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      title: "Events",
      description: "Update upcoming events and schedules",
      icon: <FaCalendarAlt className="text-2xl" />,
      path: "/admin/events",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      title: "Gallery",
      description: "Manage photos and media content",
      icon: <FaImages className="text-2xl" />,
      path: "/admin/gallery",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    },
    {
      title: "FAQ",
      description: "Edit frequently asked questions",
      icon: <FaQuestionCircle className="text-2xl" />,
      path: "/admin/faq",
      color: "bg-gradient-to-br from-red-500 to-red-600",
    },
    {
      title: "Contact",
      description: "Update contact information",
      icon: <FaPhoneAlt className="text-2xl" />,
      path: "/admin/contact",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1
        className={`text-2xl font-bold ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-xl ${
              isDarkMode
                ? "bg-[#141b2d] border border-gray-800"
                : "bg-white shadow-md"
            }`}
          >
            <div className="flex items-center justify-between">
              <div aria-hidden="true">{stat.icon}</div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  isDarkMode
                    ? "bg-green-500/10 text-green-500"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {stat.change}
              </div>
            </div>
            <h3
              className={`mt-4 text-2xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {stat.value}
            </h3>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recently Viewed Section */}
      <div
        className={`p-6 rounded-xl ${
          isDarkMode
            ? "bg-[#141b2d] border border-gray-800"
            : "bg-white shadow-md"
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <FaHistory className="text-2xl text-purple-500" />
          <h2
            className={`text-xl font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Recently Viewed
          </h2>
        </div>

        <div className="space-y-4">
          {recentPages.length > 0 ? (
            recentPages.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleRecentPageClick(item.path)}
                className={`block p-4 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "bg-[#1f2937] hover:bg-[#2d3748]"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className={`font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.type}
                    </p>
                  </div>
                  <span
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {formatTimeAgo(new Date(item.timestamp))}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p
              className={`text-center py-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No recently viewed pages
            </p>
          )}
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link, index) => (
          <Link
            key={link.title}
            to={link.path}
            onClick={() => addPageToRecent(link.path)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`h-[200px] p-6 rounded-xl cursor-pointer ${
                isDarkMode
                  ? "bg-[#141b2d] border border-gray-800 hover:bg-[#1f2937]"
                  : "bg-white shadow-md hover:shadow-lg"
              } transition-all duration-200`}
            >
              <div
                className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center text-white mb-4`}
              >
                {link.icon}
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {link.title}
              </h3>
              <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                {link.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
