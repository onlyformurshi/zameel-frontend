import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../../store/themeStore";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiMoreVertical,
  FiX,
} from "react-icons/fi";
import { Event } from "../../../api/admin/types/adminEvent.types";
import { adminEventAPI } from "../../../api/admin/adminEvent";
import EventForm from "./EventForm";
import { useConfirm } from "../../../hooks/useConfirm";

const EventsPage = () => {
  const { isDarkMode } = useThemeStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { showConfirmation } = useConfirm();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await adminEventAPI.getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
    setActiveMenu(null);
  };

  const handleDeleteEvent = async (event: Event) => {
    const confirmed = await showConfirmation(
      "Delete Event",
      "Are you sure you want to delete this event? This action cannot be undone."
    );

    if (confirmed) {
      try {
        await adminEventAPI.deleteEvent(event._id);
        setEvents((prevEvents) =>
          prevEvents.filter((e) => e._id !== event._id)
        );
        setActiveMenu(null);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {

      if (selectedEvent) {
        // For update, make sure we're sending all required data
        const updatedEvent = await adminEventAPI.updateEvent(
          selectedEvent._id,
          formData
        );
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === selectedEvent._id ? updatedEvent : event
          )
        );
      } else {
        const newEvent = await adminEventAPI.createEvent(formData);
        setEvents((prevEvents) => [...prevEvents, newEvent]);
      }

      setIsFormOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error submitting event:", error);
    }
  };

  const toggleMenu = (eventId: string) => {
    setActiveMenu(activeMenu === eventId ? null : eventId);
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
          Manage Events
        </h1>
        <button
          onClick={handleAddEvent}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-xl overflow-hidden group ${
              isDarkMode
                ? "bg-[#141b2d] border border-gray-800"
                : "bg-white shadow-md"
            }`}
          >
            {/* Event Image */}
            <div className="relative aspect-video">
              <img
                src={event.thumbnail}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {/* Action Menu */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleMenu(event._id)}
                  aria-label={
                    activeMenu === event._id ? "Close menu" : "Open menu"
                  }
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                >
                  <FiMoreVertical className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">
                    {activeMenu === event._id ? "Close menu" : "Open menu"}
                  </span>
                </button>
                {/* Dropdown Menu */}
                {activeMenu === event._id && (
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
                      onClick={() => handleEditEvent(event)}
                      className={`w-full flex items-center px-4 py-2 text-sm ${
                        isDarkMode
                          ? "text-gray-200 hover:bg-gray-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      <FiEdit2 className="w-4 h-4 mr-2" aria-hidden="true" />
                      <span>Edit Event</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event)}
                      className={`w-full flex items-center px-4 py-2 text-sm text-red-500 ${
                        isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                      }`}
                      role="menuitem"
                    >
                      <FiTrash2 className="w-4 h-4 mr-2" aria-hidden="true" />
                      <span>Delete Event</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Event Content */}
            <div className="p-4">
              <h3
                className={`text-lg font-semibold mb-2 line-clamp-1 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {event.title}
              </h3>
              <p
                className={`text-sm mb-4 line-clamp-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <FiCalendar
                    className={
                      isDarkMode
                        ? "text-gray-400 w-4 h-4 mr-2"
                        : "text-gray-500 w-4 h-4 mr-2"
                    }
                  />
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    {event.date}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FiClock
                    className={
                      isDarkMode
                        ? "text-gray-400 w-4 h-4 mr-2"
                        : "text-gray-500 w-4 h-4 mr-2"
                    }
                  />
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    {event.time}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FiMapPin
                    className={
                      isDarkMode
                        ? "text-gray-400 w-4 h-4 mr-2"
                        : "text-gray-500 w-4 h-4 mr-2"
                    }
                  />
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                  >
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
                    {selectedEvent ? "Edit Event" : "Add Event"}
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
                  <EventForm
                    event={selectedEvent || undefined}
                    onSubmit={handleSubmit}
                    mode={selectedEvent ? "edit" : "create"}
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

export default EventsPage;
