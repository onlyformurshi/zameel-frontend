export interface Event {
  _id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  date: string;
  time: string;
  location: string;
  arabicLocation: string;
  category: {
    _id: string;
    name: string;
  };
  arabicCategory: {
    _id: string;
    arabicName: string;
  };
  thumbnail: string;
  eventImages: string[];
}

export type CreateEventDto = Omit<Event, '_id'>;
export type UpdateEventDto = Partial<CreateEventDto>;

export interface AdminEventAPI {
  getEvents: () => Promise<Event[]>;
  createEvent: (event: FormData) => Promise<Event>;
  updateEvent: (id: string, event: FormData) => Promise<Event>;
  deleteEvent: (id: string) => Promise<void>;
} 