export interface Gallery {
  _id: string;
  title: string;
  arabicTitle: string;
  image: string;
  category: {
    _id: string;
    name: string;
  };
  arabicCategory: {
    _id: string;
    arabicName: string;
  };
}

export type CreateGalleryDto = Omit<Gallery, '_id'>;
export type UpdateGalleryDto = Partial<CreateGalleryDto>;

export interface GalleryCategory {
  _id: string;
  name: string;
  arabicName: string;
}

export interface AdminGalleryAPI {
  getGallery: () => Promise<Gallery[]>;
  createGallery: (gallery: FormData) => Promise<Gallery>;
  createGalleryCategory: (category: { name: string; arabicName: string }) => Promise<GalleryCategory>;
  updateGallery: (id: string, gallery: FormData) => Promise<Gallery>;
  deleteGallery: (id: string) => Promise<void>;
  deleteGalleryCategory: (id: string) => Promise<void>;
  getGalleryCategories: () => Promise<GalleryCategory[]>;
  updateGalleryCategory: (id: string, category: { name: string; arabicName: string }) => Promise<GalleryCategory>;
} 