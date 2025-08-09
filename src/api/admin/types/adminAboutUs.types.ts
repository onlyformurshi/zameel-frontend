export interface AboutUs {
  _id: string;
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  stats: {
    studentsEnrolled: number;
    successRate: number;
    expertEducators: number;
    yearsOfExcellence: number;
  };
  mission: string;
  missionArabic: string;
  vision: string;
  visionArabic: string;
}
    
export type CreateAboutUsDTO = Omit<AboutUs, '_id'>;
export type UpdateAboutUsDTO = Partial<CreateAboutUsDTO>; 