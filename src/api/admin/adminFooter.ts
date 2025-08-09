import axiosInstance from "../axiosInstance/api";
import { 
  CreateFooterDescriptionDto,
  Footer, 
  UpdateFooterDescriptionDto, 
  CreateSocialLinkDto,
  SocialLink,
} from './types/footer';

// Footer Description Operations
export const createFooterDescription = async (data: CreateFooterDescriptionDto): Promise<Footer> => {
  const response = await axiosInstance.post('/footer', data);
  return response.data;
};

export const getFooter = async (): Promise<Footer> => {
  const response = await axiosInstance.get('/footer');
  return response.data;
};

export const updateFooterDescription = async (
  data: UpdateFooterDescriptionDto
): Promise<Footer> => {
  const response = await axiosInstance.patch('/footer/description', data);
  return response.data;
};

// Social Links Operations
export const addSocialLink = async (
  data: CreateSocialLinkDto
): Promise<Footer> => {
  const response = await axiosInstance.post('/footer/social-links', data);
  return response.data;
};

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const response = await axiosInstance.get('/footer/social-links');
  return response.data;
};

export const updateSocialLink = async (
  linkId: string,
  data: Partial<CreateSocialLinkDto>
): Promise<Footer> => {
  const response = await axiosInstance.patch(`/footer/social-links/${linkId}`, data);
  return response.data;
};

export const deleteSocialLink = async (
  linkId: string
): Promise<Footer> => {
  const response = await axiosInstance.delete(`/footer/social-links/${linkId}`);
  return response.data;
};
