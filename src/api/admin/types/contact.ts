export interface ContactDetail {
  label: string;
  value: string;
  arabicLabel: string;
  arabicValue: string;
}

export interface ContactInfo {
  _id?: string;
  whatsapp: string;
  address: ContactDetail;
  phone: ContactDetail;
  email: ContactDetail;
  officeHours: ContactDetail;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateContactInfoDto {
  whatsapp: string;
  address: ContactDetail;
  phone: ContactDetail;
  email: ContactDetail;
  officeHours: ContactDetail;
}

export interface UpdateContactInfoDto {
  whatsapp?: string;
  address?: ContactDetail;
  phone?: ContactDetail;
  email?: ContactDetail;
  officeHours?: ContactDetail;
} 