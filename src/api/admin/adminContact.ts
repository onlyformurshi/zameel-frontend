import axiosInstance from "../axiosInstance/api";
import { ContactInfo, CreateContactInfoDto, UpdateContactInfoDto } from "./types/contact";

// Contact Info Operations
export const createContactInfo = async (data: CreateContactInfoDto): Promise<ContactInfo> => {
  const response = await axiosInstance.post('/contact/info', data);
  return response.data;
};

export const getContactInfo = async (): Promise<ContactInfo> => {
  const response = await axiosInstance.get('/contact/info');
  return response.data;
};

export const updateContactInfo = async (data: UpdateContactInfoDto): Promise<ContactInfo> => {
  const response = await axiosInstance.patch('/contact/info', data);
  return response.data;
};
