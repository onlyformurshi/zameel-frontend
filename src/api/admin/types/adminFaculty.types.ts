export interface Faculty {
  _id: string;
  name: string;
  arabicName: string;
  position: string;
  arabicPosition: string;
  isLeadershipTeam: string;
  specialization: string[];
  arabicSpecialization: string[];
  bio: string;
  arabicBio: string;
  email: string;
  socialLinks: {
    linkedin?: string;
  };
  image: string;
}

export type CreateFacultyDto = Omit<Faculty, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateFacultyDto = Partial<CreateFacultyDto>;

export interface AdminFacultyAPI {
  getFaculty: () => Promise<Faculty[]>;
  createFaculty: (faculty: FormData) => Promise<Faculty>;
  updateFaculty: (id: string, faculty: FormData) => Promise<Faculty>;
  deleteFaculty: (id: string) => Promise<void>;
} 