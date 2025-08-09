import axiosInstance from "../axiosInstance/api";
import { useToastStore } from "../../store/toastStore";
import { AdminEventAPI } from "./types/adminEvent.types";

interface EventData {
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  date: Date | string;
  time: string;
  category: string;
  arabicCategory: string;
  location: string;
  arabicLocation: string;
  thumbnail: string;
  eventImages: string[];
  removedImages?: string[];
  [key: string]: string | string[] | Date | undefined;
}

const isValidFile = (file: any): file is File => {
  return (
    file instanceof File ||
    (file && file.type && file.type.startsWith("image/"))
  );
};

const convertImageToBase64 = async (file: File | string): Promise<string> => {
  // If it's already a base64 string, return it
  if (typeof file === "string" && file.startsWith("data:image/")) {
    return file;
  }

  // If it's not a valid file, throw an error
  if (!isValidFile(file)) {
    throw new Error("Invalid file format");
  }

  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to base64"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file as File);
    } catch {
      useToastStore.getState().showToast("Failed to process image", "error");
      reject(new Error("Failed to process image"));
    }
  });
};

export const adminEventAPI: AdminEventAPI = {
  getEvents: async () => {
    try {
      const response = await axiosInstance.get("/events");
      return response.data;
    } catch (error) {
      useToastStore.getState().showToast("Failed to fetch events", "error");
      throw error;
    }
  },

  createEvent: async (formData: FormData) => {
    try {
      const eventData: Partial<EventData> = {};

      // Convert form data to object and ensure all required fields are present
      for (const [key, value] of formData.entries()) {
        if (
          key !== "thumbnail" &&
          key !== "eventImages" &&
          key !== "eventImage"
        ) {
          eventData[key as keyof EventData] = value as string;
        }
      }

      // Handle thumbnail (required)
      const thumbnailFile =
        formData.get("thumbnail") || formData.get("eventImage");
      if (!thumbnailFile) {
        throw new Error("Thumbnail is required");
      }

      try {
        eventData.thumbnail = await convertImageToBase64(thumbnailFile as File);
      } catch  {
        useToastStore.getState().showToast("Failed to process thumbnail image", "error");
      }

      // Handle eventImages (optional)
      const eventImageFiles = Array.from(formData.getAll("eventImages"));
      if (eventImageFiles.length > 0) {
        try {
          eventData.eventImages = await Promise.all(
            eventImageFiles
              .filter((file) => isValidFile(file))
              .map((file) => convertImageToBase64(file as File))
          );
        } catch  {
          useToastStore.getState().showToast("Failed to process event images", "error");
        }
      } else {
        eventData.eventImages = [];
      }

      // Both category and arabicCategory should use the same category ID
      const categoryId = eventData.category;
      eventData.arabicCategory = categoryId;

      console.log("Sending event data:", eventData); // Debug log

      const response = await axiosInstance.post("/events", eventData);
      useToastStore
        .getState()
        .showToast("Event created successfully", "success");
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create event";
      useToastStore.getState().showToast(errorMessage, "error");
      throw error;
    }
  },

  updateEvent: async (id: string, formData: FormData) => {
    try {
      if (!id) throw new Error("Event ID is required for update");

      // Convert FormData to object and ensure all fields are included
      const eventData: Partial<EventData> = {};

      // Process all form fields
      for (const [key, value] of formData.entries()) {
        if (key === "thumbnail" || key === "eventImages") {
          // Handle image data
          if (typeof value === "string") {
            if (key === "eventImages") {
              if (!eventData.eventImages) eventData.eventImages = [];
              eventData.eventImages.push(value);
            } else {
              eventData[key] = value;
            }
          }
        } else if (key === "removedImages") {
          // Handle removed images
          if (!eventData.removedImages) eventData.removedImages = [];
          eventData.removedImages.push(value as string);
        } else {
          eventData[key] = value as string;
        }
      }

      // Both category and arabicCategory should use the same category ID
      if (eventData.category) {
        eventData.arabicCategory = eventData.category;
      }

      console.log("Sending update data:", eventData); // Debug log

      const response = await axiosInstance.patch(`/events/${id}`, eventData);
      useToastStore
        .getState()
        .showToast("Event updated successfully", "success");
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update event";
      useToastStore.getState().showToast(errorMessage, "error");
    }
  },

  deleteEvent: async (id: string) => {
    try {
      if (!id) throw new Error("Event ID is required for delete");

      await axiosInstance.delete(`/events/${id}`);
      useToastStore
        .getState()
        .showToast("Event deleted successfully", "success");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete event";
      useToastStore.getState().showToast(errorMessage, "error");
    }
  },
};
