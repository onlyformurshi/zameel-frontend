export interface HeroSection {
  _id: string;
  title: string;
  arabicTitle: string;
  subtitle: string;
  arabicSubtitle: string;
}

export interface WhyChooseUs {
  _id: string;
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
}

export interface HomePageData {
  heroSection: HeroSection;
  whyChooseUs: WhyChooseUs[];
}

export type CreateHeroSectionDto = Omit<HeroSection, '_id'>;
export type UpdateHeroSectionDto = Partial<CreateHeroSectionDto>;

export type CreateWhyChooseUsDto = Omit<WhyChooseUs, '_id'>;
export type UpdateWhyChooseUsDto = Partial<CreateWhyChooseUsDto>;

export interface AdminHomeAPI {
  getHomePageData: () => Promise<HomePageData>;
  createHeroSection: (data: CreateHeroSectionDto) => Promise<HeroSection>;
  updateHeroSection: (id: string, data: UpdateHeroSectionDto) => Promise<HeroSection>;
  deleteHeroSection: (id: string) => Promise<void>;
  createWhyChooseUs: (data: CreateWhyChooseUsDto) => Promise<WhyChooseUs>;
  updateWhyChooseUs: (id: string, data: UpdateWhyChooseUsDto) => Promise<WhyChooseUs>;
  deleteWhyChooseUs: (id: string) => Promise<void>;
} 