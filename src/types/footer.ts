export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
  _id?: string;
}

export interface CreateFooterDto {
  description: string;
  arabicDescription?: string;
  socialLinks: SocialLink[];
}

export interface Footer extends CreateFooterDto {
  _id: string;
  createdAt: string;
  updatedAt: string;
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