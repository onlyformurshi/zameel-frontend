export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
  _id?: string;
}

export interface CreateFooterDescriptionDto {
  description: string;
  arabicDescription?: string;
}

export interface UpdateFooterDescriptionDto {
  description?: string;
  arabicDescription?: string;
}

export interface CreateSocialLinkDto {
  platform: string;
  url: string;
  icon?: string;
}

export interface Footer {
  _id: string;
  description: string;
  arabicDescription?: string;
  socialLinks: SocialLink[];
  createdAt: string;
  updatedAt: string;
} 