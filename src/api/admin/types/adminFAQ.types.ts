export interface FAQCategory {
  _id: string;
  name: string;
  arabicName: string;
  order?: number;
}

export interface FAQ {
  _id: string;
  question: string;
  arabicQuestion: string;
  answer: string;
  arabicAnswer: string;
  category: FAQCategory;
  order?: number;
}

export interface CreateFAQDto {
  question: string;
  arabicQuestion: string;
  answer: string;
  arabicAnswer: string;
  category: string;
  order?: number;
}

export type UpdateFAQDto = Partial<CreateFAQDto>;

export interface AdminFAQAPI {
  getFAQs: () => Promise<FAQ[]>;
  getFAQCategories: () => Promise<FAQCategory[]>;
  createFAQ: (data: CreateFAQDto) => Promise<FAQ>;
  updateFAQ: (id: string, data: UpdateFAQDto) => Promise<FAQ>;
  deleteFAQ: (id: string) => Promise<void>;
  createFAQCategory: (data: Omit<FAQCategory, '_id'>) => Promise<FAQCategory>;
  updateFAQCategory: (id: string, data: Partial<Omit<FAQCategory, '_id'>>) => Promise<FAQCategory>;
  deleteFAQCategory: (id: string) => Promise<void>;
} 